import { NextFunction, Request, Response } from "express";
import { DELIVERY_CHARGE, TAX_PERCENTAGE } from "../../AdminSetting";
import { CreateUserInput, LoginUserInput, AddAddressInput, CreateCartInput, CheckoutCODInput } from "../dto/User.dto";
import { SendResponse } from "../middlewares";
import { Food, FoodDoc, Vendor } from "../models";
import { Address, AddressDoc } from "../models/Address";
import { Cart, CartDoc } from "../models/Cart";
import { CartItem, CartProductDoc } from "../models/CartProduct";
import { City, CityDoc } from "../models/City";
import { Order } from "../models/Order";
import { User, UserDoc } from "../models/User";
import { GenerateOtp, GeneratePassword, GenerateSalt, GenerateToken, ValidatePassword } from "../utility";



export const TopRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.query.pincode
    if (pincode) {
        const vendors = await Vendor.find({ pincode }).sort([['rating', 'descending']])
        return res.status(200).json(SendResponse(true, "", vendors))
    }
    return res.status(400).json(SendResponse(false, "Pincode is required", null))
}


export const CreateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, phone, password, country, countryCode, city, currency } = <CreateUserInput>req.body;
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        if (existingUser.otpVerified) {
            return res.status(400).json(SendResponse(false, "User already exist. Try sign in.", null))
        } else {
            await existingUser.delete()
        }
    }


    var isCityAvailable = null
    try {
        isCityAvailable = await City.findOne({ _id: city })
        if (!isCityAvailable) {
            return res.status(200).json(SendResponse(false, "City is not available", null))
        }
    } catch {
        return res.status(200).json(SendResponse(false, "City id invalid", null))
    }

    //Generating password
    const salt = await GenerateSalt()
    const encrytedPassword = await GeneratePassword(password, salt)
    const otp = GenerateOtp()
    const user = await User.create({
        email,
        phone,
        password: encrytedPassword,
        salt,
        country,
        countryCode,
        city: city,
        currency,
        otp,
        otpVerified: false
    })
    return res.status(201).json(SendResponse(true, "User created successfully.", user))
}

export const VerifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(404).json(SendResponse(false, "User not found.", null))
    }
    if (user.otp == otp) {
        user.otpVerified = true
        const verifiedUser = await user.save()
        return res.status(404).json(SendResponse(true, "Otp verified successfully.", verifiedUser))
    }
    return res.status(400).json(SendResponse(false, "Otp is invalid.", null))
}

export const LoginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <LoginUserInput>req.body;
    const user = await User.findOne({ email })

    // Checking vendor exist
    if (user) {
        //Checking password
        if (await ValidatePassword(password, user.password, user.salt)) {
            const token = await GenerateToken(req.body)
            return res.status(200).json(SendResponse(true, "User login successfully.", { token, user }))
        } else {
            return res.status(400).json(SendResponse(false, "User email or password invalid", null))
        }
    }
    return res.status(400).json(SendResponse(false, "User not found", null))
}

export const AddAddress = async (req: Request, res: Response, next: NextFunction) => {
    const { doorNo, address, lat, long, pincode } = <AddAddressInput>req.body;
    const user = req.user;
    if (user) {
        const userData = await User.findOne({ email: user.email }).populate("address");
        if (userData) {
            const newAddress = await Address.create({
                userID: userData.id,
                doorNo, address, lat, long, pincode
            })
            userData.userAddress = newAddress;
            const savedAddress = await (await userData.save()).populate("address")
            return res.status(200).json(SendResponse(true, "Address added successfull", savedAddress))
        }
    }
    return res.status(400).json(SendResponse(false, "User not found", null))
}

export const AddToCart = async (req: Request, res: Response, next: NextFunction) => {
    const { productID, quantity } = <CreateCartInput>req.body;
    const user = req.user;
    if (user) {
        const food = await Food.findOne({ _id: productID })
        const userData = await User.findOne({ email: req.user.email }).populate("cart")
        if (!food) {
            return res.json(SendResponse(false, "Selected food not available", null))
        }
        if (userData) {
            var cart = await Cart.findOne({ userID: userData.id, status: "AVAILABLE" }).populate({ path: "products", populate: { path: "product", model: "food" } })
            //Check user has a cart
            if (cart) {
                const exitingFood = cart.products.find((cartProduct: CartProductDoc) => cartProduct.product.id == food.id)
                //Checking cart already has selected food
                if (exitingFood) {
                    //Checking request has quantity. Update given quantity if exist or add one quantity. if it is 0 then it will delete that product
                    if (quantity) {
                        if (quantity != 0) {
                            (exitingFood as CartProductDoc).quantity = quantity
                        } else {
                            await exitingFood.remove()
                            cart = await Cart.findOne({ userID: userData.id }).populate({ path: "products", populate: { path: "product", model: "food" } })
                            return res.status(200).json(SendResponse(true, "Selected food added to the cart", cart))
                        }
                    } else {
                        (exitingFood as CartProductDoc).quantity++
                    }
                    await exitingFood.save()
                    return res.status(200).json(SendResponse(true, "Selected food added to the cart", cart))
                } else {
                    //Create a pushing selected foods to cart
                    const cartProduct = await CartItem.create({ product: food, quantity: 1 })
                    cart.products.push(cartProduct)
                    await cart.save()
                    return res.status(200).json(SendResponse(true, "Selected food added to the cart", cart))
                }
            } else {
                //Creating new cart
                const cartProduct = await CartItem.create({ product: food, quantity: 1 })
                const newCart = await Cart.create({ userID: userData.id, vendorID: food.vendorId, products: [cartProduct] })
                return res.status(200).json(SendResponse(true, "Selected food added to the cart", newCart))
            }
        }
    }
    return res.status(400).json(SendResponse(false, "User not authorized.", null))

}



