import {HttpUtils} from "../../../utils/http-utils.js";

export class Income {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.incomePopupElement = document.getElementById('pop-up');
        this.incomePopupDeleteElement = document.getElementById('delete');
        this.incomePopupNoDeleteElement = document.getElementById('no-delete');
        this.createCategoriesIncome().then();
        this.buttonCategoryElement = document.getElementById("button-category");
        this.itemSvgElement = document.getElementById("item-svg");
        this.incomeElement = document.getElementById("income");

        this.showButtonCategory();
    }

    showButtonCategory() {
        this.incomeElement.classList.add("active");
        this.buttonCategoryElement.classList.add('active');
        this.buttonCategoryElement.parentElement.classList.add('menu-is-opening');
        this.buttonCategoryElement.parentElement.classList.add('menu-open');
        this.itemSvgElement.classList.add('rotate');
    }

    showPopup(popupElement) {
        const than = this;
        let elements = document.querySelectorAll('.income-expenses-card-button.delete');
        for (let i = 0; i < elements.length; i++) {
            elements[i].onclick = function(){
                popupElement.style.display = 'flex';
                than.incomePopupDeleteElement.setAttribute('href', '/income-delete?id=' + elements[i].getAttribute('id'));
                than.incomePopupDeleteElement.setAttribute('id-category', elements[i].getAttribute('id'));
            };
        }
    }

    async createCategoriesIncome() {
        const result = await HttpUtils.request('/categories/income');

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.response) {
            const incomeCategoryArray = result.response;
            incomeCategoryArray.forEach(category => {
                this.incomeCardsElement = document.getElementById('income-expenses-cards');
                this.incomeCreateElement = document.getElementById('income-create');

                this.incomeCardElement = document.createElement('div');
                this.incomeCardHeaderElement = document.createElement('h4');
                this.incomeCardButtonsElement = document.createElement('div');
                this.incomeCardAElement = document.createElement('a');
                this.incomeCardButtonElement = document.createElement('button');

                this.incomeCardElement.classList.add('income-expenses-card');
                this.incomeCardHeaderElement.classList.add('income-expenses-card-header');
                this.incomeCardButtonsElement.classList.add('income-expenses-card-buttons');
                this.incomeCardAElement.classList.add('income-expenses-card-button', 'btn', 'btn-primary');
                this.incomeCardButtonElement.classList.add('income-expenses-card-button', 'btn', 'btn-danger', 'delete');

                this.incomeCardAElement.setAttribute('href', '/income-edit?id=' + category.id);
                this.incomeCardAElement.setAttribute('type', 'button');
                this.incomeCardButtonElement.setAttribute('type', 'button');
                this.incomeCardButtonElement.setAttribute('id', category.id);

                this.incomeCardsElement.insertBefore(this.incomeCardElement, this.incomeCreateElement);
                this.incomeCardElement.append(this.incomeCardHeaderElement, this.incomeCardButtonsElement);
                this.incomeCardButtonsElement.append(this.incomeCardAElement, this.incomeCardButtonElement);

                this.incomeCardHeaderElement.innerText = category.title;
                this.incomeCardAElement.innerText = 'Редактировать';
                this.incomeCardButtonElement.innerText = 'Удалить';

                this.showPopup(this.incomePopupElement);
            })
            this.incomePopupDeleteElement.addEventListener('click', this.deleteCategoryIncome.bind(this));
            this.incomePopupNoDeleteElement.addEventListener('click', () => {this.incomePopupElement.style.display = 'none';});
        } else {
            console.log(result.error);
            return;
        }
    }

    async deleteCategoryIncome() {
        const currentCategoryId = this.incomePopupDeleteElement.getAttribute('id-category');
        this.incomePopupElement.style.display = 'none';
        const currentCategory = document.getElementById(currentCategoryId);
        currentCategory.parentElement.parentElement.remove();
    }
}
