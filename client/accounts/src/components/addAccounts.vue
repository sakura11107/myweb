<template>
  <div class="addAccounts">
    <el-input v-model="item" class="input-item" placeholder="事项" />
    <el-input v-model="amount" class="input-item" placeholder="金额" />
    <el-date-picker
        v-model="date"
        type="datetime"
        placeholder="选择时间"
        class="input-item"
    />
    <el-select
        v-model="category"
        placeholder="类型"
        size="large"
        class="input-item"
    >
      <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      />
    </el-select>
    <el-select v-model="sort" placeholder="分类" size="large" class="input-item">
      <el-option v-for="item in sortoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-input v-model="note" class="input-item" placeholder="备注" />
    <el-button type="primary" @click="add" class="input-item button">确认</el-button>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { accountsStore } from '@/store/accountsStore';
import { useaddStore } from '@/store/useaddStore';

export default {
  name: 'AddAccounts',
  setup() {
    const { addAccountsPage, addAccountsPageVis } = accountsStore();
    const useadd = useaddStore();
    const item = ref('');
    const amount = ref('');
    const date = ref('');
    const category = ref('');
    const note = ref('');
    const sort = ref('');
    const options = [
      { value: 'income', label: '收入' },
      { value: 'expense', label: '支出' },
    ];
    const sortoptions = [
      { value: '文化休闲', label: '文化休闲' },
      { value: '日用百货', label: '日用百货' },
      { value: '餐饮美食', label: '餐饮美食' },
      { value: '交通出行', label: '交通出行' },
      { value: '生活服务', label: '生活服务' },
      { value: '医疗保健', label: '医疗保健' },
    ];
    const add = async () => {
      try {
        const formData = {
          item: item.value,
          amount: parseFloat(amount.value),
          date: date.value,
          category: category.value,
          note: note.value,
          sort: sort.value,
        };
        const response = await axios.post('/accounts/add', formData);
        item.value = '';
        amount.value = '';
        date.value = '';
        category.value = '';
        note.value = '';
        sort.value = '';
        addAccountsPage();
        await useadd.fetchAccounts();
        return response;
      } catch (error) {
        console.error('Error adding account:', error);
        alert('添加记账信息失败！');
      }
    };

    return {
      item,
      addAccountsPageVis,
      addAccountsPage,
      amount,
      date,
      category,
      note,
      options,
      add,
      sortoptions,
      sort,
    };
  },
};
</script>

<style scoped>
.addAccounts {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-item {
  width: 100%;
}

.button {
  align-self: flex-end;
}

/* 改进后的媒体查询，确保更好的响应式布局 */
@media (min-width: 768px) {
  .addAccounts {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .input-item {
    flex: 1 1 48%; /* 使用 48% 给元素留一点间距 */
    min-width: 48%; /* 防止挤压 */
  }
  .button {
    flex: 1 1 100%;
    min-width: 100%;
  }
}

@media (max-width: 767px) {
  .input-item {
    width: 100%;
  }
  .button {
    width: 100%;
  }
}
</style>
