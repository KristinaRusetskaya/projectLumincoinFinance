import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {LogoutResponseType} from "../../types/logout-response.type";

export class Logout {
    readonly openNewRoute: Function;

    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.logout().then();
    }

    async logout(): Promise<void> {
        const result: LogoutResponseType = await HttpUtils.request('/logout', 'POST', false,
            {refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)});
        if (result.redirect) {
            this.openNewRoute(result.redirect);
            return;
        }

        if (!result.error) {
            AuthUtils.removeAuthInfo();
            this.openNewRoute('/login');
        }
    }
}