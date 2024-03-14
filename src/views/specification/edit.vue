<template>
  <div class="app-container">
    <div v-if="!id">
      <el-page-header content="1. Загрузка файла спецификации" title="Назад" @back="$router.go(-1)" />
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
            :action="api_uri + '/files/uploadspecification'"
            multiple
            :show-file-list="false"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              Перенесите файл или <em>кликни на загрузить</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                XLS файл должен точно повторять исходный шаблон
              </div>
            </template>
          </el-upload>
        </el-col>
      </el-row>
    </div>
    <div v-else-if="loadingfile">
      Обработка файла
    </div>
    <div v-else>
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <h1>Результат загрузки</h1>
            <!--el-button class="button" type="text">Operation button</el-button-->
          </div>
        </template>
        <div class="text item">
          <p>Наименование файла: {{ fileInfo.filename }}</p>
          <p>Дата загрузки: {{ localeDate(fileInfo.created_at) }}</p>
          <div v-if="fileInfo.status == 'error_structure' || fileInfo.status == 'error_code' || fileInfo.status == 'error_field'">
            <p v-if="fileInfo.status == 'error_structure'">
              Результат: Ошибка в структуре файла. Например добавлены или удалены столбцы, переименованы наименования ключевых столбцов
            </p>
            <p v-if="fileInfo.status == 'error_field'">
              Результат:	Наименование столбца не соответствует ни одной группе модификаций в системе.
            </p>
            <p style="color: red;">
              Дальнейшая загрузка файла невозможна до исправления ошибки
            </p>
            <el-table :data="errors.data" border fit highlight-current-row style="width: 100%">
              <el-table-column label="Наименование листа в XLS" width="220">
                <template #default="scope">
                  {{ scope.row.sheetName }}
                </template>
              </el-table-column>
              <el-table-column v-if="fileInfo.status !== 'error_structure'" align="center" label="Строка" width="80">
                <template #default="scope">
                  {{ scope.row.row_num }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="Столбец" width="90">
                <template #default="scope">
                  {{ scope.row.field_num }}
                </template>
              </el-table-column>
              <el-table-column v-if="fileInfo.status == 'error_structure' || fileInfo.status == 'error_field'" align="center" label="Значение" width="250">
                <template #default="scope">
                  <el-tag type="danger">
                    {{ scope.row.value }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column v-if="fileInfo.status == 'error_structure'" align="center" label="Ожидаемое значение" width="180">
                <template #default="scope">
                  {{ scope.row.possibleValue }}
                </template>
              </el-table-column>
              <el-table-column v-if="fileInfo.status == 'error_code'" label="Р1" align="center" width="50">
                <template #default="scope">
                  <el-tag
                    v-if="scope.row.errortype == 'r1'"
                    type="danger"
                  >
                    {{ scope.row.r1 }}
                  </el-tag>
                  <span v-else>{{ scope.row.r1 }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="fileInfo.status == 'error_code'" label="Р2" align="center" width="50">
                <template #default="scope">
                  <el-tag
                    v-if="scope.row.errortype == 'r2'"
                    type="danger"
                  >
                    {{ scope.row.r2 }}
                  </el-tag>
                  <span v-else>{{ scope.row.r2 }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="fileInfo.status == 'error_code'" label="Р3" align="center" width="50">
                <template #default="scope">
                  <el-tag
                    v-if="scope.row.errortype == 'r3'"
                    type="danger"
                  >
                    {{ scope.row.r3 }}
                  </el-tag>
                  <span v-else>{{ scope.row.r3 }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Описание ошибки">
                <template #default="scope">
                  {{ scope.row.info }}
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="total>listQuery.limit" layout="prev, pager, next" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getFileInfoDetails" />

          </div>
          <div v-if="fileInfo.status == 'manual_processing'">
            <el-table :data="manual_processing" border fit highlight-current-row style="width: 100%">
              <el-table-column width="200px" align="center" label="Группа">
                <template slot-scope="{row}">
                  <span>{{ row.group }}</span>
                </template>
              </el-table-column>

              <el-table-column width="80px" align="center" label="Код НЧ">
                <template slot-scope="{row}">
                  <span>{{ row.laborTime_code }}</span>
                </template>
              </el-table-column>

              <el-table-column min-width="295px" label="Наименование">
                <template slot-scope="{row}">
                  <template v-if="row.edit">
                    <el-input v-model="row.laborTime_name" class="edit-input edit-input-name" size="small" @keyup.13.native="confirmEdit(row)" />
                    <el-button class="cancel-btn" size="small" icon="el-icon-refresh-left" type="warning" @click="cancelEdit(row)" />
                  </template>
                  <span v-else>{{ row.laborTime_name }}</span>
                </template>
              </el-table-column>

              <el-table-column class-name="labortime_center" width="100px" label="Значение">
                <template slot-scope="{row}">
                  <template v-if="row.edit">
                    <el-input v-model="row.laborTime_time" class="edit-input edit-input-name" size="small" @keyup.13.native="confirmEdit(row)" />
                    <el-button class="cancel-btn" size="small" icon="el-icon-refresh-left" type="warning" @click="cancelEdit(row)" />
                  </template>
                  <span v-else>{{ row.laborTime_time }}</span>
                </template>
              </el-table-column>

              <el-table-column width="230px" align="left" label="Ошибка">
                <template slot-scope="{row}">
                  <span v-if="!row.fixed" style="color: orangered;"><i class="el-icon-error" /> {{ row.error }}</span>
                  <span v-if="row.fixed" style="color: limegreen;"><i class="el-icon-success" /> {{ row.error }} </span>
                </template>
              </el-table-column>

              <el-table-column align="center" label="" width="60" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                  <el-button v-if="row.edit" type="success" size="small" icon="el-icon-circle-check-outline" @click="confirmEdit(row)">Ok</el-button>
                  <el-tooltip
                    v-else
                    class="box-item"
                    effect="light"
                    placement="top-start"
                    content="Редактировать"
                    popper-class="uaz__tooltip uaz__tooltip-left"
                  >
                    <el-button
                      size="mini"
                      class="el-button-icon"
                      @click="row.edit=!row.edit"
                    >
                      <i class="el-icon-edit" />
                    </el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import request from '@/utils/request'
import Pagination from '@/components/Pagination'

export default {
  name: 'SpecificationEdit',
  components: { Pagination },
  data() {
    const api_uri = process.env.VUE_APP_BACKEND_HOST + '/api'
    const id = null
    const loadingfile = false
    const fileInfo = {}
    const errors = []
    const error_field = []
    const manual_processing = []
    return {
      api_uri,
      id,
      loadingfile,
      HeadersForUpload: {},
      errors,
      error_field,
      manual_processing,
      fileInfo,
      total: 0,
      listQuery: {
        page: 1,
        limit: 25
      }
    }
  },
  mounted() {
    this.HeadersForUpload = { 'Authorization': 'Bearer  ' + getToken() }
    if (this.$route.params && this.$route.params.id) {
      this.id = this.$route.params.id
      // this.getFileInfo(this.id)
      // this.getFileInfoDetails()
      console.log(this.id)
    }
  },
  methods: {
    localeDate(vdate) {
      return (new Date(vdate)).toLocaleDateString() + ' ' + new Date(vdate).toLocaleTimeString()
    },

    cancelEdit(row) {
      /* row.laborTime_name = row.originallaborTime_name //  will be used when user click the cancel botton
      row.laborTime_time = row.originallaborTime_time
      row.edit = false
      this.$message({
        message: 'Значение восстановлено на оригинальное значение',
        type: 'warning'
      })*/
    },
    confirmEdit(row) {
      console.log(11111)
      row.edit = false
      // row.laborTime_name = row.originallaborTime_name //  will be used when user click the cancel botton
      // row.laborTime_time = row.originallaborTime_time
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
          message: 'Шаг 1. Файл загружен',
          type: 'success',
          duration: 5000
        })
        this.$router.push('/labortime/upload/edit/' + responce.laborTimeFiles_id)
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
