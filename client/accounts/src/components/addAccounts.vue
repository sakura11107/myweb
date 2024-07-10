<template>
    <div class="addAccounts">
      <el-input v-model="item" style="width: 240px" placeholder="事项" />
      <el-input v-model="amount" style="width: 240px" placeholder="金额" />
      <el-date-picker
          v-model="date"
          type="datetime"
          placeholder="选择时间"
        />
      <el-select
        v-model="category"
        placeholder="类型"
        size="large"
        style="width: 200px"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="sort" placeholder="分类" size="large" style="width: 240px;">
        <el-option v-for="item in sortoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-input v-model="note" style="width: 240px" placeholder="备注" />
      <el-button type="primary" @click="add">确认</el-button>
    </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import { accountsStore } from '@/store/accountsStore'
import { useaddStore } from '@/store/useaddStore';

export default {
        name: 'addAccounts',
        setup() {
          const {addAccountsPage,addAccountsPageVis} = accountsStore();
          const useadd = useaddStore();
          const item = ref('')
          const amount = ref('')
          const date = ref('')
          const category = ref('')
          const note = ref('')
          const sort = ref('')
          const options = [{value: 'income',label: 'income'},{value: 'expense',label: 'expense',}]
          const sortoptions = [
                    {value: '文化休闲',label: '文化休闲'},
                    {value: '日用百货',label: '日用百货'},
                    {value: '餐饮美食',label: '餐饮美食'},
                    {value: '交通出行',label: '交通出行'},
                    {value: '生活服务',label: '生活服务'},
                    {value: '医疗保健',label: '医疗保健'},
                  ]
          const add = async () => {
              try {
                // 构造记账信息对象
                const formData = {
                  item: item.value,
                  amount: parseFloat(amount.value),
                  date: date.value,
                  category: category.value,
                  note: note.value,
                  sort: sort.value,
                };
                // 发送 POST 请求将数据发送到后端
                const response = await axios.post('/accounts/add', formData);
                // 清空表单数据
                item.value = '';
                amount.value = '';
                date.value = '';
                category.value = '';
                note.value = '';
                sort.value = '';
                addAccountsPage();
                await useadd.fetchAccounts(); // 添加记账后更新记账记录
                return response;
                // 在这里可以处理添加成功后的其他逻辑 
              } catch (error) {
                // 如果出现错误，提示用户
                console.error('Error adding account:', error);
                alert('添加记账信息失败！');
              }
            };
          return { item,addAccountsPageVis,addAccountsPage,amount, date, category, note, options,add , sortoptions,sort} 
        }
    }
</script>

<style scoped>
  .addAccounts{
    height: 200px;
    display: flex;
    flex-direction: column;  
    justify-content: center;
    align-items: center;
  }
</style>
