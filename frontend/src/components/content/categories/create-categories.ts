import {HttpUtils} from "../../../utils/http-utils";
import {ActionCategoryResponseType} from "../../../types/action-category-response.type";

export class CreateCategories {
    readonly openNewRoute: Function;
    readonly titleInputElement: HTMLElement | null;
    readonly saveElement: HTMLElement | null;
    readonly buttonCategoryElement: HTMLElement | null;
    readonly itemSvgElement: HTMLElement | null;
    readonly incomeElement: HTMLElement | null;
    readonly expenseElement: HTMLElement | null;


    constructor(openNewRoute: Function, type: string) {
        this.openNewRoute = openNewRoute;

        this.titleInputElement = document.getElementById("title-input");
        this.saveElement = document.getElementById("save");

        if (this.saveElement) {
            this.saveElement.addEventListener("click", this.createCategory.bind(this, type));
        }
        this.buttonCategoryElement = document.getElementById("button-category");
        this.itemSvgElement = document.getElementById("item-svg");
        this.incomeElement = document.getElementById("income");
        this.expenseElement = document.getElementById("expense");

        this.showButtonCategory(type);
    }

    private showButtonCategory(type: string): void {
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

    private async createCategory(type: string): Promise<void> {
        if (this.titleInputElement) {
            this.titleInputElement.classList.remove('is-invalid');
        }

        if (this.titleInputElement) {
            const result: ActionCategoryResponseType = await HttpUtils.request('/categories/' + type, 'POST', true, {
                title: (this.titleInputElement as HTMLInputElement).value
            });
            console.log(result);

            if (result.redirect) {
                this.openNewRoute(result.redirect);
                return;
            }

            if (result.error) {
                alert('Возникла ошибка при создании категории. Обратитесь в поддержку.');
                return;
            }

            this.openNewRoute('/' + type);
        } else {
            if (this.titleInputElement) {
                (this.titleInputElement as HTMLInputElement).classList.add('is-invalid');
            }
        }
    }
}