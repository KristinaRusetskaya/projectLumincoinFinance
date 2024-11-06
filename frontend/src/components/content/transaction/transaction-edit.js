import {HttpUtils} from "../../../utils/http-utils";

export class TransactionEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/transaction');
        }

        this.buttonIncomeExpenses = document.getElementById("button-income-expenses");
        this.buttonIncomeExpenses.classList.add("active");

        this.typeSelectElement = document.getElementById("type");
        this.categorySelectElement = document.getElementById("category");
        this.amountInputElement = document.getElementById("amount");
        this.dateInputElement = document.getElementById("date");
        this.commentInputElement = document.getElementById("comment");

        this.saveButtonElement = document.getElementById('save');
        this.getCurrentOperation(id).then();

        this.saveButtonElement.addEventListener('click', this.editCurrentCategory.bind(this, id));

        this.typeSelectElement.addEventListener("change", this.createSelectCategory.bind(this, null, this.typeSelectElement.value));
    }

    async getCurrentOperation(id) {

        const result = await HttpUtils.request('/operations/' + id);

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && (result.response.error || !result.response.type || !result.response.id))) {
            return alert('Возникла ошибка при редактировании операции. Обратитесь в поддержку.');
        }

        if (!result.error && result.response) {
            const currentOperation = result.response;
            this.createSelectCategory(currentOperation, currentOperation.type).then();
        }
    }

    setCurrent(currentOperation) {
        this.typeSelectElement.value = currentOperation.type;

        const categoriesArray = Array.from(document.querySelectorAll('#category option'));
        const currentCategory = categoriesArray.find(category => {
            return category.innerText === currentOperation.category;
        });
        this.categorySelectElement.value = currentCategory.value;

        this.amountInputElement.value = currentOperation.amount;
        this.dateInputElement.value = currentOperation.date;
        this.commentInputElement.value = currentOperation.comment;

    }

    async createSelectCategory(result, type) {
        this.categorySelectElement.innerHTML = "";

        if (type) {
            const result = await HttpUtils.request('/categories/' + type);

            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (result.error || !result.response) {
                return alert('Возникла ошибка при отображении категорий. Обратитесь в поддержку.');
            }

            result.response.forEach((select) => {
                const optionCategoryElement = document.createElement("option");
                optionCategoryElement.setAttribute('value', select.id);
                optionCategoryElement.innerText = select.title;
                this.categorySelectElement.append(optionCategoryElement);
            })
        }

        if (result) {
            this.setCurrent(result);
        }
    }

    async editCurrentCategory(id) {
        this.amountInputElement.classList.remove('is-invalid');
        this.dateInputElement.classList.remove('is-invalid');
        this.commentInputElement.classList.remove('is-invalid');
        this.dateInputElement.removeAttribute('style');

        const body = {
            type: this.typeSelectElement.value,
            amount: Number(this.amountInputElement.value),
            date: this.dateInputElement.value,
            comment: this.commentInputElement.value,
            category_id: Number(this.categorySelectElement.value)
        }

        if (this.amountInputElement.value && this.dateInputElement.value && this.commentInputElement.value) {
            const result = await HttpUtils.request('/operations/' + id, 'PUT', true, body);

            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            this.openNewRoute('/transaction');
        } else {
            this.amountInputElement.classList.add('is-invalid');
            this.dateInputElement.classList.add('is-invalid');
            this.commentInputElement.classList.add('is-invalid');
            this.dateInputElement.style.borderColor = 'red'
        }
    }
}