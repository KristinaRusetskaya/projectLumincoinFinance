export type ActionTransactionResponseType = {
    error: boolean,
    response:  SuccessTransactionResponseType | { error: boolean, message: string }
    redirect?: string
}

export type SuccessTransactionResponseType = {
    id: number,
    type: string,
    amount: number,
    date: string,
    comment: string,
    category: string
}

