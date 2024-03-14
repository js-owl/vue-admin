<template>
  <div class="container">
    <dialog-f
      class="notifyOperation_dialog_add"
      title="Уведомление/предупреждение"
      :show-dialog="open"
      width="70%"
      @update:showDialog="closeDialog"
      @open="handleOpen"
      @closeDialog="closeDialog"
      @saveData="closeDialog"
    >
      <div class="select_notification_dialog">
        <el-select
          v-model="isWarning"
          class="select_notification_dialog_flex"
          placeholder="Select"
          @change="searchList"
        >
          <el-option
            v-for="item in typeNotificationOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button
          class="el_button_save_modal select_notification_dialog_flex"
          type="primary"
          @click="dialogFormVisible = true"
        >
          Добавить
        </el-button>
        <filterSelect
          v-model="currentFilter"
          class="select_notification_dialog_flex"
          show-search
          search-placeholder="Введите название"
          @SearchOnFilter="searchList"
        />
      </div>
      <el-table
        ref="notificationTable"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%"
        row-key="notification_id"
        @select="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="35"
          :reserve-selection="true"
        />
        <el-table-column prop="notification_text" label="Операции" />
      </el-table>
      <pagination
        v-show="total > 0"
        layout="prev, pager, next"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="handlePagination"
      />
      <!-- <el-button @click="toggleSelection">123124</el-button> -->
    </dialog-f>
    <!-- Add new notification item  -->
    <notification-dialog
      :open.sync="dialogFormVisible"
      :data.sync="tempData"
      @saveData="saveModalData"
    />
  </div>
</template>

<script>
import request from '@/utils/request'
import DialogF from '@/components/Dialog/DialogF'
import filterSelect from '@/components/Header/filter'
import Pagination from '@/components/Pagination'
import NotificationDialog from '@/components/Dialog/NotificationDialog'

export default {
  name: 'SelectNotificationDialog',
  components: { DialogF, NotificationDialog, Pagination, filterSelect },
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    open: { type: Boolean, default: false }
  },
  emits: ['update:open', 'update:data', 'saveData'],
  data() {
    return {
      dialogFormVisible: false,
      // getList
      list: [],
      total: 0,
      listQuery: { page: 1, limit: 20 },
      listLoading: true,

      typeNotificationOptions: [
        {
          value: false,
          label: 'Уведомление'
        },
        {
          value: true,
          label: 'Предупреждение'
        }
      ],
      formData: {
        isWarning: false,
        notification_icon: '',
        notification_text: ''
      },
      tempData: {
        isActive: 1,
        isWarning: 0,
        notification_icon: 'warning',
        notification_text: ''
      },
      isWarning: false,
      currentFilter: {
        filter: ''
      },
      selectedNotifications: []
    }
  },
  mounted() {
    this.selectedNotifications = [...this.selectedNotifications, ...this.value]
    this.getList().then(() => {
      this.toggleSelection()
    })
  },
  methods: {
    async getList() {
      this.listLoading = true
      const params = {
        page: this.listQuery.page,
        iswarning: this.isWarning
      }
      if (this.currentFilter.filter) {
        params.filter = this.currentFilter.filter
      }
      if (this.dealerId) {
        params.dealer_id = this.dealerId
      }
      const res = await request({
        url: '/notifications/',
        method: 'get',
        params
      })
      this.list = res.data
      this.total = res.total
      this.listQuery.page = res.current_page
      this.listQuery.limit = res.per_page
      this.listLoading = false
    },
    handleSelectionChange(v, row) {
      const cond = this.isInArray(
        row.notification_id,
        this.selectedNotifications
      )
      if (cond) {
        this.selectedNotifications = this.selectedNotifications.filter(
          (x) => x.notification_id !== row.notification_id
        )
      } else {
        this.selectedNotifications.push(row)
      }
      this.$emit('input', this.selectedNotifications)
      this.toggleSelection()
    },
    toggleSelection() {
      this.$refs['notificationTable'].clearSelection()
      this.list.forEach((row) => {
        this.selectedNotifications.forEach((sel) => {
          if (row.notification_id === sel.notification_id) {
            this.$refs['notificationTable'].toggleRowSelection(row, undefined)
          }
        })
      })
    },

    saveModalData(e) {
      console.log('saveModalData', e)
    },
    closeDialog() {
      this.$emit('update:open', false)
    },

    searchList() {
      this.listQuery.page = 1
      this.getList()
    },
    handleOpen() {},
    handlePagination() {
      this.getList().then(() => {
        this.toggleSelection()
      })
    },
    isInArray(id, arr) {
      if (arr.some((e) => e.notification_id === id)) {
        return true
      }
      return false
    }
  }
}
</script>

<style scoped>
.notification__icon {
  width: 30px;
  height: 30px;
  font-size: 25px;
}
.el-select--medium {
  width: 100%;
}
.select_notification_dialog {
  margin: 0;
  display: flex;
  align-items: flex-end;
}
.select_notification_dialog_flex {
  margin: 0 10px 10px 0;
}
.select_notification_dialog_flex:nth-child(3) {
  margin: 0 0 10px 0;
}
.select_notification_dialog .el-select--medium {
  width: 50%;
}
</style>
