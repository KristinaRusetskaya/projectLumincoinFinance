import {HttpUtils} from "../../../utils/http-utils";
import {CreateUtils} from "../../../utils/create-utils";
import {ViewTransactionsResponseType} from "../../../types/view-transactions-response.type";

export class Transaction {
    readonly openNewRoute: Function;
    readonly buttonIncomeExpenses: HTMLElement | null;
    readonly buttonsInterval: NodeListOf<HTMLElement>;
    readonly todayIntervalElement: HTMLElement | null;
    readonly weekIntervalElement: HTMLElement | null;
    readonly monthIntervalElement: HTMLElement | null;
    readonly yearIntervalElement: HTMLElement | null;
    readonly allIntervalElement: HTMLElement | null;
    readonly intervalElement: HTMLElement | null;
    readonly recordsElement: HTMLElement | null;
    readonly dateFromElement: HTMLElement | null;
    readonly dateToElement: HTMLElement | null;
    readonly dateFromSectionElement: HTMLElement | null;
    readonly dateToSectionElement: HTMLElement | null;
    readonly dateFromSaveElement: HTMLElement | null;
    readonly dateFromCancelElement: HTMLElement | null;
    readonly dateToSaveElement: HTMLElement | null;
    readonly dateToCancelElement: HTMLElement | null;
    readonly dateFromInputElement: HTMLElement | null;
    readonly dateToInputElement: HTMLElement | null;
    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;
        this.buttonIncomeExpenses = document.getElementById("button-income-expenses");
        if (this.buttonIncomeExpenses) {
            this.buttonIncomeExpenses.classList.add("active");
        }

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

