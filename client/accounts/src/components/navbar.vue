<template>
  <div class="navbar">
        <div class="navbar-container">
          <el-menu :default-active="activeMenuIndex" mode="horizontal" @select="handleMenuSelect">
            <el-menu-item index="记账系统">记账系统</el-menu-item>
            <el-menu-item index="音乐">音乐</el-menu-item> 
            <!-- <el-menu-item index="博客">博客</el-menu-item>   
            <el-menu-item index="AI对话">AI对话</el-menu-item>  -->
            <el-menu-item index="地球">地球</el-menu-item>
            <el-menu-item index="用户">用户</el-menu-item>
          </el-menu>
        </div>
      </div>
</template>

<script>
    import { useactiveMenuStore } from '@/store/activeMenu';
    import { watch } from 'vue';
    import { useRouter } from 'vue-router';
    import {ref,watchEffect} from 'vue';

    export default {
        name:'navbar',
        setup(){
            const activeMenu = useactiveMenuStore();
            const router = useRouter();
            
            const activeMenuIndex = ref('');

            const handleMenuSelect = (index) => {
                activeMenu.setactiveMenuIndex(index);
                router.push({name:index})
            }

            watchEffect(()=>{
                if(router.currentRoute.value.name === '记账系统'){
                    activeMenuIndex.value = '记账系统';
                }
            })

            
            watch(
                ()=>router.currentRoute.value.name,
                
                (newName)=>{
                    activeMenu.setactiveMenuIndex(newName)
                },
                {immediate:true}
            )
            
            watch(
                ()=>activeMenu.activeMenuIndex,
                (newIndex)=>{
                    activeMenuIndex.value = newIndex;
                },
                {immediate:true}
            )
            
            return{activeMenuIndex,handleMenuSelect}
        }
    }
</script>

<style scoped>
    .navbar {
    background-color: #f0f0f0;
    padding: 10px 0;
    position: fixed; /* 添加固定定位 */
    top: 0; /* 将导航栏置顶 */
    width: 100%; /* 确保导航栏铺满整个屏幕 */
    z-index: 1000; /* 设置层级，使其显示在其他内容之上 */
  }
  .navbar-container {
    max-width: 1200px;
    margin: 0 auto;
  }
</style>