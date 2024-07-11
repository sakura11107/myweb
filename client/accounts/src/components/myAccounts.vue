<template>
  <div class="accounting-records">
    <div class="header">
      <h2 class="records-title">记账记录</h2>
      <el-button type="primary" @click="createAccountsPage">添加账单</el-button>
      <el-button type="primary" @click="analyzeAccounts">分析账单</el-button>
    </div>
    <el-dialog
      v-model="myAccounts.addAccountsPageVis"
      title="添加账单"
      width="800"
      :before-close="handleClose"
    >
      <addAccounts></addAccounts>
    </el-dialog>

    <el-drawer title="账单分析" :model-value="drawer" @close="drawer=false" >
      <billAnalyze :visible="drawer" :bill-data="billData"></billAnalyze>
    </el-drawer>


    <ul class="records-list" v-if="accounts.length">
      <li class="record-item" v-for="account in accounts" :key="account._id">
        <el-row class="row">
          <el-col :span="8">
            <div class="item-name">
              <el-input v-model="account.item" v-if="isEdit(account)" />
              <span v-else>事项：{{ account.item }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="amount">
              <el-input v-model="account.amount" v-if="isEdit(account)" />
              <span v-else>金额：{{ account.amount }} RMB</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div :class="{'category': true, 'expense': account.category === 'expense', 'income': account.category === 'income'}">
              <span v-if="!isEdit(account)">{{getCategoryDisplayText(account.category)}}：{{ account.category }}</span>
              <el-select v-model="account.category" v-if="isEdit(account)">
                <el-option v-for="category in categories" :key="category" :label="category" :value="category" />
              </el-select>
            </div>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="12">
            <div class="date">
              <span v-if="!isEdit(account)">日期：{{ account.date }}</span>
              <el-date-picker v-model="account.date" type="datetime" v-if="isEdit(account)" />
            </div>
          </el-col>
          <el-col :span="12">
            <div class="note">
              <span v-if="!isEdit(account) && account.note">备注：{{ account.note }}</span>
              <span v-else-if="!isEdit(account) && !account.note">无备注</span>
              <el-input v-model="account.note" type="textarea" v-if="isEdit(account)" />
            </div>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="24">
            <div class="sort">
              <span v-if ="!isEdit(account)">分类：{{ account.sort }}</span>
              <el-select v-model="account.sort"  size="large" style="width: 240px;" v-if="isEdit(account)">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
            <div class="actions">
              <el-button class="btn-edit" type="primary" @click="toggleEdit(account)">
                {{ isEdit(account) ? '完成' : '编辑' }}
              </el-button>
              <el-button class="btn-delete" type="danger" @click="deleteAccount(account._id)">删除账单</el-button>
            </div>
          </el-col>
        </el-row>
      </li>
    </ul>
    <p class="no-records" v-else>暂无记账记录</p>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import axios from 'axios';
import addAccounts from './addAccounts.vue'
import billAnalyze from './billAnalyze.vue'
import { ElMessageBox } from 'element-plus'
import { accountsStore } from '@/store/accountsStore';
import { useaddStore } from '@/store/useaddStore';

export default {
  name: 'myAccounts',
  components: { addAccounts ,billAnalyze },
  setup() {
    const categories = ['expense', 'income']; 
    const myAccounts = accountsStore();
    const addAccountsPageVis = myAccounts.addAccountsPageVis;

    const addStore = useaddStore();
    const accounts = computed(() => addStore.allAccounts);

    const drawer = ref(false);
    const billData = ref([]);
    const analyzeAccounts = () => {
      drawer.value = true;
      fetchBillData();
    };

    const getCategoryDisplayText = computed (()=>{
      return (category) => {
        if (category === 'expense') {
          return '支出'
        } else {
          return '收入'
        }
      }
    })

    const fetchBillData = async () =>{
      try {
        const response = await axios.get('/accounts');
        billData.value = response.data;
      } catch (error) {
        console.error(error);
      }
    }

    const value = ref('');
    const options = [
      { value: '文化休闲', label: '文化休闲' },
      { value: '日用百货', label: '日用百货' },
      { value: '餐饮美食', label: '餐饮美食' },
      { value: '交通出行', label: '交通出行' },
      { value: '生活服务', label: '生活服务' },
      { value: '医疗保健', label: '医疗保健' },
    ];

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found in localStorage');
          return;
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get('/accounts');
        await addStore.fetchAccounts(); 
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();



    const createAccountsPage = () => {
      myAccounts.addAccountsPage();
    };

    const isEdit = (account) => {
      return account.isEdit;
    };

    const toggleEdit = (account) => {
      account.isEdit = !account.isEdit;
      if (!account.isEdit) {
        updateAccount(account);
      }
    };

    const updateAccount = async (account) => {
      try {
        const response = await axios.put(`/accounts/${account._id}`, account);
      } catch (error) {
        console.error('Error updating account:', error);
        alert('更新记账信息失败！');
      }
    };

    const deleteAccount = async (accountId) => {
      try {
        const response = await axios.delete(`/accounts/${accountId}`);
        await addStore.fetchAccounts();
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('删除记账信息失败！');
      }
    };

    const handleClose = function(done) {  
      ElMessageBox.confirm('确定不需要添加？')  
      .then(function() {  
        done();  
      })  
      .catch(function() {  
      });  
    };

    return { accounts, handleClose, categories, isEdit, toggleEdit, updateAccount, deleteAccount, createAccountsPage, myAccounts, addAccountsPageVis, value, options, drawer, billData, analyzeAccounts, getCategoryDisplayText };
  }
};
</script>

<style scoped>
.accounting-records {
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f0f2f5;
  border-radius: 8px;
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.records-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.records-list {
  list-style-type: none;
  padding: 0;
}

.record-item {
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.row {
  margin-bottom: 15px;
}

.item-name, .amount, .category, .date, .note, .sort {
  font-size: 16px;
  color: #333;
}

.expense {
  color: red;
}

.income {
  color: green;
}

.actions {
  display: flex;
  justify-content: flex-end;
}

.btn-edit, .btn-delete {
  margin-right: 10px;
}

.btn-edit:last-child {
  margin-right: 0;
}

.no-records {
  text-align: center;
  font-size: 16px;
  color: #888;
  margin-top: 20px;
}
</style>
