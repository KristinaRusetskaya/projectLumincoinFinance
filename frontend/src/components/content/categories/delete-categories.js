import {HttpUtils} from "../../../utils/http-utils";

export class DeleteCategories {
    constructor(openNewRoute, type) {
        this.openNewRoute = openNewRoute;
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/' + type);
        }
        this.deleteCategory(id, type).then();
    }

    async deleteCategory(id, type) {
        const result = await HttpUtils.request('/categories/' + type + '/' + id, 'DELETE', true);

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }
        if (result.error) {
            return alert('Возникла ошибка при удалении категории. Обратитесь в поддержку.');
        }
        this.openNewRoute('/' + type);
    }
}