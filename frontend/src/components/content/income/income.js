export class Income {
    constructor() {
        this.incomeCardButtonDeleteElement = document.querySelectorAll('.income-expenses-card-button.delete');
        this.incomePopupElement = document.getElementById('pop-up');
        this.incomePopupDeleteElement = document.getElementById('delete');
        this.incomePopupNoDeleteElement = document.getElementById('no-delete');
        this.buttonCategoryElement = document.getElementById("button-category");
        this.itemSvgElement = document.getElementById("item-svg");
        this.incomeElement = document.getElementById("income");

        this.showButtonCategory();
        this.showPopup(this.incomePopupElement);

        this.incomePopupDeleteElement.addEventListener('click', this.incomeCategoryDelete.bind(this));
    }

    showButtonCategory() {
        this.incomeElement.classList.add("active");
        this.buttonCategoryElement.classList.add('active');
        this.buttonCategoryElement.parentElement.classList.add('menu-is-opening');
        this.buttonCategoryElement.parentElement.classList.add('menu-open');
        this.itemSvgElement.classList.add('rotate');
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