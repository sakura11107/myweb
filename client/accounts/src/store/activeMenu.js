import { defineStore } from "pinia";

export const useactiveMenuStore = defineStore({
    id:'activeMenu',
    state:()=>({
        activeMenuIndex : '用户'
    }),
    actions:{
        setactiveMenuIndex(index){
            this.activeMenuIndex = index;
        }
    }
})