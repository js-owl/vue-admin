<template>
  <div>
    <div class="box">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <p class="title">
              Уведомления / предупреждения, соответствующее операции
            </p>
          </div>
        </template>
        <div class="df jcfe mb10">
          <el-button
            v-if="role_name != 'translator'"
            size="medium"
            type="primary"
            @click="isOpen = true"
          >
            {{ selectedNotifications.length ? 'Изменить' : 'Добавить' }}
          </el-button>
        </div>
        <el-table
          :data="selectedNotifications"
          border
          fit
          highlight-current-row
          class="break_word fixed-width"
          style="width: 100%"
        >
          <el-table-column label="Тип" width="150">
            <template #default="scope">
              {{
                scope.row.notification_icon == 'warning'
                  ? 'Предупреждение'
                  : 'Уведомление'
              }}
            </template>
          </el-table-column>
          <el-table-column prop="notification_text" label="Уведомления/предупреждения" />
          <el-table-column
            class-name="action-center"
            fixed="right"
            label="Действие"
            width="104"
            align="center"
          >
            <template #default="scope">
              <el-tooltip
                v-if="role_name != 'translator'"
                class="box-item"
                effect="light"
                placement="top-start"
                content="Удалить"
                popper-class="uaz__tooltip uaz__tooltip-left"
              >
                <el-button
                  link
                  size="mini"
                  class="el-button-icon danger"
                  @click.prevent="deleteRow(scope.$index, scope.row)"
                >
                  <i class="el-icon-delete" />
                </el-button>
              </el-tooltip>
              <el-tooltip
                v-if="role_name == 'translator'"
                class="box-item"
                effect="light"
                placement="top-start"
                content="Редактировать"
                popper-class="uaz__tooltip uaz__tooltip-left"
              >
                <el-button
                  link
                  size="mini"
                  class="el-button-icon"
                  @click.prevent="showModalEditElement(scope.$index, scope.row)"
                >
                  <i class="el-icon-edit" />
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <select-notification-dialog
      v-if="isOpen"
      v-model="selectedNotifications"
      :open.sync="isOpen"
    />
    <notification-dialog
      :open.sync="dialogFormVisible"
      :data.sync="tempData"
      @saveData="saveModalData"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import selectNotificationDialog from '@/views/operations/selectNotificationDialog'
import NotificationDialog from '@/components/Dialog/NotificationDialog'

export default {
  components: { selectNotificationDialog, NotificationDialog },
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      selectedNotifications: [],
      isOpen: false,
      activeRow: null,
      dialogFormVisible: false,
      tempData: {
        isActive: 1,
        isWarning: 0,
        notification_icon: 'warning',
        notification_text: '',
        notification_text_en: '',
        notification_text_es: ''
      }
    }
  },
  computed: {
    ...mapGetters(['role_name'])
  },
  watch: {
    selectedNotifications(v) {
      this.$emit('input', v)
    },
    value(v) {
      this.selectedNotifications = v
    }
  },

  mounted() {
    this.selectedNotifications = [...this.selectedNotifications, ...this.value]
  },
  methods: {
    showModalEditElement(index, row) {
      this.activeRow = row
      Object.assign(this.tempData, row)
      this.dialogFormVisible = !this.dialogFormVisible
    },
    saveModalData($type) {
      if ($type === 'update') {
        Object.assign(this.activeRow, this.tempData)
      }
    },
    deleteRow(idx, row) {
      this.selectedNotifications = this.selectedNotifications.filter(
        (x) => x !== row
      )
    }
  }
}
</script>
<style scoped></style>
