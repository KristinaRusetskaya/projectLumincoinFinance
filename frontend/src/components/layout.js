export class Layout {
    constructor() {
        this.buttonCategoryElement = document.getElementById("button-category");
        this.itemSvgElement = document.getElementById("item-svg");
        this.incomeElement = document.getElementById("income");
        this.expensesElement = document.getElementById("expenses");

        this.buttonCategoryElement.addEventListener('click', this.activeButtonCategoryElement.bind(this));
        this.incomeElement.addEventListener('click', this.activateIncomeButton.bind(this));
        this.expensesElement.addEventListener('click', this.activateExpensesButton.bind(this));
    }

    activeButtonCategoryElement() {
        this.buttonCategoryElement.classList.toggle('active');
        this.buttonCategoryElement.parentElement.classList.toggle('menu-is-opening');
        this.buttonCategoryElement.parentElement.classList.toggle('menu-open');
        this.itemSvgElement.classList.toggle('rotate');
    }

    activateIncomeButton() {
        this.expensesElement.classList.remove('active');
        this.incomeElement.classList.toggle('active');
    }

    activateExpensesButton() {
        this.incomeElement.classList.remove('active');
        this.expensesElement.classList.toggle('active');
    }
}