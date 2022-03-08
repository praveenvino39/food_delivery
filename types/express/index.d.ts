import { AuthPayload } from "../../dto";

declare module Express {
    export interface Request {
        user?:AuthPayload
    }
}