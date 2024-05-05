<template>
    <div id="app">
      <navbar></navbar>
      <router-view></router-view>
    </div>
</template>
  
<script>
  import Login from './components/login.vue';
  import MyAccounts from './components/myAccounts.vue';
  import Navbar from './components/navbar.vue'
  import User from './components/user.vue';

  export default {
    name: 'App',
    components: {
      MyAccounts,
      Login,
      Navbar,
      User
    },
  };
</script>
  
<style scoped>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style> 
  