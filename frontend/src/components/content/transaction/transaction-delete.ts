import {HttpUtils} from "../../../utils/http-utils";
import {DeleteResponseType} from "../../../types/delete-response.type";

export class TransactionDelete {
    readonly openNewRoute: Function;
    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        const id: string | null = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/transaction');
        }
        this.deleteOption(id).then();
       }

    private async deleteOption(id: string) {
        const result: DeleteResponseType = await HttpUtils.request('/operations/' + id, 'DELETE', true);

        if (result.redirect) {
            this.openNewRoute(result.redirect);
            return;
        }
        if (result.error) {
            alert('Возникла ошибка при удалении операции. Обратитесь в поддержку.');
            return;
        }
        this.openNewRoute('/transaction');
    }
}