        this.definitionInterval((this.todayIntervalElement as HTMLElement), '').then();
        if (this.todayIntervalElement && this.weekIntervalElement && this.monthIntervalElement && this.yearIntervalElement && this.allIntervalElement && this.intervalElement) {
            this.todayIntervalElement.addEventListener('click', this.definitionInterval.bind(this, this.todayIntervalElement, ''));
            this.weekIntervalElement.addEventListener('click', this.definitionInterval.bind(this, this.weekIntervalElement, 'week'));
            this.monthIntervalElement.addEventListener('click', this.definitionInterval.bind(this, this.monthIntervalElement, 'month'));
            this.yearIntervalElement.addEventListener('click', this.definitionInterval.bind(this, this.yearIntervalElement, 'year'));
            this.allIntervalElement.addEventListener('click', this.definitionInterval.bind(this, this.allIntervalElement, 'all'));
            this.intervalElement.addEventListener('click', this.definitionInterval.bind(this, this.intervalElement, 'interval'));
        }
    }

     private clearActiveInterval(buttons: NodeListOf<HTMLElement>): void {
        buttons.forEach((button: HTMLElement): void => {
            button.classList.remove("active");
        })

        if (this.dateFromElement) {
            this.dateFromElement.style.cursor = 'not-allowed';
        }
        if (this.dateToElement) {
            this.dateToElement.style.cursor = 'not-allowed';
        }
        if (this.dateFromElement && this.dateToElement && this.dateFromSectionElement && this.dateToSectionElement) {
            this.dateFromElement.innerText = 'Дата';
            this.dateToElement.innerText = 'Дата';
            this.dateFromSectionElement.style.display = 'none';
            this.dateToSectionElement.style.display = 'none';
            this.dateFromElement.addEventListener('click', (): void => {(this.dateFromSectionElement as HTMLElement).style.display = 'none';});
            this.dateToElement.addEventListener('click', (): void => {(this.dateToSectionElement as HTMLElement).style.display = 'none';});
            if (this.dateFromSaveElement && this.dateFromSaveElement.parentElement && this.dateFromSaveElement.parentElement.parentElement){
                this.dateFromSaveElement.parentElement.parentElement.style.left = '-15px';
            }
            if (this.dateToSaveElement && this.dateToSaveElement.parentElement && this.dateToSaveElement.parentElement.parentElement){
                this.dateToSaveElement.parentElement.parentElement.style.right = '-22px';
            }
            (this.dateFromInputElement as HTMLInputElement).value = '';
            (this.dateToInputElement as HTMLInputElement).value = '';

            if (this.recordsElement) {
                this.recordsElement.innerHTML = "";
            }
        }
    }

    private async definitionInterval(buttonElement: HTMLElement, typeInterval: string): Promise<void> {
        this.clearActiveInterval(this.buttonsInterval);
        buttonElement.classList.add("active");
        let params: string | null = '';
        if (typeInterval && typeInterval !== 'interval') {
            params = '?period=' + typeInterval;
        } else if (typeInterval === 'interval' && this.recordsElement) {
            this.recordsElement.innerHTML = "";
            this.actionButtonInterval();
            return
        }

        this.responseDate(params).then();
    }

    private actionButtonInterval(): void {
        if (this.dateFromElement && this.dateToElement) {
            this.dateFromElement.style.cursor = 'pointer';
            this.dateToElement.style.cursor = 'pointer';
            this.dateFromElement.addEventListener('click', (): void => {(this.dateFromSectionElement as HTMLElement).style.display = 'flex';});
            this.dateToElement.addEventListener('click', (): void => {(this.dateToSectionElement as HTMLElement).style.display = 'flex';});
        }

        let params: string | null = null;

        if (this.dateFromSaveElement) {
            this.dateFromSaveElement.addEventListener('click', (): void => {
                if ((this.dateFromInputElement as HTMLInputElement).value && this.dateFromElement && this.dateFromSectionElement) {
                    this.dateFromElement.innerText = (this.dateFromInputElement as HTMLInputElement).value;
                    this.dateFromElement.style.borderBottomColor = 'white';
                    this.dateFromSectionElement.style.display = 'none';
                    if (this.dateFromSaveElement && this.dateFromSaveElement.parentElement && this.dateFromSaveElement.parentElement.parentElement) {
                        this.dateFromSaveElement.parentElement.parentElement.style.left = '13px';
                    }
                    if ((this.dateFromInputElement as HTMLInputElement).value && (this.dateToInputElement as HTMLInputElement).value) {
                        params = '?period=interval&dateFrom=' + (this.dateFromInputElement as HTMLInputElement).value + '&dateTo=' + (this.dateToInputElement as HTMLInputElement).value;
                        if (this.recordsElement) {
                            this.recordsElement.innerHTML = "";
                        }
                        this.responseDate(params).then();
                        return
                    }
                }
            })
        }

        if (this.dateToSaveElement) {
            this.dateToSaveElement.addEventListener('click', (): void => {
                if ((this.dateToInputElement as HTMLInputElement).value && this.dateToElement && this.dateToSectionElement) {
                    this.dateToElement.innerText = (this.dateToInputElement as HTMLInputElement).value;
                    this.dateToElement.style.borderBottomColor = 'white';
                    this.dateToSectionElement.style.display = 'none';
                    if (this.dateToSaveElement && this.dateToSaveElement.parentElement && this.dateToSaveElement.parentElement.parentElement) {
                        this.dateToSaveElement.parentElement.parentElement.style.right = '13px';
                    }
                    if ((this.dateFromInputElement as HTMLInputElement).value && (this.dateToInputElement as HTMLInputElement).value) {
                        params = '?period=interval&dateFrom=' + (this.dateFromInputElement as HTMLInputElement).value + '&dateTo=' + (this.dateToInputElement as HTMLInputElement).value;
                        if (this.recordsElement) {
                            this.recordsElement.innerHTML = "";
                        }
                        this.responseDate(params).then();
                        return
                    }
                }
            })
        }

        if (this.dateFromCancelElement && this.dateToCancelElement) {
            this.dateFromCancelElement.addEventListener('click', () => {(this.dateFromSectionElement as HTMLElement).style.display = 'none';})
            this.dateToCancelElement.addEventListener('click', () => {(this.dateToSectionElement as HTMLElement).style.display = 'none';})
        }
    }

    private async responseDate(params: string): Promise<void> {
        const result: ViewTransactionsResponseType = await HttpUtils.request('/operations' + params);
        if (result.redirect) {
            this.openNewRoute(result.redirect);
            return;
        }

        if (!result.error && result.response) {
            CreateUtils.createOperation(result.response);
        }
    }
}

