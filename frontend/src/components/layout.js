import {Logout} from "./auth/logout";

export class Layout {
    constructor() {
        this.buttonCategoryElement = document.getElementById("button-category");
        this.itemSvgElement = document.getElementById("item-svg");
        this.userElement = document.getElementById("user");
        this.logoutBlockElement = document.getElementById("logout-block");

        this.buttonCategoryElement.addEventListener('click', this.activeButtonCategoryElement.bind(this));
        this.userElement.addEventListener('click', this.showButtonLogout.bind(this));
    }

    activeButtonCategoryElement() {
        this.buttonCategoryElement.classList.add('active');
        this.buttonCategoryElement.parentElement.classList.add('menu-is-opening');
        this.buttonCategoryElement.parentElement.classList.add('menu-open');
        this.itemSvgElement.classList.add('rotate');
    }

    showButtonLogout() {
        this.logoutBlockElement.classList.toggle('show');
    }
}