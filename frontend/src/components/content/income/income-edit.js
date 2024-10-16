import {HttpUtils} from "../../../utils/http-utils.js";

export class IncomeEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/income');
        }

        this.incomeInputElement = document.getElementById('income-input');
        this.saveButtonElement = document.getElementById('save');
        this.getCurrentCategory(id).then();

        this.saveButtonElement.addEventListener('click', this.editCurrentCategory.bind(this, id));
    }

    async getCurrentCategory(id) {

        const result = await HttpUtils.request('/categories/income/' + id);

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (!result.error && result.response) {
            const currentCategory = result.response;
            this.incomeInputElement.value = currentCategory.title;
        } else {
            console.log(result.error);
            return;
        }
    }

    async editCurrentCategory(id) {
        this.incomeInputElement.classList.remove('is-invalid');

        if (this.incomeInputElement.value) {
            const result = await HttpUtils.request('/categories/income/' + id, 'PUT', true, {
                title: this.incomeInputElement.value
            });

            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            this.openNewRoute('/income');
        } else {
            this.incomeInputElement.classList.add('is-invalid');
        }

    }
}