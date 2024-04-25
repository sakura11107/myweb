<template>
  <form>
    <input v-model="username" type="text" placeholder="请输入用户名">
    <input v-model="password" type="text" placeholder="请输入密码">
    <button @click="login">登陆</button>
    <button @click="register">注册</button>
  </form>
</template>

<script>
    import {ref} from 'vue';
    import axios from 'axios';
    import {useRouter} from 'vue-router'

    export default {
        name:'login',
        setup(){
            const username = ref('');
            const password = ref('');
            const router = useRouter();

            const login = async (e) => {
                e.preventDefault();
                try{
                    const response = await axios.post('/login',{
                        username:username.value,
                        password:password.value
                    });
                    if(response.data.message ==='登陆成功'){
                        router.push('/myAccounts');
                    }else{
                        alert(response.data.message)
                    }
                }catch(error){
                    console.log(error);
                }
            }

            const register = async (e) =>{
                e.preventDefault();
                try{
                    const response = await axios.post('/register',{
                        username:username.value,
                        password:password.value
                    })
                    if(response.data.message === '用户已注册'){
                        alert('用户已经注册')
                    }else if(response.data.message === '用户名或密码不能为空'){
                        alert('用户名或密码不能为空')
                    }else{
                        alert('注册成功')
                    }
                }catch(error){
                    console.log(error);
                }
            }

            return {username,password,login,register}
        }
    }
</script>

<style>

</style>