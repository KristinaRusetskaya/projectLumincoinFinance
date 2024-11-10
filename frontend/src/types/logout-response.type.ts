export type LogoutResponseType = {
    error: boolean,
    response: { error: boolean, message: string, validation?: { key: string, message: string, } }
    redirect?: string
}