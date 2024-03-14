<template>
  <div class="app-container">
    <div v-if="!id">
      <el-row>
        <el-col :span="6" style="margin-bottom: 30px">
          <label class="radio-label label_filter"
            >{{ user_id }}Ответственный по скрытию:</label
          >
          <el-select
            v-model="user_id"
            style="width: 100%"
            class="select_notification_dialog_flex"
            placeholder="Выберите статус"
          >
            <el-option
              v-for="item in optionsStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-upload
            v-loading="loadingfile"
            class="upload-demo"
            drag
            :on-success="checkResult"
            :on-error="showError"
            :before-upload="beforeUploadXLS"
            :headers="HeadersForUpload"
            :action="api_uri + '/files/hidepart?user_id=' + user_id"
            multiple
            :show-file-list="false"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              Перенесите файл или <em>кликни на загрузить</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                XLS файл должен точно повторять исходный шаблон<br />
                1 столбец - Артикул. 2 Столбец - Причина скрытия
              </div>
            </template>
          </el-upload>
        </el-col></el-row
      >
    </div>
    <div v-else>
      <el-link :href="backend_host + '/storage/' + fileInfo.path">
        Результат
      </el-link>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import request from '@/utils/request'

export default {
  name: 'UploadLaborTimeXLS',
  data() {
    const backend_host = process.env.VUE_APP_BACKEND_HOST
    const api_uri = process.env.VUE_APP_BACKEND_HOST + '/api'
    const id = null
    const loadingfile = false
    const fileInfo = {}
    const errors = []
    return {
      backend_host,
      api_uri,
      id,
      user_id: '15',
      loadingfile,
      HeadersForUpload: {},
      errors,
      fileInfo,
      total: 0,
      listQuery: {
        page: 1,
        limit: 25
      },
      optionsStatus: [
        {
          value: '15',
          label: 'Самаркин'
        },
        {
          value: '87',
          label: 'Маринин'
        },
        {
          value: '35',
          label: 'Федорчук'
        },
        {
          value: '101',
          label: 'Кузьмин'
        }
      ]
    }
  },
  mounted() {
    this.HeadersForUpload = { Authorization: 'Bearer  ' + getToken() }
  },
  methods: {
    localeDate(vdate) {
      return (
        new Date(vdate).toLocaleDateString() +
        ' ' +
        new Date(vdate).toLocaleTimeString()
      )
    },
    checkFieldR1(v) {
      return 'errorCode'
    },
    cancelEdit(row) {
      row.laborTime_name = row.originallaborTime_name //  will be used when user click the cancel botton
      row.laborTime_time = row.originallaborTime_time
      row.edit = false
      this.$message({
        message: 'Значение восстановлено на оригинальное значение',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      console.log(11111)
      row.edit = false
      row.fixed = true
      this.$message({
        message: 'Ошибка исправлена',
        type: 'success'
      })
    },
    beforeUploadXLS(file) {
      this.loadingfile = true
    },
    showError(data) {
      this.loadingfile = false
      this.$notify({
        title: 'Ошибка!',
        message: 'Ошибка на сервере',
        type: 'error',
        duration: 5000
      })
    },
    checkResult(responce, file) {
      this.loadingfile = false
      if (responce.error) {
        this.$notify({
          title: 'Ошибка!',
          message: responce.message,
          type: 'error',
          duration: 5000
        })
      } else {
        this.$notify({
          title: 'Успешно!',
          message: 'Файл загружен',
          type: 'success',
          duration: 5000
        })
        this.id = 1
        this.fileInfo = responce
        // console.log(responce)
      }
    }
  }
}
</script>

<style scoped>
.createPost-container {
  position: relative;
}
.errorCode {
  background-color: orangered;
}
</style>
