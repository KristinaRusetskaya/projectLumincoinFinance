import {HttpUtils} from "../../../utils/http-utils";
import {ViewCategoriesResponseType} from "../../../types/view-categories-response.type";
import {SuccessResponseType} from "../../../types/action-category-response.type";

export class ViewCategories {
    readonly openNewRoute: Function;
    readonly popupElement: HTMLElement | null;
    readonly popupDeleteElement: HTMLElement | null;
    readonly popupNoDeleteElement: HTMLElement | null;
    readonly buttonCategoryElement: HTMLElement | null;
    readonly itemSvgElement: HTMLElement | null;
    readonly incomeElement: HTMLElement | null;
    readonly expenseElement: HTMLElement | null;

    constructor(openNewRoute: Function, type: string) {
        this.openNewRoute = openNewRoute;
        this.popupElement = document.getElementById('pop-up');
        this.popupDeleteElement = document.getElementById('delete');
        this.popupNoDeleteElement = document.getElementById('no-delete');
        this.createCategories(type).then();
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

    private showPopup(popupElement: HTMLElement, type: string): void {
        const than: ViewCategories = this;
        let elements: NodeListOf<HTMLElement> = document.querySelectorAll('.income-expenses-card-button.delete');
        for (let i: number = 0; i < elements.length; i++) {
            elements[i].onclick = function (): void {
                popupElement.style.display = 'flex';
                if (than.popupDeleteElement) {
                    than.popupDeleteElement.setAttribute('href', '/' + type + '-delete?id=' + elements[i].getAttribute('id'));
                    than.popupDeleteElement.setAttribute('id-category', elements[i].getAttribute('id') as string);
                }
            };
        }
    }

    private async createCategories(type: string): Promise<void> {
        const result: ViewCategoriesResponseType = await HttpUtils.request('/categories/' + type);
        console.log(result);
        if (result.redirect) {
            this.openNewRoute(result.redirect);
            return;
        }

        if (result.response) {
            const categoryArray: Array<SuccessResponseType> = result.response;
            categoryArray.forEach((category: SuccessResponseType): void => {
                const cardsElement: HTMLElement | null = document.getElementById('income-expenses-cards');
                const createElement: HTMLElement | null = document.getElementById('create');

                const cardElement: HTMLDivElement = document.createElement('div');
                const cardHeaderElement: HTMLHeadingElement = document.createElement('h4');
                const cardButtonsElement: HTMLDivElement = document.createElement('div');
                const cardAElement: HTMLAnchorElement = document.createElement('a');
                const cardButtonElement: HTMLButtonElement = document.createElement('button');

                cardElement.classList.add('income-expenses-card');
                cardHeaderElement.classList.add('income-expenses-card-header');
                cardButtonsElement.classList.add('income-expenses-card-buttons');
                cardAElement.classList.add('income-expenses-card-button', 'btn', 'btn-primary');
                cardButtonElement.classList.add('income-expenses-card-button', 'btn', 'btn-danger', 'delete');

                cardAElement.setAttribute('href', '/' + type + '-edit?id=' + category.id);
                cardAElement.setAttribute('type', 'button');
                cardButtonElement.setAttribute('type', 'button');
                cardButtonElement.setAttribute('id', category.id.toString());

                (cardsElement as HTMLElement).insertBefore(cardElement, createElement);
                cardElement.append(cardHeaderElement, cardButtonsElement);
                cardButtonsElement.append(cardAElement, cardButtonElement);

                cardHeaderElement.innerText = category.title;
                cardAElement.innerText = 'Редактировать';
                cardButtonElement.innerText = 'Удалить';

                if (this.popupElement) {
                    this.showPopup(this.popupElement, type);
                }
            })
            if (this.popupDeleteElement && this.popupNoDeleteElement) {
                this.popupDeleteElement.addEventListener('click', this.deleteCategory.bind(this));
                this.popupNoDeleteElement.addEventListener('click', () => {
                    (this.popupElement as HTMLElement).style.display = 'none';
                });
            }
        } else {
            console.log(result.error);
            return;
        }
    }

    private async deleteCategory(): Promise<void> {
        if (this.popupDeleteElement && this.popupElement) {
            const currentCategoryId: string | null = this.popupDeleteElement.getAttribute('id-category');
            this.popupElement.style.display = 'none';
            const currentCategory: HTMLElement | null = document.getElementById(currentCategoryId as string);
            if (currentCategory && currentCategory.parentElement && currentCategory.parentElement.parentElement) {
                currentCategory.parentElement.parentElement.remove();
            }
        }
    }

}