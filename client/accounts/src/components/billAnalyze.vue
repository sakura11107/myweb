<template>
  <div ref="chartsContainer" class="chart-container">
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
    let chart = null;

    const initChart = () => {
      if (chart) {
        chart.dispose(); // 销毁图表
      }
      if (chartsContainer.value === null) {
        return;
      }
      chart = echarts.init(chartsContainer.value);

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
      chart.setOption(option);
    };

    const resizeChart = () => {
      if (chart) {
        chart.resize();
      }
    };

    watch(() => [props.visible, props.billData], ([visible, billData]) => {
      if (visible && billData.length > 0) {
        nextTick(() => {
          initChart();
        });
      }
    });

    onMounted(() => {
      window.addEventListener('resize', resizeChart);
      if (props.visible && props.billData.length > 0) {
        initChart();
      }
    });

    onUnmounted(() => {
      if (chart) {
        chart.dispose();
      }
      window.removeEventListener('resize', resizeChart);
    });

    return {
      chartsContainer
    };
  }
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
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
