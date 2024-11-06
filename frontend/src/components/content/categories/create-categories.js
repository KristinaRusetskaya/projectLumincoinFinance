import {HttpUtils} from "../../../utils/http-utils";

export class CreateCategories {
    constructor(openNewRoute, type) {
        this.openNewRoute = openNewRoute;

        this.titleInputElement = document.getElementById("title-input");
        this.saveElement = document.getElementById("save");

        this.saveElement.addEventListener("click", this.createCategory.bind(this, type));
        this.buttonCategoryElement = document.getElementById("button-category");
        this.itemSvgElement = document.getElementById("item-svg");
        this.incomeElement = document.getElementById("income");
        this.expenseElement = document.getElementById("expense");

        this.showButtonCategory(type);
    }

    showButtonCategory(type) {
        if (type === 'income') {
            this.incomeElement.classList.add("active");
        } else if (type === 'expense') {
            this.expenseElement.classList.add("active");
        }
        this.buttonCategoryElement.classList.add('active');
        this.buttonCategoryElement.parentElement.classList.add('menu-is-opening');
        this.buttonCategoryElement.parentElement.classList.add('menu-open');
        this.itemSvgElement.classList.add('rotate');
    }

    async createCategory(type) {
        this.titleInputElement.classList.remove('is-invalid');

        if (this.titleInputElement.value) {
            const result = await HttpUtils.request('/categories/' + type, 'POST', true, {
                title: this.titleInputElement.value
            });

            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (result.error || !result.response || (result.response && (result.response.error || !result.response.title|| !result.response.id))) {
                return alert('Возникла ошибка при создании категории. Обратитесь в поддержку.');
            }

            this.openNewRoute('/' + type);
        } else {
            this.titleInputElement.classList.add('is-invalid');
        }
    }
}