<template>
  <div class="login-container">
    <el-form class="login-form">
      <el-form-item>
        <el-input v-model="username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="password" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <el-form-item class="login-buttons">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="register">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from 'element-plus';
import { useactiveMenuStore } from '@/store/activeMenu';

export default {
  name: 'login',
  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
  },
  setup() {
    const username = ref('');
    const password = ref('');
    const router = useRouter();
    const activeMenu = useactiveMenuStore();

    const login = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('/login', {
          username: username.value,
          password: password.value,
        });
        if (response.data.message === '登陆成功') {
          const token = response.data.token;
          localStorage.setItem('token', token);
          activeMenu.setactiveMenuIndex('记账系统');
          router.push('/myAccounts');
          ElMessage.success('登录成功!');
        } else {
          ElMessage.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        ElMessage.error('登录失败，请稍后再试!');
      }
    };

    const register = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('/register', {
          username: username.value,
          password: password.value,
        });
        if (response.data.message === '用户已注册') {
          ElMessage.warning('用户已经注册');
        } else if (response.data.message === '用户名或密码不能为空') {
          ElMessage.warning('用户名或密码不能为空');
        } else {
          ElMessage.success('注册成功');
        }
      } catch (error) {
        console.log(error);
        ElMessage.error('注册失败，请稍后再试!');
      }
    };

    return { username, password, login, register };
  },
};
</script>

<style scoped>
.login-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-buttons {
  margin-top: 20px; /* 调整按钮之间的间距 */
}
</style>
