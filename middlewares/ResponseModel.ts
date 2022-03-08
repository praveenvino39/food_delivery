export const SendResponse = (status: boolean, message: string, response: any) => {
    return {
        status, message, response
    }
}