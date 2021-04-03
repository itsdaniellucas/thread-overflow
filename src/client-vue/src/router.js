import Vue from 'vue'
import VueRouter from 'vue-router'
import ErrorComponent from '@/views/Error'

import appConfig from '@/appConfig'
import LoginService from '@/services/loginService'
import ThreadView from '@/views/routes/ThreadView'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Default',
        redirect: () => ({
            name: 'Thread',
            params: { id: 'all' },
            query: { page: 1 },
        }),
    },
    {
        path: '/threads/:id',
        name: 'Thread',
        component: ThreadView,
    },
    {
        path: '/error/401',
        name: 'Unauthorized',
        component: ErrorComponent,
        meta: {
            data: {
                imageSrc: appConfig.errorImages[401],
                text: '401',
                subTitle: 'Unauthorized',
                content: 'You are unauthorized to access this resource, please make sure to login first.',
                redirectRoute: 'Default',
                redirectText: 'Home',
            }
        }
    },
    {
        path: '/error/403',
        name: 'Forbidden',
        component: ErrorComponent,
        meta: {
            data: {
                imageSrc: appConfig.errorImages[403],
                text: '403',
                subTitle: 'Forbidden',
                content: 'You do not have permission to access this resource.',
                redirectRoute: 'Default',
                redirectText: 'Home',
            }
        }
    },
    {
        path: '/error/404',
        name: 'Not Found',
        component: ErrorComponent,
        meta: {
            data: {
                imageSrc: appConfig.errorImages[404],
                text: '404',
                subTitle: 'Not Found',
                content: 'The page or resource that you are trying to access does not exist.',
                redirectRoute: 'Default',
                redirectText: 'Home',
            }
        }
    },
    {
        path: '/error/500',
        name: 'Internal Server Error',
        component: ErrorComponent,
        meta: {
            data: {
                imageSrc: appConfig.errorImages[500],
                text: '500',
                subTitle: 'Internal Server Error',
                content: 'Oops! Something went wrong.',
                redirectRoute: 'Default',
                redirectText: 'Home',
            }
        }
    },
    {
        path: '*',
        redirect: '/error/404'
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    let name = to.name;

    if(name != 'Thread') {
        document.title = `${name} | Task Tracker`;
    }
    
    if(to.meta.authRequired) {
        let validRoles = to.meta.validRoles;

        if(LoginService.isLoggedIn()) {
            LoginService.getUser().then((currentUser) => {
                if(!validRoles || (currentUser && validRoles && validRoles.includes(currentUser.Role.Name))) {
                    next();
                } else {
                    next({ name: 'Forbidden' });
                }
            });
        } else {
            next({ name: 'Unauthorized' });
        }
    } else {
        next();
    }

    next();
});

export default router
