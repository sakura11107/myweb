<template>
  <div>
    <div ref="chartsContainer" class="chart-container"></div>
    <div ref="linechartsContainer" class="chart-container"></div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { onMounted, onUnmounted, nextTick } from "vue";
import * as echarts from 'echarts';

export default {
  name: 'BillAnalyze',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    billData: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const chartsContainer = ref(null);
    const linechartsContainer = ref(null);
    let barChart = null;
    let lineChart = null;

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    const initBarChart = () => {
      if (barChart) {
        barChart.dispose(); // 销毁柱状图
      }
      if (chartsContainer.value === null) {
        return;
      }
      barChart = echarts.init(chartsContainer.value);

      const option = {
        title: {
          text: '账单分析',
        },
        tooltip: {
          formatter: function (params) {
            const categoryText = params.data.itemStyle.color === '#f56c6c' ? '支出' : '收入';
            return `${params.name}: ${categoryText}${params.value} RMB`;
          }
        },
        legend: { data: ['金额'], color: ['#f56c6c'] },
        xAxis: {
          data: props.billData.map(item => item.item)
        },
        yAxis: {},
        series: [
          {
            name: '金额',
            type: 'bar',
            data: props.billData.map(item => ({
              value: item.amount,
              itemStyle: {
                color: item.category === 'expense' ? '#f56c6c' : '#67c23a'
              }
            }))
          }
        ]
      };
      barChart.setOption(option);
    };

    const initLineChart = () => {
      if (lineChart) {
        lineChart.dispose(); // 销毁折线图
      }
      if (linechartsContainer.value === null) {
        return;
      }
      lineChart = echarts.init(linechartsContainer.value);

      const option = {
        title: {
          text: '账单分析时间折线图',
        },
        tooltip: {
          formatter: function (params) {
            const categoryText = params.data.itemStyle.color === '#f56c6c' ? '支出' : '收入';
            const formattedDate = formatDate(params.name);
            return `${formattedDate}: ${categoryText}${params.value} RMB`;
          }
        },
        legend: { data: ['时间'], color: ['#f56c6c'] },
        xAxis: {
          type: 'category',
          data: props.billData.map(item => item.date),
          axisLabel: {
            formatter: (value) => formatDate(value) // 格式化日期
          }
        },
        yAxis: {},
        series: [
          {
            name: '时间',
            type: 'line',
            data: props.billData.map(item => ({
              value: item.amount,
              itemStyle: {
                color: item.category === 'expense' ? '#f56c6c' : '#67c23a'
              }
            }))
          }
        ]
      };
      lineChart.setOption(option);
    };

    const resizeCharts = () => {
      if (barChart) {
        barChart.resize();
      }
      if (lineChart) {
        lineChart.resize();
      }
    };

    watch(() => [props.visible, props.billData], ([visible, billData]) => {
      if (visible && billData.length > 0) {
        nextTick(() => {
          initBarChart();
          initLineChart();
        });
      }
    });

    onMounted(() => {
      window.addEventListener('resize', resizeCharts);
      if (props.visible && props.billData.length > 0) {
        initBarChart();
        initLineChart();
      }
    });

    onUnmounted(() => {
      if (barChart) {
        barChart.dispose();
      }
      if (lineChart) {
        lineChart.dispose();
      }
      window.removeEventListener('resize', resizeCharts);
    });

    return {
      chartsContainer,
      linechartsContainer
    };
  }
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
  margin-bottom: 20px; /* 添加间隔 */
}

/* 媒体查询，用于适配移动设备 */
@media (max-width: 768px) {
  .chart-container {
    height: 300px; /* 可以根据需要调整高度 */
  }
}

@media (max-width: 480px) {
  .chart-container {
    height: 200px; /* 可以根据需要调整高度 */
  }
}
</style>
