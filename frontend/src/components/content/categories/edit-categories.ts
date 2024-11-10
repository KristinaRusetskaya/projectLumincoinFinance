import {HttpUtils} from "../../../utils/http-utils";
import {ActionCategoryResponseType, SuccessResponseType} from "../../../types/action-category-response.type";
import {EditCategoryResponseType} from "../../../types/edit-category-response.type";

export class EditCategories {
    readonly openNewRoute: Function;
    readonly titleInputElement: HTMLElement | null | undefined;
    readonly saveButtonElement: HTMLElement | null | undefined;
    readonly buttonCategoryElement: HTMLElement | null | undefined;
    readonly itemSvgElement: HTMLElement | null | undefined;
    readonly incomeElement: HTMLElement | null | undefined;
    readonly expenseElement: HTMLElement | null | undefined;

    constructor(openNewRoute: Function, type: string) {
        this.openNewRoute = openNewRoute;
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        const id: string | null = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/' + type);
        }

        this.titleInputElement = document.getElementById('title-input');
        this.saveButtonElement = document.getElementById('save');
        this.getCurrentCategory(id, type).then();

        if (this.saveButtonElement) {
            this.saveButtonElement.addEventListener('click', this.editCurrentCategory.bind(this, id, type));
        }
        this.buttonCategoryElement = document.getElementById("button-category");
        this.itemSvgElement = document.getElementById("item-svg");
        this.incomeElement = document.getElementById("income");
        this.expenseElement = document.getElementById("expense");

        this.showButtonCategory(type);
    }

    private showButtonCategory(type:  string): void {
        if (type === 'income' && this.incomeElement) {
            this.incomeElement.classList.add("active");
        } else if (type === 'expense' && this.expenseElement) {
            this.expenseElement.classList.add("active");
        }
        if (this.buttonCategoryElement && this.buttonCategoryElement.parentElement && this.itemSvgElement) {
            this.buttonCategoryElement.classList.add('active');
            this.buttonCategoryElement.parentElement.classList.add('menu-is-opening');
            this.buttonCategoryElement.parentElement.classList.add('menu-open');
            this.itemSvgElement.classList.add('rotate');
        }
    }

    private async getCurrentCategory(id: string, type: string): Promise<void> {

        const result: ActionCategoryResponseType = await HttpUtils.request('/categories/' + type + '/' + id);
        if (result.redirect) {
            this.openNewRoute(result.redirect);
            return;
        }

        if (result.error) {
            alert('Возникла ошибка при редактировании категории. Обратитесь в поддержку.');
            return;
        }

        const response: SuccessResponseType = result.response as SuccessResponseType
        if (!result.error && response) {
            (this.titleInputElement as HTMLInputElement).value = response.title;
        }
    }

    private async editCurrentCategory(id: string, type: string): Promise<void> {
        if (this.titleInputElement) {
            this.titleInputElement.classList.remove('is-invalid');
        }

        if ((this.titleInputElement as HTMLInputElement).value) {
            const result: EditCategoryResponseType = await HttpUtils.request('/categories/' + type + '/' + id, 'PUT', true, {
                title: (this.titleInputElement as HTMLInputElement).value
            });
            if (result.redirect) {
                this.openNewRoute(result.redirect);
                return;
            }

            this.openNewRoute('/' + type);
        } else {
            if (this.titleInputElement) {
                this.titleInputElement.classList.add('is-invalid');
            }
        }

    }
}