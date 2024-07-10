import {createRouter,createWebHistory} from 'vue-router';
import MyAccounts from '../components/myAccounts.vue';
import Login from '../components/login.vue'
import User from '@/components/user.vue';
import Earth from '@/components/earth.vue';
import myMusic from '@/components/myMusic.vue';

const router = createRouter({
    history:createWebHistory(),
    routes:[
        {path:'/myAccounts',component:MyAccounts,name:'记账系统',meta:{requiresAuth:true}},
        {path:'/',component:Login,name:'登陆'},
        {path:'/mymusic',component:myMusic, name:'音乐',meta:{requiresAuth:true}},
        // {path:'/myblog',name:'博客'},
        // {path:'/myai',name:'AI对话'},
        {path:'/earth',component:Earth,name:'地球'},
        {path:'/user',component:User,name:'用户',meta:{requiresAuth:true}}
    ]
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('token');

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isAuthenticated) {
            const confirmed = window.confirm('您需要登录才能访问该页面。是否现在登录？');
            if (confirmed) {
                next('/');
            }
        } else {
            next();
        }
    } else {
        next();
    }
});

window.addEventListener('beforeunload', () => {
    localStorage.removeItem('token');
});

export default router;