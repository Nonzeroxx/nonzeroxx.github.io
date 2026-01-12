import {createRouter, createWebHistory} from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'index',
        component: () => import('@/views/Home.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue'),
        meta: {title: '404'}
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
});

// Change document title based on route meta title
router.afterEach((to) => {
    document.title = to.meta.title as string ? to.meta.title as string : 'rei';
})

export default router;