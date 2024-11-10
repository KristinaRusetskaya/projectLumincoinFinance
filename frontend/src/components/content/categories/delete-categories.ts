import {HttpUtils} from "../../../utils/http-utils";
import {DeleteResponseType} from "../../../types/delete-response.type";

export class DeleteCategories {
    readonly openNewRoute: Function;
    constructor(openNewRoute: Function, type: string) {
        this.openNewRoute = openNewRoute;
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        const id: string | null = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/' + type);
        }
        this.deleteCategory(id, type).then();
    }

    async deleteCategory(id: string, type: string): Promise<void> {
        const result: DeleteResponseType = await HttpUtils.request('/categories/' + type + '/' + id, 'DELETE', true);

        if (result.redirect) {
            this.openNewRoute(result.redirect);
            return;
        }
        if (result.error) {
            alert('Возникла ошибка при удалении категории. Обратитесь в поддержку.');
            return;
        }
        this.openNewRoute('/' + type);
    }
}