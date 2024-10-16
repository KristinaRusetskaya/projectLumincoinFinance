import {HttpUtils} from "../../../utils/http-utils";

export class IncomeDelete {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/income');
        }
        this.deleteCategory(id).then();
    }


    async deleteCategory(id) {
        const result = await HttpUtils.request('/categories/income/' + id, 'DELETE', true);

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        this.openNewRoute('/income');
    }
}