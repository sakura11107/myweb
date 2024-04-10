<template>
  <div class="accounting-records">
    <h2 class="records-title">记账记录</h2>
    <el-button type="primary" @click="createAccountsPage">添加账单</el-button>
    <el-dialog
      v-model="myAccounts.addAccountsPageVis"
      title="添加账单"
      width="500"
      :before-close="handleClose"
    >
      <addAccounts></addAccounts>
    </el-dialog>
    
    <ul class="records-list" v-if="accounts.length">
      <li class="record-item" v-for="account in accounts" :key="account._id">
        <el-row class="row">
          <el-col :span="8">
            <div class="item-name">
              <el-input v-model="account.item" v-if="isEdit(account)" />
              <span v-else>{{ account.item }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="amount">
              <el-input v-model="account.amount" v-if="isEdit(account)" />
              <span v-else>{{ account.amount }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div :class="{'category': true, 'expense': account.category === 'expense', 'income': account.category === 'income'}">
              <span v-if="!isEdit(account)">{{ account.category }}</span>
              <el-select v-model="account.category" v-if="isEdit(account)">
                <el-option v-for="category in categories" :key="category" :label="category" :value="category" />
              </el-select>
            </div>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="12">
            <div class="date">
              <span v-if="!isEdit(account)">{{ account.date }}</span>
              <el-date-picker v-model="account.date" type="date" v-if="isEdit(account)" />
            </div>
          </el-col>
          <el-col :span="12">
            <div class="note">
              <span v-if="!isEdit(account) && account.note">{{ account.note }}</span>
              <span v-else-if="!isEdit(account) && !account.note">无备注</span>
              <el-input v-model="account.note" type="textarea" v-if="isEdit(account)" />
            </div>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="24">
            <el-button class="btn-edit" type="primary" @click="toggleEdit(account)">
              {{ isEdit(account) ? '完成' : '编辑' }}
            </el-button>
            <el-button class="btn-delete" type="danger" @click="deleteAccount(account._id)">删除账单</el-button>
          </el-col>
        </el-row>
      </li>
    </ul>
    <p class="no-records" v-else>暂无记账记录</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import addAccounts from './addAccounts.vue'
import { ElMessageBox } from 'element-plus'
import { accountsStore } from '@/store/accountsStore';

export default {
  name:'myAccounts',
  components:{addAccounts},
  setup() {
    const accounts = ref([]);
    const categories = ['expense', 'income']; 
  

    const myAccounts=accountsStore()
    const addAccountsPageVis = myAccounts.addAccountsPageVis; 

    const createAccountsPage = ()=>{
      myAccounts.addAccountsPage()
      //console.log(myAccounts.addAccountsPageVis)
    }

    const isEdit = (account) => {
      return account.isEdit;
    }

    const toggleEdit = (account) => {
      account.isEdit = !account.isEdit;
      if (!account.isEdit) {
        updateAccount(account);
      }
    }


    const updateAccount = async (account) =>{
      try {
        const response = await axios.put(`/accounts/${account._id}`, account);
        console.log('Account updated successfully:', response.data);
        // 处理更新成功后的逻辑
      } catch (error) {
        console.error('Error updating account:', error);
        alert('更新记账信息失败！');
      }
    }

    const deleteAccount= async (accountId) => {
      try {
      // 发送 DELETE 请求来删除账单
      const response = await axios.delete(`/accounts/${accountId}`);
      // 在这里处理删除成功后的逻辑，例如更新页面状态或显示消息
      //console.log('Account deleted successfully:', response.data);
      // 删除成功后，从页面的账单列表中移除该账单
      accounts.value = accounts.value.filter(account => account._id !== accountId);
      } catch (error) {
      // 如果出现错误，打印错误信息或显示适当的错误消息
      console.error('Error deleting account:', error);
      alert('删除记账信息失败！');
      }
    }

    const handleClose = function(done) {  
      ElMessageBox.confirm('确定不需要添加？')  
      .then(function() {  
        done();  
      })  
      .catch(function() {  
      });  
    }
    
    onMounted(async () => {
      try {
        const response = await axios.get('/accounts');
        accounts.value = response.data;
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    })

    return { accounts,handleClose,categories,isEdit,toggleEdit,updateAccount,deleteAccount,createAccountsPage,myAccounts,addAccountsPageVis}
  }
};
</script>

<style scoped>
  .accounting-records {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.records-title {
  text-align: center;
  margin-bottom: 20px;
}

.records-list {
  list-style-type: none;
  padding: 0;
}

.record-item {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.row {
  margin-bottom: 10px;
}

.item-name {
  font-weight: bold;
  display: inline-block;
  margin-right: 10px;
}

.amount {
  font-weight: bold;
  color: #333;
}

.category {
  font-style: italic;
}

.expense {
  color: red;
}

.income {
  color: green;
}

.date {
  color: #888;
}

.note {
  color: #666;
  font-style: italic;
}

.no-records {
  text-align: center;
  margin-top: 20px;
  color: #888;
}

.btn-save, .btn-delete {
  margin-right: 10px;
}
</style>