import {HttpUtils} from "../utils/http-utils.js";
import {AuthUtils} from "../utils/auth-utils.js";

export class Layout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.buttonCategoryElement = document.getElementById("button-category");
        this.itemSvgElement = document.getElementById("item-svg");
        this.userElement = document.getElementById("user");
        this.logoutBlockElement = document.getElementById("logout-block");
        this.balanceElement = document.getElementById("balance");

        this.buttonCategoryElement.addEventListener('click', this.activeButtonCategoryElement.bind(this));
        this.userElement.addEventListener('click', this.showButtonLogout.bind(this));
        this.getBalance().then();
        this.getUserInfo();
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

    async getBalance() {
        const result  = await HttpUtils.request('/balance');

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.response) {
            this.balanceElement.innerText = result.response.balance + '$';
        } else {
            console.log(result.error);
        }
    }

    getUserInfo() {
        const userInfo = JSON.parse(AuthUtils.getAuthInfo(AuthUtils.userInfoKey));
        this.userElement.innerText = userInfo.name + ' ' + userInfo.lastName;
    }
}