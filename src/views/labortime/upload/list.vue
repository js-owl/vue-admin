<template>
  <div class="app-container labortime_upload_list">
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        label="Название файла"
        class-name="break_word fixed-width"
      >
        <template #default="scope">
          <el-link
            :href="storage + scope.row.path"
            :download="scope.row.filename"
          >
            <el-tooltip
              class="box-item"
              effect="light"
              placement="top-start"
              content="Скачать"
              popper-class="uaz__tooltip uaz__tooltip-left"
            >
              <el-button size="mini" class="el-button-icon">
                <i class="el-icon-download" />
              </el-button>
            </el-tooltip>
          </el-link>
          <span class="fixed-center">{{ scope.row.filename }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Статус" width="224">
        <template #default="scope">
          <el-tag :type="statusFilter(scope.row.status)">
            {{ getStatus(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Дата загрузки" width="160">
        <template #default="scope">
          {{ localeDate(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="90"
        class-name="small-padding fixed-width add-button button-tooltip"
      >
        <template #header>
          <router-link :to="'/labortime/upload/edit'">
            <el-button size="mini" class="add-element" type="primary"
              >Добавить</el-button
            >
          </router-link>
        </template>
        <template #default="scope">
          <router-link
            :to="'/labortime/upload/edit/' + scope.row.laborTimeFiles_id"
          >
            <el-tooltip
              class="box-item"
              effect="light"
              placement="top-start"
              content="Редактировать"
              popper-class="uaz__tooltip uaz__tooltip-left"
            >
              <el-button size="mini" class="el-button-icon">
                <i class="el-icon-edit" />
              </el-button>
            </el-tooltip>
          </router-link>
          <el-popconfirm
            confirm-button-text="Да"
            cancel-button-text="Нет, спасибо"
            title="Подтверждаете удаление?"
            @onConfirm="deleteRow(scope.$index, scope.row)"
          >
            <template #reference>
              <el-tooltip
                class="box-item"
                effect="light"
                placement="top-start"
                content="Удалить"
                popper-class="uaz__tooltip uaz__tooltip-left"
              >
                <el-button size="mini" class="el-button-icon danger">
                  <i class="el-icon-delete" />
                </el-button>
              </el-tooltip>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > listQuery.limit"
      layout="prev, pager, next"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import request from '@/utils/request'

export default {
  name: 'UploadLaborTimeList',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      storage: process.env.VUE_APP_BACKEND_HOST + '/storage/',
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      dialogFormVisible: false,
      rowData: {
        laborTimeFiles_id: ''
      },
      activeRow: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    localeDate(vdate) {
      return (
        new Date(vdate).toLocaleDateString() +
        ' ' +
        new Date(vdate).toLocaleTimeString()
      )
    },
    statusFilter(status) {
      const statusMap = {
        load_file: 'info',
        error_structure: 'danger',
        error_code: 'danger',
        error_field: 'danger',
        manual_processing: 'warning',
        executed: 'success'
      }
      return statusMap[status]
    },
    getStatus(status) {
      switch (status) {
        case 'load_file':
          return 'Файл загружен. Идёт обработка'
        case 'manual_processing':
          return 'Требуется обработка ошибок'
        case 'error_structure':
          return 'Ошибка в структуре файла'
        case 'error_code':
          return 'Невалидный код НЧ'
        case 'error_field':
          return 'Ошибка группы модификаций'
        case 'executed':
          return 'Файл успешно загружен'

        default:
          return status
      }
    },
    async getList() {
      this.listLoading = true
      const res = await request({
        url: '/labor_times_files',
        method: 'get',
        params: {
          page: this.listQuery.page,
          sortByUpdate: 'DESC'
        }
      })
      this.list = res.data
      this.total = res.total
      this.listQuery.page = res.current_page
      this.listQuery.limit = res.per_page
      this.listLoading = false
    },
    async deleteRow(index, row) {
      const res = await request({
        url: '/labor_times_files/' + row.laborTimeFiles_id,
        method: 'delete'
      })
      if (res) {
        this.$notify({
          title: 'Успешно!',
          message: 'Данные успешно удалены',
          type: 'success',
          duration: 5000
        })
        this.list.splice(index, 1)
      }
    }
  }
}
</script>

<style>
.edit-input {
  padding-right: 100px;
}
/*иконка Скачать*/
/* svg:not(:root) {
  overflow: hidden;
  width: 16px;
  height: 16px;
  fill: grey;
} */
.labortime_upload_list .el-table--border td:first-child .cell {
  padding-left: 0;
}
.cell:nth-child(1) .el-link {
  padding: 0 5px;
}
.fixed-center {
  margin-top: auto;
  margin-bottom: auto;
}
</style>
