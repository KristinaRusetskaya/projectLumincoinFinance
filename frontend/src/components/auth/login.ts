import {HttpUtils} from "../../utils/http-utils";
import {AuthUtils} from "../../utils/auth-utils";
import {InfoResponseType, LoginResponseType} from "../../types/login-response.type";

export class Login {
    readonly openNewRoute: Function;
    readonly emailElement: HTMLElement | null;
    readonly passwordElement: HTMLElement | null;
    readonly rememberMeElement: HTMLElement | null;
    readonly commonErrorElement: HTMLElement | null;
    readonly processButtonElement: HTMLElement | null;

    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;

        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.rememberMeElement = document.getElementById('exampleCheck2');
        this.commonErrorElement = document.getElementById('common-error');
        this.processButtonElement = document.getElementById("process-button");
        if (this.processButtonElement) {
            this.processButtonElement.addEventListener('click', this.login.bind(this));
        }
    }

    private validateForm(): boolean {
        let isValid: boolean = true;
        if (this.emailElement && (this.emailElement as HTMLInputElement).value && (this.emailElement as HTMLInputElement).value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            if (this.emailElement) {
                this.emailElement.classList.add('is-invalid');
                isValid = false;
            }
        }

        if (this.passwordElement && (this.passwordElement as HTMLInputElement).value) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            if (this.passwordElement) {
                this.passwordElement.classList.add('is-invalid');
                isValid = false;
            }
        }

        return isValid
    }

    private async login(): Promise<void> {
        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';
        }
        if (this.validateForm()) {
            const result: LoginResponseType = await HttpUtils.request('/login', 'POST', false, {
                email: (this.emailElement as HTMLInputElement).value,
                password: (this.passwordElement as HTMLInputElement).value,
                rememberMe: (this.rememberMeElement as HTMLInputElement).checked
            })

            if (result.redirect) {
                this.openNewRoute(result.redirect);
                return;
            }

            if (result.error) {
                if (this.commonErrorElement) {
                    this.commonErrorElement.style.display = 'block';
                }
                return;
            }

            const response: InfoResponseType = (result.response as InfoResponseType);
            AuthUtils.setAuthInfo(response.tokens.accessToken, response.tokens.refreshToken, {id: response.user.id, name: response.user.name, lastName: response.user.lastName});

            this.openNewRoute('/');
        }
    }


}