import {HttpUtils} from "../../../utils/http-utils.js";

export class ViewCategories {
    constructor(openNewRoute, type) {
        this.openNewRoute = openNewRoute;
        this.popupElement = document.getElementById('pop-up');
        this.popupDeleteElement = document.getElementById('delete');
        this.popupNoDeleteElement = document.getElementById('no-delete');
        this.createCategories(type).then();
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
                than.popupDeleteElement.setAttribute('href', '/income-delete?id=' + elements[i].getAttribute('id'));
                than.popupDeleteElement.setAttribute('id-category', elements[i].getAttribute('id'));
            };
        }
    }

    async createCategories(type) {
        const result = await HttpUtils.request('/categories/' + type);

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.response) {
            const categoryArray = result.response;
            categoryArray.forEach(category => {
                this.cardsElement = document.getElementById('income-expenses-cards');
                this.createElement = document.getElementById('create');

                this.cardElement = document.createElement('div');
                this.cardHeaderElement = document.createElement('h4');
                this.cardButtonsElement = document.createElement('div');
                this.cardAElement = document.createElement('a');
                this.cardButtonElement = document.createElement('button');

                this.cardElement.classList.add('income-expenses-card');
                this.cardHeaderElement.classList.add('income-expenses-card-header');
                this.cardButtonsElement.classList.add('income-expenses-card-buttons');
                this.cardAElement.classList.add('income-expenses-card-button', 'btn', 'btn-primary');
                this.cardButtonElement.classList.add('income-expenses-card-button', 'btn', 'btn-danger', 'delete');

                this.cardAElement.setAttribute('href', '/income-edit?id=' + category.id);
                this.cardAElement.setAttribute('type', 'button');
                this.cardButtonElement.setAttribute('type', 'button');
                this.cardButtonElement.setAttribute('id', category.id);

                this.cardsElement.insertBefore(this.cardElement, this.createElement);
                this.cardElement.append(this.cardHeaderElement, this.cardButtonsElement);
                this.cardButtonsElement.append(this.cardAElement, this.cardButtonElement);

                this.cardHeaderElement.innerText = category.title;
                this.cardAElement.innerText = 'Редактировать';
                this.cardButtonElement.innerText = 'Удалить';

                this.showPopup(this.popupElement);
            })
            this.popupDeleteElement.addEventListener('click', this.deleteCategory.bind(this));
            this.popupNoDeleteElement.addEventListener('click', () => {this.popupElement.style.display = 'none';});
        } else {
            console.log(result.error);
            return;
        }
    }

    async deleteCategory() {
        const currentCategoryId = this.popupDeleteElement.getAttribute('id-category');
        this.popupElement.style.display = 'none';
        const currentCategory = document.getElementById(currentCategoryId);
        currentCategory.parentElement.parentElement.remove();
    }

}