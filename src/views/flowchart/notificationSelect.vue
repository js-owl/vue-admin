<template>
  <div class="operationSelect">
    <el-row :gutter="24" style="margin-bottom: 10px">
      <el-col :span="12">
        <el-input
          v-model="searchFilter"
          placeholder="Введите название"
          clearable
          @input="getNotifications"
        />
      </el-col>
      <el-col :span="12" style="padding-left: 0">
        <el-button type="primary" @click="isModalOpen = true">
          Добавить новое уведомление/ предупреждение
          <!-- {{ isWarningRu }}е -->
        </el-button>
      </el-col>
    </el-row>
    <el-row v-loading="loadingSubmit">
      <el-col :span="12">
        <el-table
          ref="refNotification"
          :data="notificationData"
          style="width: 100%"
          row-key="notification_id"
          class="operation_selection"
          @current-change="handleCurrentChange"
          @select="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="30"
            :reserve-selection="true"
          />
          <el-table-column label="Выберите элементы">
            <template #default="scope">
              {{ scope.row.notification_text }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <el-table
          ref="refNotificationSelected"
          :data="notificationsSelected"
          style="width: 100%"
          row-key="notification_id"
        >
          <el-table-column width="30">
            <template #default="scope">
              <el-tooltip
                class="box-item"
                effect="light"
                placement="top-start"
                content="Удалить"
                popper-class="uaz__tooltip uaz__tooltip-left"
              >
                <i
                  link
                  size="mini"
                  class="el-icon-close"
                  @click.prevent="deleteRow(scope.$index, scope.row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            :label="'Выбранные элементы (' + notificationsSelected.length + ')'"
          >
            <template #default="scope">
              {{ scope.row.notification_text }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <notification-dialog
      :open.sync="isModalOpen"
      :data.sync="modalData"
      @saveData="getNotificationName"
    />
  </div>
</template>

<script>
import request from '@/utils/request'
import NotificationDialog from '@/components/Dialog/NotificationDialog'

export default {
  name: 'NotificationSelect',
  components: { NotificationDialog },
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    isWarning: {
      type: Boolean,
      default: false
    },
    flowchartId: {
      type: Number,
      default: 0
    },
    position: {
      type: String,
      default: ''
    },
    parent: {
      type: Number,
      default: 0
    }
  },
  emits: ['input'],

  data() {
    return {
      notificationData: [],
      notificationsSelected: [],
      searchFilter: '',
      isModalOpen: false,
      modalData: {
        isActive: 1,
        isWarning: false,
        notification_icon: 'warning',
        notification_text: ''
      },
      loadingSubmit: false,
      notificationId: ''
    }
  },
  // computed: {
  //   isWarningRu() {
  //     if (this.isWarning) {
  //       return 'предпреждени'
  //     }
  //     return 'уведомлени'
  //   }
  // },
  // очистка формы при переходе на другую вкладку
  watch: {
    isWarning(newValue, oldValue) {
      this.clearTable()
      this.getNotifications()
      this.searchFilter = ''
    }
  },
  mounted() {
    this.getNotifications()
  },
  methods: {
    async getNotifications() {
      this.loadingSubmit = true
      const params = { filter: this.searchFilter }
      const res = await request({
        url: '/notifications',
        method: 'get',
        params: params
      })
      this.notificationData = res.data
      this.loadingSubmit = false
    },
    handleSelectionChange(v, row) {
      this.notificationsSelected = v
      this.$emit('input', v)
    },
    deleteRow(idx, row) {
      this.notificationsSelected = this.notificationsSelected.filter(
        (x) => x !== row
      )
      this.$refs['refNotification'].clearSelection()
      this.notificationData.forEach((row) => {
        this.notificationsSelected.forEach((sel) => {
          if (row === sel) {
            this.$refs['refNotification'].toggleRowSelection(row, undefined)
          }
        })
      })
    },
    clearTable() {
      this.$refs['refNotification'].clearSelection()
      this.notificationsSelected = []
      this.$refs['refNotificationSelected'].clearSelection()
    },
    async getNotificationName(method, v) {
      const name = v.notification_text
      this.notificationId = v.notification_id

      // this.searchFilter = name
      await this.getNotifications()

      this.notificationsSelected = [
        ...this.notificationsSelected,
        { notification_text: name }
      ]
      this.handleSelectionChange(this.notificationsSelected)

      this.notificationData.forEach((row) => {
        this.notificationsSelected.forEach((sel) => {
          if (row === sel) {
            this.$refs['refNotification'].toggleRowSelection(row, undefined)
          }
        })
      })
    },
    async saveData() {
      if (this.notificationsSelected.length === 0) {
        this.$notify({
          title: 'Предупреждение!',
          message: 'Выберите данные',
          type: 'warning',
          duration: 2000
        })
        return
      }
      this.loadingSubmit = true
      this.$emit('loading', true)
      const params = Object.assign({}, this.notificationsSelected)
      this.notificationsSelected.map((v, i) => {
        params[i].flowChart_id = this.flowchartId
        params[i].flowChartItemType_id = this.isWarning ? '7' : '4'
        params[i].notification_ref = v.notification_id
          ? v.notification_id
          : this.notificationId
        params[i].flowChartItem_name = v.notification_text
        params[i].flowChartItem_parent = this.parent
        params[i].position = this.position
      })
      const res = await request({
        url: '/flowchartitem',
        method: 'post',
        data: params
      })
      if (res) {
        this.$notify({
          title: 'Успешно!',
          message: 'Данные успешно добавлены',
          type: 'success',
          duration: 5000
        })
        this.$emit('handleItemEmitHeader', res)
        this.$emit('saveData', 'create', res)
        this.$emit('loading', false)
      }
      this.loadingSubmit = false
    },
    handleCurrentChange(v) {
      const cond = this.isInArray(v.notification_id, this.notificationsSelected)
      if (cond) {
        this.notificationsSelected = this.notificationsSelected.filter(
          (o) => v.notification_id !== o.notification_id
        )
      } else {
        this.notificationsSelected.push(v)
      }
      this.toggleSelection()
    },
    isInArray(id, arr) {
      if (arr.some((e) => e.notification_id === id)) {
        return true
      }
      return false
    },
    toggleSelection() {
      this.$refs['refNotification'].clearSelection()
      this.notificationData.forEach((row) => {
        this.notificationsSelected.forEach((sel) => {
          if (row.notification_id === sel.notification_id) {
            this.$refs['refNotification'].toggleRowSelection(row, undefined)
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.el-icon-close {
  color: #7ea09a;
  cursor: pointer;
  font-weight: bolder;
}
</style>
