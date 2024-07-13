<template>
  <div class="container">
    <div v-if="loading">Loading...</div>
    <div v-else class="content">
      <h2>User Information</h2>
      <div v-if="user">
        <p>Username: {{ user.username }}</p>
        <p>Password: {{ user.password }}</p>
      </div>
      <el-form :model="form" @submit.prevent="updateUser" class="form">
        <el-form-item label="New Username" required>
          <el-input v-model="form.newUsername" placeholder="New Username"></el-input>
        </el-form-item>
        <el-form-item label="New Password" required>
          <el-input v-model="form.newPassword" placeholder="New Password" show-password></el-input>
        </el-form-item>
          <div class="button-container">
            <el-button type="primary" native-type="submit">Update</el-button>
            <el-button @click="deleteAccount" type="danger">删除账号</el-button>
            <el-button @click="logout" type="info">退出</el-button>
          </div>
      </el-form>
    </div>
  </div>
</template>
  
<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ElButton, ElInput, ElForm, ElFormItem,ElMessage } from 'element-plus';
import { useactiveMenuStore } from '@/store/activeMenu';

export default {
  name:'user',
  components: {
    ElButton,
    ElInput,
    ElForm,
    ElFormItem
  },
  setup() {
    const loading = ref(true);
    const user = ref(null);
    const router = useRouter();
    const activeMenu = useactiveMenuStore();

    const form = ref({
      newUsername: '',
      newPassword: ''
    });

    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('/user');
        user.value = response.data;
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        loading.value = false;
      }
    };
    fetchUserInfo();

    const updateUser = async () => {
      try {
        const response = await axios.post('/user', {
          username: form.value.newUsername,
          password: form.value.newPassword
        });
        user.value = response.data;
        form.value.newUsername = '';
        form.value.newPassword = '';
        ElMessage.success('用户信息更新成功');
      } catch (error) {
        console.error('Error updating user:', error);
      }
    };

    const deleteAccount = async () => {
      try {
        const response = await axios.delete('/user');
        user.value = null;
        if (response.data.message === '账号删除成功') {
          localStorage.clear();
          ElMessage.success('账号删除成功');
          router.push('/');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    };

    const logout = () => {
      localStorage.clear();
      activeMenu.setactiveMenuIndex('');
      ElMessage.success('退出成功');
      router.push('/');
    };
    return {
      loading,
      user,
      form,
      updateUser,
      deleteAccount,
      logout
    };
  }
};
</script>
  
<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.content {
  text-align: center;
}

.form {
  max-width: 400px;
  width: 100%;
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px; /* Adjust margin as needed */
}

.el-button {
  margin: 0 5px; /* Adjust margin between buttons as needed */
}
</style>
  