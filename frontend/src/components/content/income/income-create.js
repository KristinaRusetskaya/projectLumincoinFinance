import {HttpUtils} from "../../../utils/http-utils";

export class IncomeCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.incomeInputElement = document.getElementById("income-input");
        this.saveElement = document.getElementById("save");

        this.saveElement.addEventListener("click", this.createCategoryIncome.bind(this));
    }

    async createCategoryIncome() {
        this.incomeInputElement.classList.remove('is-invalid');

        if (this.incomeInputElement.value) {
            const result = await HttpUtils.request('/categories/income', 'POST', true, {
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