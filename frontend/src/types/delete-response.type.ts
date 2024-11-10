export type DeleteResponseType = {
    error: boolean,
    response: { error: boolean, message: string }
    redirect?: string
}