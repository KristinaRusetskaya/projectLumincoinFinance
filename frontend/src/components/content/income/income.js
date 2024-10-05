export class Income {
    constructor() {
        this.incomeCardButtonDeleteElement = document.querySelectorAll('.income-card-button.delete');
        this.incomePopupElement = document.getElementById('pop-up');
        this.incomePopupDeleteElement = document.getElementById('delete');
        this.incomePopupNoDeleteElement = document.getElementById('no-delete');

        this.showPopup(this.incomePopupElement);

        this.incomePopupDeleteElement.addEventListener('click', this.incomeCategoryDelete.bind(this));
    }

    showPopup(popupElement) {
        let elements = this.incomeCardButtonDeleteElement;
        for (let i = 0; i < elements.length; i++) {
            elements[i].onclick = function(){
                // this.parentElement.parentElement.remove();
                popupElement.style.display = 'flex';
            };
        }
    }

    incomeCategoryDelete() {
        this.incomePopupElement.style.display = 'none';
    }
}