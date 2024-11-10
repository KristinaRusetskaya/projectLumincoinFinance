import {HttpUtils} from "../../../utils/http-utils";
import {
    ActionTransactionResponseType,
    SuccessTransactionResponseType
} from "../../../types/action-transaction-response.type";
import {ViewCategoriesResponseType} from "../../../types/view-categories-response.type";
import {SuccessResponseType} from "../../../types/action-category-response.type";
import {TransactionCreateBodyType} from "../../../types/transaction-create-body.type";

export class TransactionEdit {
    readonly openNewRoute: Function;
    readonly buttonIncomeExpenses: HTMLElement | null | undefined;
    readonly typeSelectElement: HTMLElement | null | undefined;
    readonly categorySelectElement: HTMLElement | null | undefined;
    readonly amountInputElement: HTMLElement | null | undefined;
    readonly dateInputElement: HTMLElement | null | undefined;
    readonly commentInputElement: HTMLElement | null | undefined;
    readonly saveButtonElement: HTMLElement | null | undefined;

    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;

        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        const id: string | null = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/transaction');
        }

        this.buttonIncomeExpenses = document.getElementById("button-income-expenses");
        if (this.buttonIncomeExpenses) {
            this.buttonIncomeExpenses.classList.add("active");
        }

        this.typeSelectElement = document.getElementById("type");
        this.categorySelectElement = document.getElementById("category");
        this.amountInputElement = document.getElementById("amount");
        this.dateInputElement = document.getElementById("date");
        this.commentInputElement = document.getElementById("comment");

        this.saveButtonElement = document.getElementById('save');
        this.getCurrentOperation(id).then();

        if (this.saveButtonElement) {
            this.saveButtonElement.addEventListener('click', this.editCurrentCategory.bind(this, id));
        }

        if (this.typeSelectElement) {
            this.typeSelectElement.addEventListener("change", this.createSelectCategory.bind(this, null, (this.typeSelectElement as HTMLSelectElement).value));
        }
    }

    private async getCurrentOperation(id: string): Promise<void> {

        const result: ActionTransactionResponseType = await HttpUtils.request('/operations/' + id);
        if (result.redirect) {
            this.openNewRoute(result.redirect);
            return;
        }

        if (result.error) {
            alert('Возникла ошибка при редактировании операции. Обратитесь в поддержку.');
            return;
        }

        if (!result.error && result.response) {
            const currentOperation: SuccessTransactionResponseType = result.response as SuccessTransactionResponseType;
            this.createSelectCategory(currentOperation, currentOperation.type).then();
        }
    }

    private setCurrent(currentOperation: SuccessTransactionResponseType): void {
        (this.typeSelectElement as HTMLSelectElement).value = currentOperation.type;

        const categoriesArray: HTMLElement[] = Array.from(document.querySelectorAll('#category option'));
        const currentCategory: HTMLElement | undefined = categoriesArray.find((category: HTMLElement): boolean => {
            return category.innerText === currentOperation.category;
        });
        (this.categorySelectElement as HTMLSelectElement).value = (currentCategory as HTMLSelectElement).value;

        (this.amountInputElement as HTMLInputElement).value = String(currentOperation.amount);
        (this.dateInputElement as HTMLInputElement).value = currentOperation.date;
        (this.commentInputElement as HTMLInputElement).value = currentOperation.comment;

    }

    private async createSelectCategory(result:  SuccessTransactionResponseType | null, type: string): Promise<void> {
        if (this.categorySelectElement) {
            this.categorySelectElement.innerHTML = "";
        }

        if (type) {
            const result: ViewCategoriesResponseType = await HttpUtils.request('/categories/' + type);

            if (result.redirect) {
                this.openNewRoute(result.redirect);
                return;
            }

            if (result.error || !result.response) {
                alert('Возникла ошибка при отображении категорий. Обратитесь в поддержку.');
                return;
            }

            result.response.forEach((select: SuccessResponseType): void => {
                const optionCategoryElement: HTMLOptionElement = document.createElement("option");
                optionCategoryElement.setAttribute('value', select.id.toString());
                optionCategoryElement.innerText = select.title;
                if (this.categorySelectElement) {
                    this.categorySelectElement.append(optionCategoryElement);
                }
            })
        }

        if (result) {
            this.setCurrent(result);
        }
    }

    private async editCurrentCategory(id: string): Promise<void> {
        if (this.amountInputElement && this.dateInputElement && this.commentInputElement) {
            this.amountInputElement.classList.remove('is-invalid');
            this.dateInputElement.classList.remove('is-invalid');
            this.commentInputElement.classList.remove('is-invalid');
            this.dateInputElement.removeAttribute('style');
        }

        const body: TransactionCreateBodyType = {
            type: (this.typeSelectElement as HTMLSelectElement).value,
            amount: Number((this.amountInputElement as HTMLInputElement).value),
            date: (this.dateInputElement as HTMLInputElement).value,
            comment: (this.commentInputElement as HTMLInputElement).value,
            category_id: Number((this.categorySelectElement as HTMLSelectElement).value)
        }

        if ((this.amountInputElement as HTMLInputElement).value && (this.dateInputElement as HTMLInputElement).value && (this.commentInputElement as HTMLInputElement).value) {
            const result: ActionTransactionResponseType = await HttpUtils.request('/operations/' + id, 'PUT', true, body);

            if (result.redirect) {
                this.openNewRoute(result.redirect);
                return;
            }

            this.openNewRoute('/transaction');
        } else {
            if (this.amountInputElement && this.dateInputElement && this.commentInputElement) {
                this.amountInputElement.classList.add('is-invalid');
                this.dateInputElement.classList.add('is-invalid');
                this.commentInputElement.classList.add('is-invalid');
                this.dateInputElement.style.borderColor = 'red'
            }
        }
    }
}