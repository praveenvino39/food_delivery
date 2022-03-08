import { UserPayload } from './User.dto';
import { VendorPayload } from './Vendor.dto'


export type AuthPayload = VendorPayload | UserPayload  ;