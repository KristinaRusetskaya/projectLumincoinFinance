import {HttpUtils} from "../../../utils/http-utils.js";

export class EditCategories {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/income');
        }
    }
}