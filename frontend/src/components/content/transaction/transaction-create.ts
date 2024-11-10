import {HttpUtils} from "../../../utils/http-utils";
import {ViewCategoriesResponseType} from "../../../types/view-categories-response.type";
import {SuccessResponseType} from "../../../types/action-category-response.type";
import {TransactionCreateBodyType} from "../../../types/transaction-create-body.type";
import {ActionTransactionResponseType} from "../../../types/action-transaction-response.type";

export class TransactionCreate {
    readonly openNewRoute: Function;
    readonly buttonIncomeExpenses: HTMLElement | null;
    readonly typeSelectElement: HTMLElement | null;
    readonly categorySelectElement: HTMLElement | null;
    readonly amountInputElement: HTMLElement | null;
    readonly dateInputElement: HTMLElement | null;
    readonly commentInputElement: HTMLElement | null;
    readonly saveElement: HTMLElement | null;
    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        const type: string | null = urlParams.get('type');

        this.buttonIncomeExpenses = document.getElementById("button-income-expenses");
        if (this.buttonIncomeExpenses) {
            this.buttonIncomeExpenses.classList.add("active");
        }

        this.typeSelectElement = document.getElementById("type");
        (this.typeSelectElement as HTMLSelectElement).value = type as string;
        this.categorySelectElement = document.getElementById("category");
        this.amountInputElement = document.getElementById("amount");
        this.dateInputElement = document.getElementById("date");
        this.commentInputElement = document.getElementById("comment");

        this.saveElement = document.getElementById("save");

        if (this.saveElement) {
            this.saveElement.addEventListener("click", this.createOperation.bind(this));
        }
        if (this.typeSelectElement) {
            this.typeSelectElement.addEventListener("change", this.createSelectCategory.bind(this));
        }
        this.createSelectCategory().then();
    }

    private async createSelectCategory(): Promise<void> {
        if (this.categorySelectElement) {
            this.categorySelectElement.innerHTML = "";
        }
        const type: string = (this.typeSelectElement as HTMLSelectElement).value;

        if (type) {
            const result: ViewCategoriesResponseType = await HttpUtils.request('/categories/' + type);
            if (result.redirect) {
                this.openNewRoute(result.redirect);
                return;
            }

            if (result.error || !result.response) {
                alert('Возникла ошибка при создании категорий. Обратитесь в поддержку.');
                return;
            }

            const response: Array<SuccessResponseType> = result.response as Array<SuccessResponseType>;
            response.forEach((select: SuccessResponseType): void => {
                const optionCategoryElement: HTMLOptionElement = document.createElement("option");
                optionCategoryElement.setAttribute('value', select.id.toString());
                optionCategoryElement.innerText = select.title;
                if (this.categorySelectElement) {
                    this.categorySelectElement.append(optionCategoryElement);
                }
            })
        }
    }

    private async createOperation(): Promise<void> {
        if (this.amountInputElement && this.dateInputElement && this.commentInputElement) {
            this.amountInputElement.classList.remove('is-invalid');
            this.dateInputElement.classList.remove('is-invalid');
            this.commentInputElement.classList.remove('is-invalid');
            this.dateInputElement.removeAttribute('style');
        }


        if (this.amountInputElement && !(this.amountInputElement as HTMLInputElement).value) {
            this.amountInputElement.classList.add('is-invalid');
            return;
        }

        if (this.dateInputElement && !(this.dateInputElement as HTMLInputElement).value) {
            this.dateInputElement.classList.add('is-invalid');
            this.dateInputElement.style.borderColor = 'red'
            return;
        }

        if (this.commentInputElement && !(this.commentInputElement as HTMLInputElement).value) {
            this.commentInputElement.classList.add('is-invalid');
            return;
        }

        let body: TransactionCreateBodyType = {
            type: (this.typeSelectElement as HTMLSelectElement).value,
            amount: Number((this.amountInputElement as HTMLInputElement).value),
            date: (this.dateInputElement as HTMLInputElement).value,
            comment: (this.commentInputElement as HTMLInputElement).value,
            category_id: Number((this.categorySelectElement as HTMLSelectElement).value)
        }

        if (body) {
            const result: ActionTransactionResponseType = await HttpUtils.request('/operations', 'POST', true, body);
            if (result.redirect) {
                this.openNewRoute(result.redirect);
                return;
            }

            if (result.error || !result.response) {
                alert('Возникла ошибка при создании операции. Обратитесь в поддержку.');
                return;
            }
            this.openNewRoute('/transaction');
        } else {
            if (this.amountInputElement && this.dateInputElement && this.commentInputElement) {
                this.amountInputElement.classList.add('is-invalid');
                this.dateInputElement.classList.add('is-invalid');
                this.dateInputElement.style.borderColor = 'red'
                this.commentInputElement.classList.add('is-invalid');
            }
        }

    }
}