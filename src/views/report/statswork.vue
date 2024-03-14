<template>
  <div class="app-container" v-loading="loadingfile">
    <p>Выберите дату</p>
    <el-date-picker
      v-model="dayPeriod"
      type="daterange"
      range-separator="|"
      start-placeholder="Начало периода"
      format="dd.MM.yyyy"
      value-format="yyyy-MM-dd"
      end-placeholder="Конец периода"
      @change="getList"
    />
    <el-button
      style="margin: 0 0 20px 20px"
      type="primary"
      icon="el-icon-document"
      @click="handleDownload"
    >
      Сформировать в Excel
    </el-button>

    <el-link v-if="reportFileName" :href="backend_host + '/storage/' + reportFileName">
      Отчёт сформирован. Скачать
    </el-link>
  </div>
</template>

<script>

import request from '@/utils/request'

export default {

  data() {
    const backend_host = process.env.VUE_APP_BACKEND_HOST
    return {
      backend_host,
      reportFileName: false,
      loadingfile: false,
      dayPeriod: ''
    }
  },
  methods: {
    async handleDownload() {
      if (this.dayPeriod) {
        this.reportFileName = false
        this.loadingfile = true
        const params = {}
        params.start_date = this.dayPeriod[0]
        params.end_date = this.dayPeriod[1]
        const res = await request({
          url: '/report/statswork',
          method: 'get',
          params
        })
        this.reportFileName = res.data
        this.loadingfile = false
        console.log('res', res)
      } else {
        this.$notify({
          title: 'Ошибка!',
          message: 'Выберите период',
          type: 'error',
          duration: 5000
        })
      }
    }
  }
}
</script>
