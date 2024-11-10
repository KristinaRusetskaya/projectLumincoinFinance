export type ActionCategoryResponseType = {
    error: boolean,
    response:  SuccessResponseType | { error: boolean, message: string }
    redirect?: string
}

export type SuccessResponseType = { id: number, title: string }