<template>
  <div ref="chartsContainer" style="width: 100%;height: 400px">
  </div>
</template>

<script>
  import {ref, watch} from "vue";
  import {onMounted, onUnmounted, nextTick} from "vue";
  import * as echarts from 'echarts'

  export default {
    name: 'billAnalyze',
    props:{
      visible:{
        type: Boolean,
        required: true
      },
      billData: {
        type: Array,
        required: true
      }
    },
    setup(props) {
      const chartsContainer = ref(null)
      let chart = null

      const initChart = () =>{
        if(chart){
          chart.dispose()//销毁图表
        }
        if (chartsContainer.value===null){
          return
        }
        chart = echarts.init(chartsContainer.value)

        const option = {
          title: {
            text: '账单分析',
          },
          tooltip:{
            formatter: function(params){
              const categoryText = params.data.itemStyle.color === '#f56c6c' ? '支出' : '收入'
              return `${params.name}:${categoryText}${params.value}RMB`
            }
          },
          legend: {data: ['金额'],color: ['#f56c6c']},
          xAxis: {
            data: props.billData.map(item => item.item)
          },
          yAxis:{},
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
        }
        chart.setOption(option)
      }


      watch(()=>props.visible,(newVal) =>{
        if(newVal){
          nextTick(()=>{
            initChart()
          })
        }
      })

      watch(()=>props.billData,(newVal)=>{
        if(props.visible && props.billData.length > 0){
          initChart()
        }
      })

      onMounted(() => {
        if(props.visible && props.billData.length > 0){
          initChart()
        }
      })

      onUnmounted(() => {
        if(chart){
          chart.dispose()
        }
      })

      return {
        chartsContainer
      }
    }
  }

</script>

<style scoped>

</style>