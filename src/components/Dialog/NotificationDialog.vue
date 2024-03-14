<template>
  <dialog-f
    title="Редактор уведомлений и предупреждений"
    :show-dialog="open"
    @update:showDialog="closeDialog"
    @closeDialog="closeDialog"
    @saveData="saveModalData()"
  >
    <el-form
      ref="notificationForm"
      :rules="rules"
      :model="data"
      label-position="left"
      label-width="180px"
    >
      <el-form-item label="Тип уведомления" prop="isWarning">
        <el-select
          v-model="data.isWarning"
          placeholder="Выберите тип уведомления"
          :disabled="role_name == 'translator'"
          clearable
          :default="true"
          @change="handleRadio()"
        >
          <el-option
            v-for="item in typeNotificationOptions"
            :key="item.isWarning"
            :label="item.label"
            :value="item.isWarning"
          >
            {{ item.label }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="role_name !== 'translator'"
        label="Иконка"
        prop="notification_icon"
      >
        <el-row style="height: 30px">
          <el-radio-group v-model="data.notification_icon" size="mini">
            <el-radio v-if="!data.isWarning" label="warning">
              <span
                class="glyphicon glyphicon-warning-sign notification__icon"
                style="color: #ffa500"
              />
            </el-radio>
            <el-radio v-if="!data.isWarning" label="single">
              <svg-icon
                icon-class="notification-delete-icon"
                class="notification__icon"
              />
            </el-radio>
            <el-radio v-if="data.isWarning" label="error">
              <span
                class="glyphicon glyphicon-warning-sign notification__icon"
                style="color: #d8000c"
              />
            </el-radio>
            <el-radio v-if="data.isWarning" label="trash">
              <span
                class="glyphicon glyphicon-trash notification__icon"
                style="color: #000"
              />
            </el-radio>
          </el-radio-group>
        </el-row>
      </el-form-item>
      <el-form-item label="Текст уведомления" prop="notification_text">
        <el-input
          v-model="data.notification_text"
          type="textarea"
          autosize
          autocomplete="off"
          :disabled="role_name == 'translator'"
        />
      </el-form-item>
      <el-form-item
        v-if="role_name == 'translator'"
        label="Текст уведомления (EN)"
        prop="notification_text_en"
      >
        <el-input
          v-model="data.notification_text_en"
          type="textarea"
          autosize
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        v-if="role_name == 'translator'"
        label="Текст уведомления (ES)"
        prop="notification_text_es"
      >
        <el-input
          v-model="data.notification_text_es"
          type="textarea"
          autosize
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
  </dialog-f>
</template>

<script>
import { mapGetters } from 'vuex'
import DialogF from '@/components/Dialog/DialogF'
import request from '@/utils/request'

export default {
  name: 'NotificationDialog',
  components: { DialogF },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  emits: ['update:open', 'update:data', 'saveData'],
  data() {
    return {
      typeNotificationOptions: [
        {
          isWarning: false,
          label: 'Уведомление'
        },
        {
          isWarning: true,
          label: 'Предупреждение'
        }
      ],
      rules: {
        isWarning: [
          { required: true, message: 'Выберите элемент из выпадающего списка' }
        ],
        notification_icon: [{ required: true, message: 'Выберите иконку' }],
        notification_text: [
          { required: true, message: 'Заполните поле', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['role_name'])
  },
  methods: {
    handleRadio() {
      this.data.notification_icon = null
    },
    closeDialog() {
      if (this.$refs['notificationForm']) {
        this.$refs['notificationForm'].clearValidate()
      }
      this.$refs['notificationForm'].resetFields()
      this.$emit('update:open', false)
    },
    saveModalData() {
      this.$refs['notificationForm'].validate(async (valid) => {
        if (valid) {
          if (this.data.notification_id) {
            const res = await request({
              url: '/notifications/' + this.data.notification_id,
              method: 'put',
              data: this.data
            })
            if (res) {
              this.$notify({
                title: 'Успешно!',
                message: 'Данные успешно сохранены',
                type: 'success',
                duration: 5000
              })
              this.$emit('saveData', 'update')
              this.$emit('update:data', this.data)
              this.$emit('update:open', false)
            }
          } else {
            const res = await request({
              url: '/notifications',
              method: 'post',
              data: this.data
            })
            if (res) {
              this.$notify({
                title: 'Успешно!',
                message: 'Данные успешно добавлены',
                type: 'success',
                duration: 5000
              })
              this.$emit('saveData', 'create', res)
            }
          }
          this.closeDialog()
        }
      })
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
</style>
