
export interface CreateVendorInput {
    name: string;
    ownerName: string;
    cusine: [string];
    pincode: string;
    address: string;
    lat: number,
    long: number,
    phone: string;
    email: string;
    password: string;
    coverImages: [string];
    country: string,
    countryCode: string;
    currency: string;
    cityID: string
}


export interface UpdateVendorInput {
    name: string,
    ownerName: string,
    address: string,
    pincode: string,
    lat: number,
    long: number,
    phone: string,
    cusine: [string]
}

export interface LoginVendorInput {
    email: string,
    password: string,
}



export interface VendorPayload {
    _id: string,
    name: string,
    email: string,
    cusine: string,
    phone: string
}
