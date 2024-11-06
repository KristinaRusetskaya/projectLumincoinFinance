import {HttpUtils} from "../utils/http-utils";
import {CreateUtils} from "../utils/create-utils";
import Chart from 'chart.js/auto';

export class Home {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.buttonHomeElement = document.getElementById("button-home");
        this.buttonHomeElement.classList.add("active");

        this.buttonsInterval = document.querySelectorAll(".date-buttons button");

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

    async definitionInterval(buttonElement, typeInterval) {
        this.clearActiveInterval(this.buttonsInterval);
        buttonElement.classList.add("active");
        let params = '';
        if (typeInterval && typeInterval !== 'interval') {
            params = '?period=' + typeInterval;
        } else if (typeInterval === 'interval') {
            this.actionButtonInterval();
            return
        }

        this.responseDate(params).then();
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
        this.dateFromElement.addEventListener('click', () => {
            this.dateFromSectionElement.style.display = 'none';
        });
        this.dateToElement.addEventListener('click', () => {
            this.dateToSectionElement.style.display = 'none';
        });
        this.dateFromSaveElement.parentElement.parentElement.style.left = '-15px';
        this.dateToSaveElement.parentElement.parentElement.style.right = '-22px';
        this.dateFromInputElement.value = '';
        this.dateToInputElement.value = '';
    }

    actionButtonInterval() {
        this.dateFromElement.style.cursor = 'pointer';
        this.dateToElement.style.cursor = 'pointer';
        this.dateFromElement.addEventListener('click', () => {
            this.dateFromSectionElement.style.display = 'flex';
        });
        this.dateToElement.addEventListener('click', () => {
            this.dateToSectionElement.style.display = 'flex';
        });
        let params = null;

        this.dateFromSaveElement.addEventListener('click', () => {
            if (this.dateFromInputElement.value) {
                this.dateFromElement.innerText = this.dateFromInputElement.value;
                this.dateFromElement.style.borderBottomColor = 'white';
                this.dateFromSectionElement.style.display = 'none';
                this.dateFromSaveElement.parentElement.parentElement.style.left = '13px';
                if (this.dateFromInputElement.value && this.dateToInputElement.value) {
                    params = '?period=interval&dateFrom=' + this.dateFromInputElement.value + '&dateTo=' + this.dateToInputElement.value;
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
                    this.responseDate(params).then();
                    return
                }
            }
        })

        this.dateFromCancelElement.addEventListener('click', () => {
            this.dateFromSectionElement.style.display = 'none';
        })
        this.dateToCancelElement.addEventListener('click', () => {
            this.dateToSectionElement.style.display = 'none';
        })
    }

    async responseDate(params) {
        const result = await HttpUtils.request('/operations' + params);

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (!result.error && result.response) {
            this.setData(result.response);
        }
    }

    setData(operations) {
        const operationsIncome = operations.filter(operation => {
            return operation.type === 'income'
        });

        const categoriesIncome = this.getData(operationsIncome);
        let nameArrayIncome = [];
        categoriesIncome.forEach(category => {
            nameArrayIncome.push(category.name);
        })

        let sumArrayIncome = [];
        categoriesIncome.forEach(category => {
            sumArrayIncome.push(String(category.sum));
        })

        this.initFirstDiagram(nameArrayIncome, sumArrayIncome).then();


        let labelsExpense = [];
        const operationsExpense = operations.filter(operation => {
            return operation.type === 'expense'
        });
        operationsExpense.forEach(operation => {
            if (!labelsExpense.includes(operation.category)) {
                labelsExpense.push(operation.category);
            }
        })

        const categoriesExpense = this.getData(operationsExpense);
        let nameArrayExpense = [];
        categoriesExpense.forEach(category => {
            nameArrayExpense.push(category.name);
        })

        let sumArrayExpense = [];
        categoriesExpense.forEach(category => {
            sumArrayExpense.push(String(category.sum));
        })

        this.initSecondDiagram(nameArrayExpense, sumArrayExpense).then();
    }

    getData(operations) {
        let categories = [];
        operations.forEach(operation => {
            if (categories.length === 0) {
                return categories.push({name: operation.category, sum: operation.amount});
            }

            let thereIs = true;
            categories.find(category => {
                if (category.name === operation.category) {
                    thereIs = true;
                    return category.sum += operation.amount;
                } else if (category.name !== operation.category) {
                    return thereIs = false;
                }
            })
            if (!thereIs) {
                categories.push({name: operation.category, sum: operation.amount});
            }
        })
        return categories;
    }

    async initFirstDiagram(nameArray, sumArray) {
        const diagramContainer = document.getElementById('first-diagram');
        document.getElementById('pieChartFirst').remove();

        const diagram = document.createElement('canvas');
        diagram.setAttribute('id', 'pieChartFirst');
        diagram.setAttribute('width', '500');
        diagram.setAttribute('height', '500');
        diagramContainer.appendChild(diagram);

        new Chart(
            diagram,
            {
                type: 'pie',
                data: {
                    labels: nameArray,
                    datasets: [
                        {
                            label: 'Сумма',
                            data: sumArray
                        }
                    ]
                }
            }
        );
    };

    async initSecondDiagram(nameArray, sumArray) {
        const diagramContainer = document.getElementById('second-diagram');
        document.getElementById('pieChartSecond').remove();

        const diagram = document.createElement('canvas');
        diagram.setAttribute('id', 'pieChartSecond');
        diagram.setAttribute('width', '500');
        diagram.setAttribute('height', '500');
        diagramContainer.appendChild(diagram);

        new Chart(
            diagram,
            {
                type: 'pie',
                data: {
                    labels: nameArray,
                    datasets: [
                        {
                            label: 'Сумма',
                            data: sumArray
                        }
                    ]
                }
            }
        );
    };
}