export const ViewCart = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
        const userData = await User.findOne({ email: user.email }).populate("address");
        if (!userData) {
            return res.status(400).json(SendResponse(false, "User not found", null))
        }
        let userLat = 0.0
        let userLong = 0.0
        if (userData.userAddress) {
            userLat = (userData.userAddress as AddressDoc).lat
            userLong = (userData.userAddress as AddressDoc).long
        }
        const cart = await Cart.findOne({ userID: userData.id, status: "AVAILABLE" }).populate({ path: "products", populate: { path: "product", model: "food" } })
        if (!cart) {
            return res.status(200).json(SendResponse(true, "", []))
        }
        const vendorData = await Vendor.findOne({ vendorID: cart.vendorID })
        if (!vendorData) {
            return res.status(200).json(SendResponse(false, "Vendor not available", null))
        }
        const vendorLat = vendorData.lat
        const vendorLong = vendorData.long
        let itemtotal = 0
        cart.products.map((cartItem: CartProductDoc) => itemtotal = itemtotal + ((cartItem.product as FoodDoc).price * cartItem.quantity))
        let taxAmount = (itemtotal * TAX_PERCENTAGE) / 100
        let taxPercentage = TAX_PERCENTAGE
        itemtotal = Math.floor(itemtotal)
        let deliveryCharge = DELIVERY_CHARGE
        let payable = Math.floor(taxAmount + itemtotal + deliveryCharge)
        const invoice = {
            itemTotal: itemtotal,
            taxAmount: taxAmount,
            payable: payable,
            deliveryCharge: deliveryCharge,
            currencyCode: userData.currency,
            taxPercentage: taxPercentage
        }
        return res.status(200).json(SendResponse(true, "", {
            cart: cart.products,
            invoice

        }))
    }
    return res.status(400).json(SendResponse(false, "User not found", null))
}


export const Checkout = async (req: Request, res: Response, next: NextFunction) => {
    const { note, paymentMode, paymentID } = <CheckoutCODInput>req.body
    const user = req.user;
    if (user) {
        const userData = await User.findOne({ email: user.email }).populate("address");
        if (!userData) {
            return res.status(400).json(SendResponse(false, "User not found", null))
        }
        if (paymentMode == "ONLINE" && paymentID == null) {
            return res.status(400).json(SendResponse(false, "For placing online order 'paymentID' field is required.", null))
        }
        let userLat = 0.0
        let userLong = 0.0
        if (userData.userAddress) {
            userLat = (userData.userAddress as AddressDoc).lat
            userLong = (userData.userAddress as AddressDoc).long
        }

        const cart = await Cart.findOne({ userID: userData.id, status: "AVAILABLE" }).populate({ path: "products", populate: { path: "product", model: "food" } })
        if (!cart) {
            return res.status(200).json(SendResponse(false, "Your cart is empty", null))
        }
        const vendorData = await Vendor.findOne({ vendorID: cart.vendorID })
        if (!vendorData) {
            return res.status(200).json(SendResponse(false, "Vendor not available", null))
        }
        if (userData.city.toString() !== vendorData.city.toString()) {
            return res.status(400).json(SendResponse(false, `Not possible to delivery your order. City limit range exceeds.`, null))
        }
        const vendorLat = vendorData.lat
        const vendorLong = vendorData.long
        let itemtotal = 0
        cart.products.map((cartItem: CartProductDoc) => itemtotal = itemtotal + ((cartItem.product as FoodDoc).price * cartItem.quantity))
        let taxAmount = (itemtotal * TAX_PERCENTAGE) / 100
        let taxPercentage = TAX_PERCENTAGE
        itemtotal = Math.floor(itemtotal)
        let deliveryCharge = DELIVERY_CHARGE
        let payable = Math.floor(taxAmount + itemtotal + deliveryCharge)
        const invoice = {
            itemTotal: itemtotal,
            taxAmount: taxAmount,
            payable: payable,
            deliveryCharge: deliveryCharge,
            currencyCode: userData.currency,
            taxPercentage: taxPercentage
        }
        const order = await Order.create({
            user: userData,
            vendor: vendorData,
            cart: cart,
            itemTotal: itemtotal,
            taxAmount,
            payable,
            deliveryCharge,
            currencyCode: invoice.currencyCode,
            taxPercentage,
            paymentMode,
            note,
            paymentID: paymentMode == "ONLINE" ? paymentID : null,
        })
        cart.status = "ORDERED"
        await cart.save()
        return res.status(200).json(SendResponse(true, `Order placed successfully with payment type ${paymentMode}`, order))
    }
    return res.status(400).json(SendResponse(false, "User not found", null))
}
