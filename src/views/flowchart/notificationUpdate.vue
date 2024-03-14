<template>
  <el-form
    ref="refNotification"
    v-loading="loadingSubmitForm"
    :model="formNotification"
    :rules="rules"
    label-position="top"
    label-width="200px"
    @submit="saveData()"
  >
    <el-form-item label="Название элемента" prop="notification_text">
      <el-row :gutter="24" style="margin-bottom: 10px">
        <el-autocomplete
          v-model="formNotification.notification_text"
          placeholder="Введите название"
          :fetch-suggestions="getNotifications"
          value-key="notification_text"
          style="width: 100%; padding: 0 10px"
          @select="handleSelectAutocomplete"
        >
          <template #default="{ item }">
            {{ item.notification_text }}
          </template>
        </el-autocomplete>
      </el-row>
    </el-form-item>
  </el-form>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'NotificationUpdate',
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  emits: ['input'],
  data() {
    return {
      loadingSubmitForm: false,
      rules: {
        notification_text: [
          { required: true, message: 'Заполните поле', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    formNotification: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    async getNotifications(filter, cb) {
      const res = await request({
        url: '/notifications/',
        method: 'get',
        params: { filter: filter }
      })
      cb(res.data)
    },
    handleSelectAutocomplete(v) {
      this.$refs['refNotification'].clearValidate()
      // this.$emit('notificationUpdate', v)
    },
    closeDialog() {
      if (this.$refs['refNotification']) {
        this.$refs['refNotification'].clearValidate()
      }
      this.$emit('update:open', false)
    },
    async saveData() {
      if (this.$refs['refNotification']) {
        this.$refs['refNotification'].clearValidate()
      }
      this.$refs['refNotification'].validate(async (valid) => {
        console.log(valid)
        this.loadingSubmitForm = true
        if (valid) {
          const params = Object.assign({}, this.formNotification)
          params.flowChartItem_name = this.formNotification.notification_text
          params.flowChartItemType_id = '4'

          if (this.formNotification.flowChartItem_id) {
            // this.formNotification.flowChartItem_name = Object.assign({}, data)
            params.isActive = true
            const res = await request({
              url: '/flowchartitem/' + params.flowChartItem_id,
              method: 'put',
              data: params
            })
            if (res) {
              this.$notify({
                title: 'Успешно!',
                message: 'Данные успешно сохранены',
                type: 'success',
                duration: 5000
              })
              this.$emit('notificationUpdate', res)
              this.$emit('saveData', 'update', res)
              this.$emit('update:open', false)
              this.modeOperation === ''
            } else {
              console.log('PUT request error')
            }
          }
          this.closeDialog()
        } else {
          console.log('error submit!!')
        }
        this.loadingSubmitForm = false
      })
    }
  }
}
</script>
