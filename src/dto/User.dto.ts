

export interface CreateUserInput {
    phone: string;
    email: string;
    password: string;
    country: string,
    countryCode: string;
    currency: string;
    city: string;
}


export interface VerifyOtpInput {
    email: string;
    otp: string
}


export interface CreateAddressInput {
    userID: string
    doorNo: string,
    address: string,
    lat: number,
    long: number,
    pincode: string
}

export interface LoginUserInput{
    email:string,
    password: string
}

export interface AddAddressInput{
    doorNo:string,
    address: string,
    lat: number,
    long: number,
    pincode: string,
}

export interface CreateCartInput {
    productID: string,
    quantity: number|null
}



export interface CheckoutCODInput {
    note: string|null,
    paymentMode: string|null,
    paymentID: string|null,
}
    

export interface UserPayload {
    _id: string,
    name: string,
    email: string,
    phone: string,
    addressID: string,
}


