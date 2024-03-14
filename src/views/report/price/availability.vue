<template>
  <div class="app-container">
    <div v-if="!id">
      <el-row>
        <el-col>
          <el-upload
            v-loading="loadingfile"
            class="upload-demo"
            drag
            :on-success="checkResult"
            :on-error="showError"
            :before-upload="beforeUploadXLS"
            :headers="HeadersForUpload"
            :action="api_uri + '/files/uploadprice'"
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
                Анализу подлежат только артикулы прописанные в 1 столбце начиная с 6 строки.
              </div>
            </template>
          </el-upload>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <el-link :href="backend_host + '/storage/' + fileInfo.path">
        Результат
      </el-link>
      <p>Да: {{ fileInfo.yes }}</p>
      <p>Нет: {{ fileInfo.no }}</p>
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
      loadingfile,
      HeadersForUpload: {},
      errors,
      fileInfo,
      total: 0,
      listQuery: {
        page: 1,
        limit: 25
      }
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
    },
    async getFileInfo(id) {
      this.listLoading = true
      const res = await request({
        url: '/labor_times_files/' + id,
        method: 'get'
      })
      this.fileInfo = res
    },
    async getFileInfoDetails() {
      const res = await request({
        url: '/labor_times_files_details/',
        method: 'get',
        params: {
          laborTimeFiles_id: this.id,
          page: this.listQuery.page
        }
      })
      this.errors = res
      this.total = res.total
      this.listQuery.page = res.current_page
      this.listQuery.limit = res.per_page
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
