import { defineStore } from "pinia";

export const accountsStore=defineStore({
    id:'accounts',
    state:()=>({
        addAccountsPageVis:false
    }),

    actions:{
        addAccountsPage(){
            this.addAccountsPageVis=!this.addAccountsPageVis;
        },
    }
})