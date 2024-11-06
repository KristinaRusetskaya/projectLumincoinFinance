import {HttpUtils} from "../../../utils/http-utils";

export class TransactionCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');

        this.buttonIncomeExpenses = document.getElementById("button-income-expenses");
        this.buttonIncomeExpenses.classList.add("active");

        this.typeSelectElement = document.getElementById("type");
        this.typeSelectElement.value = type;
        this.categorySelectElement = document.getElementById("category");
        this.amountInputElement = document.getElementById("amount");
        this.dateInputElement = document.getElementById("date");
        this.commentInputElement = document.getElementById("comment");

        this.saveElement = document.getElementById("save");

        this.saveElement.addEventListener("click", this.createOperation.bind(this));
        this.typeSelectElement.addEventListener("change", this.createSelectCategory.bind(this));
        this.createSelectCategory().then();
    }

    async createSelectCategory() {
        this.categorySelectElement.innerHTML = "";
        const type = this.typeSelectElement.value;

        if (type) {
            const result = await HttpUtils.request('/categories/' + type);

            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (result.error || !result.response) {
                return alert('Возникла ошибка при создании категорий. Обратитесь в поддержку.');
            }

            result.response.forEach((select) => {
                const optionCategoryElement = document.createElement("option");
                optionCategoryElement.setAttribute('value', select.id);
                optionCategoryElement.innerText = select.title;
                this.categorySelectElement.append(optionCategoryElement);
            })
        }
    }

    async createOperation() {
        this.amountInputElement.classList.remove('is-invalid');
        this.dateInputElement.classList.remove('is-invalid');
        this.commentInputElement.classList.remove('is-invalid');
        this.dateInputElement.removeAttribute('style');

        if (!this.amountInputElement.value) {
            this.amountInputElement.classList.add('is-invalid');
            return
        }

        if (!this.dateInputElement.value) {
            this.dateInputElement.classList.add('is-invalid');
            this.dateInputElement.style.borderColor = 'red'
            return
        }

        if (!this.commentInputElement.value) {
            this.commentInputElement.classList.add('is-invalid');
            return
        }

        let body = {
            type: this.typeSelectElement.value,
            amount: Number(this.amountInputElement.value),
            date: this.dateInputElement.value,
            comment: this.commentInputElement.value,
            category_id: Number(this.categorySelectElement.value)
        }
        console.log(body);

        if (body) {
            const result = await HttpUtils.request('/operations', 'POST', true, body);

            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (result.error || !result.response) {
                return alert('Возникла ошибка при создании операции. Обратитесь в поддержку.');
            }
            this.openNewRoute('/transaction');
        } else {
            this.amountInputElement.classList.add('is-invalid');
            this.dateInputElement.classList.add('is-invalid');
            this.dateInputElement.style.borderColor = 'red'
            this.commentInputElement.classList.add('is-invalid');
        }

    }
}