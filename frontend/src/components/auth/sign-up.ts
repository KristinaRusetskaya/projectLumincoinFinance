import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {InfoResponseType, LoginResponseType} from "../../types/login-response.type";
import {DefaultResponseType} from "../../types/default-response.type";
import {SignupResponseType} from "../../types/signup-response.type";

export class SignUp {
    readonly openNewRoute: Function;
    readonly fullNameElement: HTMLElement | null | undefined;
    readonly emailElement: HTMLElement | null | undefined;
    readonly passwordElement: HTMLElement | null | undefined;
    readonly passwordRepeatElement: HTMLElement | null | undefined;
    readonly commonErrorElement: HTMLElement | null | undefined;
    readonly processButtonElement: HTMLElement | null | undefined;
    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.fullNameElement = document.getElementById('full-name');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.passwordRepeatElement = document.getElementById('repeat-password');
        this.commonErrorElement = document.getElementById('common-error');
        this.processButtonElement = document.getElementById("process-button");
        if (this.processButtonElement) {
            this.processButtonElement.addEventListener('click', this.signUp.bind(this));
        }
    }

    private validateForm(): boolean {
        let isValid: boolean = true;

        if (this.fullNameElement && (this.fullNameElement as HTMLInputElement).value && (this.fullNameElement as HTMLInputElement).value.match(/^[А-Я][а-я]{0,}\s[А-Я][а-я]{1,}(\s[А-Я][а-я]{1,})?$/)) {
            this.fullNameElement.classList.remove('is-invalid');
        } else {
            if (this.fullNameElement) {
                this.fullNameElement.classList.add('is-invalid');
                isValid = false;
            }
        }

        if (this.emailElement && (this.emailElement as HTMLInputElement).value && (this.emailElement as HTMLInputElement).value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            if (this.emailElement) {
                isValid = false;
                this.emailElement.classList.add('is-invalid');
            }
        }

        if (this.passwordElement && (this.passwordElement as HTMLInputElement).value && (this.passwordElement as HTMLInputElement).value.match(/^(?=.*\d)(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            if (this.passwordElement) {
                this.passwordElement.classList.add('is-invalid');
                isValid = false;
            }
        }

        if (this.passwordRepeatElement && (this.passwordRepeatElement as HTMLInputElement).value && (this.passwordRepeatElement as HTMLInputElement).value === (this.passwordElement as HTMLInputElement).value) {
            this.passwordRepeatElement.classList.remove('is-invalid');
        } else {
            if (this.passwordRepeatElement) {
                this.passwordRepeatElement.classList.add('is-invalid');
                isValid = false;
            }
        }

        return isValid;
    }

    private async signUp(): Promise<void> {
        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';
        }
        if (this.validateForm()) {
            const result: SignupResponseType | DefaultResponseType = await HttpUtils.request('/signup', 'POST', false, {
                name: (this.fullNameElement as HTMLInputElement).value.split(' ')[1],
                lastName: (this.fullNameElement as HTMLInputElement).value.split(' ')[0],
                email: (this.emailElement as HTMLInputElement).value,
                password: (this.passwordElement as HTMLInputElement).value,
                passwordRepeat: (this.passwordRepeatElement as HTMLInputElement).value
            })

            if ((result as DefaultResponseType).redirect) {
                this.openNewRoute((result as DefaultResponseType).redirect);
                return;
            }

            if ((result as DefaultResponseType).error) {
               if (this.commonErrorElement) {
                   this.commonErrorElement.style.display = 'block';
                   return;
               }
            }

            const login: LoginResponseType= await HttpUtils.request('/login', 'POST', false, {
                email: (this.emailElement as HTMLInputElement).value,
                password: (this.passwordElement as HTMLInputElement).value,
                rememberMe: false
            })

            if (login.redirect) {
                this.openNewRoute(login.redirect);
                return;
            }

            if (login.error) {
                if (this.commonErrorElement) {
                    this.commonErrorElement.style.display = 'block';
                    return;
                }
            }
            const response: InfoResponseType = (login.response as InfoResponseType);
            AuthUtils.setAuthInfo(response.tokens.accessToken, response.tokens.refreshToken, {id: response.user.id, name: response.user.name, lastName: response.user.lastName});

            this.openNewRoute('/');
        }
    }
}