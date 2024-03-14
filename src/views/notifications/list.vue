<template>
  <div class="app-container first_icon">
    <filterSelect
      v-model="currentFilter"
      show-search
      search-placeholder="Наименование"
      @SearchOnFilter="getList"
    />
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="" width="30">
        <template #default="scope">
          <span
            v-if="
              !scope.row.isWarning && scope.row.notification_icon === 'warning'
            "
            class="glyphicon glyphicon-warning-sign notification__icon"
            style="color: #ffa500"
          />
          <svg-icon
            v-if="
              !scope.row.isWarning && scope.row.notification_icon === 'single'
            "
            icon-class="notification-delete-icon"
            class="notification__icon"
          />
          <span
            v-if="
              scope.row.isWarning && scope.row.notification_icon === 'error'
            "
            class="glyphicon glyphicon-warning-sign notification__icon"
            style="color: #d8000c"
          />
          <span
            v-if="
              scope.row.isWarning && scope.row.notification_icon === 'trash'
            "
            class="glyphicon glyphicon-trash notification__icon"
            style="color: #000"
          />
        </template>
      </el-table-column>
      <el-table-column label="Уведомление">
        <template #default="scope">
          {{ scope.row.notification_text }}
        </template>
      </el-table-column>
      <el-table-column label="Тип" width="140">
        <template #default="scope">
          <span v-if="scope.row.isWarning"> Предупреждение </span>
          <span v-else> Уведомление </span>
        </template>
      </el-table-column>
      <el-table-column
        align="right"
        width="90"
        class-name="mini-padding fixed-width button-tooltip"
      >
        <template #header>
          <el-button
            v-if="role_name != 'translator'"
            size="mini"
            type="primary"
            @click="$addRow('activeRow', 'modalData', 'isModalOpen')"
          >
            Добавить
          </el-button>
        </template>
        <template #default="scope">
          <el-tooltip
            class="box-item"
            effect="light"
            placement="top-start"
            content="Редактировать"
            popper-class="uaz__tooltip uaz__tooltip-left"
          >
            <el-button
              size="mini"
              class="el-button-icon"
              @click="editRow(scope.$index, scope.row)"
            >
              <i class="el-icon-edit" />
            </el-button>
          </el-tooltip>

          <el-popconfirm
            v-if="role_name != 'translator'"
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
    <notification-dialog
      :open.sync="isModalOpen"
      :data.sync="modalData"
      @saveData="saveModalData"
    />
    <pagination
      v-show="total > 0"
      layout="prev, pager, next"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import request from '@/utils/request'
import NotificationDialog from '@/components/Dialog/NotificationDialog'
import filterSelect from '@/components/Header/filter'

export default {
  name: 'NotificationsList',
  components: { Pagination, NotificationDialog, filterSelect },
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
      isModalOpen: false,
      currentFilter: {
        filter: ''
      },
      modalData: {
        isActive: 1,
        isWarning: 0,
        notification_icon: 'warning',
        notification_text: '',
        notification_text_en: '',
        notification_text_es: ''
      },
      activeRow: null
    }
  },
  computed: {
    ...mapGetters(['role_name'])
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const params = {
        page: this.listQuery.page
      }
      if (this.currentFilter.filter) {
        params.filter = this.currentFilter.filter
      }
      const res = await request({
        url: '/notifications',
        method: 'get',
        params
      })
      this.list = res.data
      this.total = res.total
      this.listQuery.page = res.current_page
      this.listQuery.limit = res.per_page
      this.listLoading = false
    },
    // addRow() {
    //   this.activeRow = null
    //   this.modalData = {}
    //   this.isModalOpen = true
    // },
    editRow(index, row) {
      this.activeRow = row
      Object.assign(this.modalData, row)
      this.isModalOpen = true
    },
    async deleteRow(index, row) {
      const res = await request({
        url: '/notifications/' + row.notification_id,
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
    },
    saveModalData($type) {
      if ($type === 'update') {
        Object.assign(this.activeRow, this.modalData)
      }
      if ($type === 'create') {
        this.getList()
      }
    }
  }
}
</script>

<style>
.notification__icon {
  width: 20px;
  height: 17px;
  font-size: 15px;
}
/*шапка*/
.app-container .el-dialog__header {
  height: 60px;
  background-color: #cfdbd9;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  text-transform: uppercase;
  color: #003d2d;
}
.first_icon .el-table--border td:first-child .cell {
  padding-left: 6px;
}
.el-table .cell {
  word-break: break-word;
}
</style>
