import {HttpUtils} from "../../../utils/http-utils";
import {CreateUtils} from "../../../utils/create-utils";

export class Transaction {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.buttonIncomeExpenses = document.getElementById("button-income-expenses");
        this.buttonIncomeExpenses.classList.add("active");

        this.buttonsInterval = document.querySelectorAll(".date-buttons button");
        this.recordsElement = document.getElementById("records");

        this.todayIntervalElement = document.getElementById("today");
        this.weekIntervalElement = document.getElementById("week");
        this.monthIntervalElement = document.getElementById("month");
        this.yearIntervalElement = document.getElementById("year");
        this.allIntervalElement = document.getElementById("all");
        this.intervalElement = document.getElementById("interval");

        this.dateFromElement = document.getElementById("date-from");
        this.dateToElement = document.getElementById("date-to");
        this.dateFromSectionElement = document.getElementById("date-from-section");
        this.dateToSectionElement = document.getElementById("date-to-section");

        this.dateFromSaveElement = document.getElementById("date-from-save");
        this.dateFromCancelElement = document.getElementById("date-from-cancel");
        this.dateToSaveElement = document.getElementById("date-to-save");
        this.dateToCancelElement = document.getElementById("date-to-cancel");

        this.dateFromInputElement = document.getElementById("date-from-input");
        this.dateToInputElement = document.getElementById("date-to-input");

        this.definitionInterval(this.todayIntervalElement).then();
        this.todayIntervalElement.addEventListener('click', this.definitionInterval.bind(this, this.todayIntervalElement));
        this.weekIntervalElement.addEventListener('click', this.definitionInterval.bind(this, this.weekIntervalElement, 'week'));
        this.monthIntervalElement.addEventListener('click', this.definitionInterval.bind(this, this.monthIntervalElement, 'month'));
        this.yearIntervalElement.addEventListener('click', this.definitionInterval.bind(this, this.yearIntervalElement, 'year'));
        this.allIntervalElement.addEventListener('click', this.definitionInterval.bind(this, this.allIntervalElement, 'all'));
        this.intervalElement.addEventListener('click', this.definitionInterval.bind(this, this.intervalElement, 'interval'));

    }

     clearActiveInterval(buttons) {
        buttons.forEach(button => {
            button.classList.remove("active");
        })

        if (this.dateFromElement) {
            this.dateFromElement.style.cursor = 'not-allowed';
        }
        if (this.dateToElement) {
            this.dateToElement.style.cursor = 'not-allowed';
        }
        this.dateFromElement.innerText = 'Дата';
        this.dateToElement.innerText = 'Дата';
        this.dateFromSectionElement.style.display = 'none';
        this.dateToSectionElement.style.display = 'none';
        this.dateFromElement.addEventListener('click', () => {this.dateFromSectionElement.style.display = 'none';});
        this.dateToElement.addEventListener('click', () => {this.dateToSectionElement.style.display = 'none';});
        this.dateFromSaveElement.parentElement.parentElement.style.left = '-15px';
        this.dateToSaveElement.parentElement.parentElement.style.right = '-22px';
        this.dateFromInputElement.value = '';
        this.dateToInputElement.value = '';

        this.recordsElement.innerHTML = "";
    }

    async definitionInterval(buttonElement, typeInterval) {
        this.clearActiveInterval(this.buttonsInterval);
        buttonElement.classList.add("active");
        let params = '';
        if (typeInterval && typeInterval !== 'interval') {
            params = '?period=' + typeInterval;
        } else if (typeInterval === 'interval') {
            this.recordsElement.innerHTML = "";
            this.actionButtonInterval();
            return
        }

        this.responseDate(params).then();
    }

    actionButtonInterval() {
        this.dateFromElement.style.cursor = 'pointer';
        this.dateToElement.style.cursor = 'pointer';
        this.dateFromElement.addEventListener('click', () => {this.dateFromSectionElement.style.display = 'flex';});
        this.dateToElement.addEventListener('click', () => {this.dateToSectionElement.style.display = 'flex';});
        let params = null;

        this.dateFromSaveElement.addEventListener('click', () => {
            if (this.dateFromInputElement.value) {
                this.dateFromElement.innerText = this.dateFromInputElement.value;
                this.dateFromElement.style.borderBottomColor = 'white';
                this.dateFromSectionElement.style.display = 'none';
                this.dateFromSaveElement.parentElement.parentElement.style.left = '13px';
                if (this.dateFromInputElement.value && this.dateToInputElement.value) {
                    params = '?period=interval&dateFrom=' + this.dateFromInputElement.value + '&dateTo=' + this.dateToInputElement.value;
                    this.recordsElement.innerHTML = "";
                    this.responseDate(params).then();
                    return
                }
            }
        })

        this.dateToSaveElement.addEventListener('click', () => {
            if (this.dateToInputElement.value) {
                this.dateToElement.innerText = this.dateToInputElement.value;
                this.dateToElement.style.borderBottomColor = 'white';
                this.dateToSectionElement.style.display = 'none';
                this.dateToSaveElement.parentElement.parentElement.style.right = '13px';
                this.dateToInputValue = this.dateToInputElement.value;
                if (this.dateFromInputElement.value && this.dateToInputElement.value) {
                    params = '?period=interval&dateFrom=' + this.dateFromInputElement.value + '&dateTo=' + this.dateToInputElement.value;
                    this.recordsElement.innerHTML = "";
                    this.responseDate(params).then();
                    return
                }
            }
        })

        this.dateFromCancelElement.addEventListener('click', () => {this.dateFromSectionElement.style.display = 'none';})
        this.dateToCancelElement.addEventListener('click', () => {this.dateToSectionElement.style.display = 'none';})
    }

    async responseDate(params) {
        const result = await HttpUtils.request('/operations' + params);

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (!result.error && result.response) {
            CreateUtils.createOperation(result.response);
        }
    }
}

