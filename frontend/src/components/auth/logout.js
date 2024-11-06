import {AuthUtils} from "../../utils/auth-utils.js";
import {HttpUtils} from "../../utils/http-utils.js";

export class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.logout().then();
    }

    async logout() {
        const result = await HttpUtils.request('/logout', 'POST', false,
            {refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)});

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (!result.error) {
            AuthUtils.removeAuthInfo();
            this.openNewRoute('/login');
        }
    }
}