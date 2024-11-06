import {HttpUtils} from "../../../utils/http-utils.js";

export class EditCategories {
    constructor(openNewRoute, type) {
        this.openNewRoute = openNewRoute;
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/' + type);
        }

        this.titleInputElement = document.getElementById('title-input');
        this.saveButtonElement = document.getElementById('save');
        this.getCurrentCategory(id, type).then();

        this.saveButtonElement.addEventListener('click', this.editCurrentCategory.bind(this, id, type));
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

    async getCurrentCategory(id, type) {

        const result = await HttpUtils.request('/categories/' + type + '/' + id);

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && (result.response.error || !result.response.title|| !result.response.id))) {
            return alert('Возникла ошибка при редактировании категории. Обратитесь в поддержку.');
        }

        if (!result.error && result.response) {
            const currentCategory = result.response;
            this.titleInputElement.value = currentCategory.title;
        }
    }

    async editCurrentCategory(id, type) {
        this.titleInputElement.classList.remove('is-invalid');

        if (this.titleInputElement.value) {
            const result = await HttpUtils.request('/categories/' + type + '/' + id, 'PUT', true, {
                title: this.titleInputElement.value
            });

            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            this.openNewRoute('/' + type);
        } else {
            this.titleInputElement.classList.add('is-invalid');
        }

    }
}