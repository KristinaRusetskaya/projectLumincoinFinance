import {SuccessResponseType} from "./action-category-response.type";

export type ViewCategoriesResponseType = {
    error: boolean,
    response:  Array<SuccessResponseType>
    redirect?: string
}