<template>
    <div id="app">
      <h1>记账本</h1>
      <my-accounts></my-accounts>
    </div>
  </template>
  
  <script>
  import MyAccounts from './components/myAccounts.vue';
  
  export default {
    name: 'App',
    components: {
      MyAccounts,
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
  