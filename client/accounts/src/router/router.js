import {createRouter,createWebHistory} from 'vue-router';
import MyAccounts from '../components/myAccounts.vue';
import Login from '../components/login.vue'

const router = createRouter({
    history:createWebHistory(),
    routes:[
        {path:'/myAccounts',component:MyAccounts},
        {path:'/',component:Login}
    ]
})

export default router;