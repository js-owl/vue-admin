<template>
  <dialog-f
    title="Редактор типовых действий"
    :show-dialog="open"
    @update:showDialog="closeDialog"
    @closeDialog="closeDialog"
    @saveData="saveModalData()"
  >
    <el-form
      ref="actionForm"
      :rules="rules"
      :model="data"
      label-position="left"
      label-width="120px"
    >
      <el-form-item label="Действие" prop="action_name">
        <el-input
          v-model="data.action_name"
          autocomplete="off"
          minlength="3"
          :disabled="role_name == 'translator'"
        />
      </el-form-item>
      <el-form-item
        v-if="role_name == 'translator'"
        label="Действие (EN)"
        prop="action_name_en"
      >
        <el-input
          v-model="data.action_name_en"
          autocomplete="off"
          minlength="3"
        />
      </el-form-item>
      <el-form-item
        v-if="role_name == 'translator'"
        label="Действие (ES)"
        prop="action_name_es"
      >
        <el-input
          v-model="data.action_name_es"
          autocomplete="off"
          minlength="3"
        />
      </el-form-item>
      <el-form-item v-if="role_name != 'translator'" label="">
        <el-checkbox v-model="data.action_isClearances">
          Необходимо указать зазор
        </el-checkbox>
      </el-form-item>
      <el-form-item v-if="role_name != 'translator'" label="">
        <el-checkbox v-model="data.action_isTorque">
          Необходимо указать момент затяжки
        </el-checkbox>
      </el-form-item>
    </el-form>
  </dialog-f>
</template>

<script>
import { mapGetters } from 'vuex'
import DialogF from '@/components/Dialog/DialogF'
import request from '@/utils/request'

export default {
  name: 'ActionDialog',
  components: { DialogF },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default() {
        return this.formData
      }
    }
  },
  emits: ['update:open', 'update:data', 'saveData'],
  data() {
    return {
      rules: {
        action_name: [
          { required: true, message: 'Заполните поле', trigger: 'blur' }
        ]
      },
      formData: {
        action_name: '',
        action_isClearances: false,
        action_isTorque: false
      }
    }
  },
  computed: {
    ...mapGetters(['role_name'])
  },
  methods: {
    closeDialog() {
      if (this.$refs['actionForm']) {
        this.$refs['actionForm'].clearValidate()
      }
      this.$emit('update:open', false)
    },
    saveModalData() {
      this.$refs['actionForm'].validate(async (valid) => {
        if (valid) {
          console.log('not error submit!!')
          if (this.data.action_id) {
            const res = await request({
              url: '/actions/' + this.data.action_id,
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
              url: '/actions',
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
        } else {
          console.log('error submit!!')
        }
      })
    }
  }
}
</script>
