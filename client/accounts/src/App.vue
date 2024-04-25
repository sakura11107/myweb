<template>
    <div id="app">
      <h1>个人网站</h1>
      <router-view></router-view>
    </div>
</template>
  
<script>
import Login from './components/login.vue';
import MyAccounts from './components/myAccounts.vue';

export default {
  name: 'App',
  components: {
    MyAccounts,
    Login,
  },
};
</script>
  
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style> 
  