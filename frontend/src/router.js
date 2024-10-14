import {Home} from "./components/home.js";
import {Login} from "./components/auth/login.js";
import {SignUp} from "./components/auth/sign-up.js";
import {Layout} from "./components/layout.js";
import {FileUtils} from "./utils/file-utils.js";
import {Income} from "./components/content/income/income.js";
import {IncomeCreate} from "./components/content/income/income-create.js";
import {IncomeEdit} from "./components/content/income/income-edit.js";
import {Expenses} from "./components/content/expenses/expenses.js";
import {ExpensesCreate} from "./components/content/expenses/expenses-create.js";
import {ExpensesEdit} from "./components/content/expenses/expenses-edit.js";
import {Transaction} from "./components/content/transaction/transaction.js";
import {TransactionCreate} from "./components/content/transaction/transaction-create.js";
import {TransactionEdit} from "./components/content/transaction/transaction-edit.js";
import {Logout} from "./components/auth/logout.js";
import {AuthUtils} from "./utils/auth-utils";

export class Router {
    constructor() {
        this.initEvents();
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/pages/home.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Home();
                },
                scripts: [
                    'Chart.min.js'
                ]
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/pages/404.html'
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                load: () => {
                    new Login(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                load: () => {
                    new SignUp(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                }

            },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/content/income/income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Income();
                }
            },
            {
                route: '/income-create',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/pages/content/income/income-create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeCreate();
                }
            },
            {
                route: '/income-edit',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/pages/content/income/income-edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeEdit();
                }
            },
            {
                route: '/expenses',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/content/expenses/expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Expenses();
                }
            },
            {
                route: '/expenses-create',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/pages/content/expenses/expenses-create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpensesCreate();
                }
            },
            {
                route: '/expenses-edit',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/pages/content/expenses/expenses-edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpensesEdit();
                }
            },
            {
                route: '/transaction',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/content/transaction/transaction.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Transaction();
                }
            },
            {
                route: '/transaction-create',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/pages/content/transaction/transaction-create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new TransactionCreate();
                }
            },
            {
                route: '/transaction-edit',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/pages/content/transaction/transaction-edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new TransactionEdit();
                }
            }
        ]
        this.authorizationCheck();
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }

    async clickHandler(e) {
        let element = null;
        if (e.target.nodeName === 'A') {
            this.authorizationCheck();
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }

        if (element) {
            e.preventDefault();

            const currentRoute = window.location.pathname;

            const url = element.href.replace(window.location.origin, '');

            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
                return;
            }

            await this.openNewRoute(url);
        }
    }

    async activateRoute(e, oldRoute = null) {
        if (oldRoute && this.routes) {
            const currentRoute = this.routes.find(item => item.route === oldRoute);
            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach(script => {
                    if (document.querySelector(`script[src='/js/${script}']`)) {
                        document.querySelector(`script[src='/js/${script}']`).remove();
                    }
                })
            }

            if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                currentRoute.unload();
            }
        }

        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    await FileUtils.loadPageScript('/js/' + script);
                }
            }

            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Lumincoin Finance';
            }

            if (newRoute.filePathTemplate) {
                let contentBlock = this.contentPageElement;

                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
                    document.body.classList.add('sidebar-mini');
                    document.body.classList.add('layout-fixed');
                    new Layout();
                } else {
                    document.body.classList.remove('sidebar-mini');
                    document.body.classList.remove('layout-fixed');

                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            history.pushState({}, '', '/404')
            await this.activateRoute();
        }
    }

    authorizationCheck() {
        if (!AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }
    }
}