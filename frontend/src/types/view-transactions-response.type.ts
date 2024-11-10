import {SuccessTransactionResponseType} from "./action-transaction-response.type";

export type ViewTransactionsResponseType = {
    error: boolean,
    response: Array<SuccessTransactionResponseType>,
    redirect?: string
}
