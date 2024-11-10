import {HttpUtils} from "../utils/http-utils";
import {AuthUtils} from "../utils/auth-utils";
import {BalanceType} from "../types/balance.type";

export class Layout {
    readonly openNewRoute: Function;
    readonly buttonCategoryElement: HTMLElement | null;
    readonly itemSvgElement: HTMLElement | null;
    readonly userElement: HTMLElement | null;
    readonly logoutBlockElement: HTMLElement | null;
    readonly balanceElement: HTMLElement | null;

    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;
        this.buttonCategoryElement = document.getElementById("button-category");
        this.itemSvgElement = document.getElementById("item-svg");
        this.userElement = document.getElementById("user");
        this.logoutBlockElement = document.getElementById("logout-block");
        this.balanceElement = document.getElementById("balance");

        if (this.buttonCategoryElement) {
            this.buttonCategoryElement.addEventListener('click', this.activeButtonCategoryElement.bind(this));
        }
        if (this.userElement) {
            this.userElement.addEventListener('click', this.showButtonLogout.bind(this));
        }
        this.getBalance().then();
        this.getUserInfo();
    }

    private activeButtonCategoryElement(): void {
        if (this.buttonCategoryElement && this.buttonCategoryElement && this.buttonCategoryElement.parentElement && this.itemSvgElement) {
            this.buttonCategoryElement.classList.add('active');
            this.buttonCategoryElement.parentElement.classList.add('menu-is-opening');
            this.buttonCategoryElement.parentElement.classList.add('menu-open');
            this.itemSvgElement.classList.add('rotate');
        }
    }

    private showButtonLogout(): void {
        if (this.logoutBlockElement) {
            this.logoutBlockElement.classList.toggle('show');
        }
    }

    private async getBalance(): Promise<void> {
        const result: BalanceType  = await HttpUtils.request('/balance');
        if (result.redirect) {
            this.openNewRoute(result.redirect);
            return;
        }

        if (result.response) {
            if (this.balanceElement) {
                this.balanceElement.innerText = result.response.balance + '$';
            }
        } else {
            console.log(result.error);
        }
    }

    private getUserInfo(): void {
        const userInfo: string | null | { [x: string]: string | null } = JSON.parse(<string>AuthUtils.getAuthInfo(AuthUtils.userInfoKey));
        if (this.userElement) {
            this.userElement.innerText = (userInfo as { [x: string]: string | null }).name + ' ' + (userInfo as { [x: string]: string | null }).lastName;
        }
    }
}