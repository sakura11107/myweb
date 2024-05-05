import { defineStore } from "pinia";
import  axios  from "axios";

export const useaddStore  = defineStore({
    id:'addStore',
    state: () => ({
        accounts: [],
    }),
    actions:{
        async fetchAccounts(){
            try {
                const response = await axios.get('/accounts');
                this.accounts = response.data; // 直接赋值更新 state
            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        }
    },
    getters: {
        allAccounts: (state) => state.accounts, 
    },
})