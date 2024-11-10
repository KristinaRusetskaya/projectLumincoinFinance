export type TransactionCreateBodyType = {
    type: string,
    amount: number,
    date: string,
    comment: string,
    category_id: number
}