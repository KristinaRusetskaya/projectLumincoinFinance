import {HttpUtils} from "../../../utils/http-utils";

export class TransactionDelete {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/transaction');
        }
        this.deleteOption(id).then();
       }

    async deleteOption(id) {
        const result = await HttpUtils.request('/operations/' + id, 'DELETE', true);

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }
        if (result.error) {
            return alert('Возникла ошибка при удалении операции. Обратитесь в поддержку.');
        }
        this.openNewRoute('/transaction');
    }
}