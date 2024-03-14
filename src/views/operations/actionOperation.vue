<template>
  <div class="editOperation_edit_card sticky_edit">
    <div class="box">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <p class="title">Редактирование операции</p>
          </div>
        </template>
        <div class="df jcfe mb10">
          <el-button
            v-show="role_name != 'translator'"
            size="medium"
            type="primary"
            @click="isActionOpen = true"
          >
            Добавить
          </el-button>
        </div>

        <el-form
          ref="operationEditForm"
          class="box_form"
          :model="formData"
          :rules="rules"
          label-width="250px"
          @submit="saveActionData"
        >
          <el-form-item label="Типовое действие" prop="action_name">
            <el-autocomplete
              v-model="formData.action_name"
              placeholder="Выберите типовое действие"
              :fetch-suggestions="querySearchAction"
              suffix-icon="el-icon-arrow-down"
              value-key="action_name"
              :disabled="role_name == 'translator'"
              clearable
              @select="handleSelect"
            />
          </el-form-item>
          <!-- Момент затяжки -->
          <el-form-item
            v-if="isTorque"
            label="Момент затяжки"
            prop="operation_torque"
          >
            <el-input
              v-model="formData.operation_torque"
              autocomplete="off"
              minlength="3"
              clearable
              :disabled="role_name == 'translator'"
            />
          </el-form-item>
          <!-- Зазор -->
          <el-form-item
            v-if="isClearances"
            label="Зазор"
            prop="operation_clearances"
          >
            <el-input
              v-model="formData.operation_clearances"
              autocomplete="off"
              minlength="3"
              clearable
              :disabled="role_name == 'translator'"
            />
          </el-form-item>
          <!-- Введите расширение действий -->
          <el-form-item label="Введите расширение действий" prop="action_ext">
            <el-input
              v-model="formData.action_ext"
              autocomplete="off"
              minlength="3"
              clearable
              :disabled="role_name == 'translator'"
            />
          </el-form-item>
          <!-- Дополнительная информация -->
          <el-form-item
            label="Дополнительная информация"
            prop="operation_description"
          >
            <el-input
              v-model="formData.operation_description"
              type="textarea"
              autosize
              autocomplete="off"
              :disabled="role_name == 'translator'"
            />
          </el-form-item>
          <!-- Нормо-часы -->
          <el-form-item label="Н/ч" prop="operation_time">
            <el-input
              v-model="formData.operation_time"
              autocomplete="off"
              minlength="3"
              clearable
              :disabled="role_name == 'translator'"
            />
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <action-dialog
      :open.sync="isActionOpen"
      :data.sync="actionData"
      @saveData="getAddedOperation"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/request'
import { html2Text } from '@/utils'
import ActionDialog from '@/components/Dialog/ActionDialog'
// import notifyOperation from '@/views/operations/notifyOperation'
// import toolOperation from '@/views/operations/toolOperation'
// import illustrateOperation from '@/views/operations/illustrateOperation'
// import PanelButton from '@/components/PanelButton/PanelButton'

export default {
  components: {
    ActionDialog
    // notifyOperation,
    // toolOperation,
    // illustrateOperation,
    // PanelButton
  },
  props: {
    value: { type: Object, default: () => {} }
  },
  data() {
    var validateSelect = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('Заполните поле'))
      } else if (this.formData.action_id) {
        callback()
      } else if (this.selected.action_id === undefined) {
        return callback('Выберите элемент из выпадающего списка')
      }
      return callback()
    }
    return {
      showButtons: [
        {
          label: 'Сохранить и продолжить',
          color: 'orange',
          emit: 'clickBtnSaveContinue'
        },
        { label: 'Сохранить', emit: 'clickBtnSave' },
        { label: 'Отмена', color: 'grey', emit: 'clickBtnСancel' }
      ],
      id: Number(this.$route.params?.id),
      rules: {
        action_name: [
          {
            validator: validateSelect,
            required: true,
            message: 'Выберите название элемента из выпадающего списка',
            trigger: 'change'
          }
        ],
        action_ext: [
          { required: true, message: 'Заполните поле', trigger: 'blur' }
        ]
      },
      formData: {
        action_id: '',
        action_name: '',
        action_ext: '',
        operation_description: '',
        operation_torque: '',
        operation_clearances: '',
        operation_time: 0
      },
      isTorque: true,
      isClearances: true,
      isActionOpen: false,
      actionData: {},
      selected: {},
      notificationData: [],
      toolData: [],
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['role_name', 'operation_action']),
    operation_name() {
      return this.formData.action_name + ' ' + this.formData.action_ext
    }
  },
  watch: {
    formData: {
      deep: true,
      handler(v) {
        this.$emit('input', v)
      }
    }
  },
  mounted() {
    if (this.id) {
      this.getInfo(this.id)
    }
    if (this.operation_action.action_name) {
      this.formData = this.operation_action
      // this.formData.action_ext = this.operation_action.action_ext
    }
  },
  methods: {
    async getInfo(id) {
      this.isLoading = false
      const res = await request({
        url: '/operations/' + id,
        method: 'get'
      })
      this.formData = res
      this.notificationData = res.notification
      this.isLoading = true
    },
    async querySearchAction(filter, cb) {
      const res = await request({
        url: '/actions',
        method: 'get',
        params: {
          action_name: html2Text(filter)
        }
      })
      cb(res.data)
    },
    // TODO оптимизировать
    getAddedOperation(method, el) {
      this.formData = el
      this.isTorque = el.action_isTorque
      this.isClearances = el.action_isClearances
      this.selected = el
    },
    handleSelect(v) {
      this.selected = v
      this.isTorque = v.action_isTorque
      this.isClearances = v.action_isClearances
      this.formData.action_id = v.action_id
    },
    saveActionData(type, res) {
      this.formData.action_name = res.action_name
    }
  }
}
</script>
<style scoped></style>
