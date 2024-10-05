export class Layout {
    constructor() {
        this.buttonHomeElement = document.getElementById("button-home");
        this.buttonIncomeExpensesElement = document.getElementById("button-income-expenses");
        this.buttonCategoryElement = document.getElementById("button-category");
        this.itemSvgElement = document.getElementById("item-svg");
        this.incomeElement = document.getElementById("income");
        this.expensesElement = document.getElementById("expenses");

        this.buttonHomeElement.addEventListener('click', this.activeButtonHome.bind(this));
        this.buttonIncomeExpensesElement.addEventListener('click', this.activeButtonIncomeExpensesElement.bind(this));
        this.buttonCategoryElement.addEventListener('click', this.activeButtonCategoryElement.bind(this));
        this.incomeElement.addEventListener('click', this.activateIncomeButton.bind(this));
        this.expensesElement.addEventListener('click', this.activateExpensesButton.bind(this));
    }

    activeButtonHome() {
        this.buttonCategoryElement.classList.remove('active');
        this.buttonCategoryElement.parentElement.classList.remove('menu-is-opening');
        this.buttonCategoryElement.parentElement.classList.remove('menu-open');
        this.itemSvgElement.classList.remove('rotate');
        this.buttonIncomeExpensesElement.classList.remove('active');
        this.buttonHomeElement.classList.add('active');
    }

    activeButtonIncomeExpensesElement() {
        this.buttonCategoryElement.classList.remove('active');
        this.buttonCategoryElement.parentElement.classList.remove('menu-is-opening');
        this.buttonCategoryElement.parentElement.classList.remove('menu-open');
        this.itemSvgElement.classList.remove('rotate');
        this.buttonHomeElement.classList.remove('active');
        this.buttonIncomeExpensesElement.classList.toggle('active');
    }

    activeButtonCategoryElement() {
        this.incomeElement.classList.remove('active');
        this.expensesElement.classList.remove('active');
        this.buttonHomeElement.classList.remove('active');
        this.buttonIncomeExpensesElement.classList.remove('active');
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