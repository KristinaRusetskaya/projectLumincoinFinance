export class Expenses {
    constructor() {
        this.buttonCategoryElement = document.getElementById("button-category");
        this.itemSvgElement = document.getElementById("item-svg");
        this.expensesElement = document.getElementById("expenses");

        this.showButtonCategory();

    }

    showButtonCategory() {
        this.expensesElement.classList.add("active");
        this.buttonCategoryElement.classList.add('active');
        this.buttonCategoryElement.parentElement.classList.add('menu-is-opening');
        this.buttonCategoryElement.parentElement.classList.add('menu-open');
        this.itemSvgElement.classList.add('rotate');
    }
}