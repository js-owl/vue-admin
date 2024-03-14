<template>
  <dialog-f
    title="Редактор должности"
    :show-dialog="open"
    @update:showDialog="closeDialog"
    @closeDialog="closeDialog"
    @saveData="saveModalData()"
  >
    <el-form
      ref="positionForm"
      :rules="rules"
      :model="data"
      label-position="left"
      label-width="160px"
    >
      <el-form-item label="Должность" prop="position_name">
        <el-input v-model="data.position_name" autocomplete="off" minlength="3" />
      </el-form-item>
      <el-form-item label="CRM ID" prop="positionCRM_id">
        <el-input v-model="data.positionCRM_id" autocomplete="off" minlength="3" />
      </el-form-item>
    </el-form>
  </dialog-f>
</template>

<script>
import DialogF from '@/components/Dialog/DialogF'
import request from '@/utils/request'

export default {
  name: 'PositionDialog',
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
        position_name: [
          { required: true, message: 'Заполните поле', trigger: 'blur' }
        ],
        positionCRM_id: [
          { required: true, message: 'Заполните поле', trigger: 'blur' }
        ]
      },
      formData: {
        position_name: '',
        positionCRM_id: ''
      }
    }
  },
  methods: {
    closeDialog() {
      if (this.$refs['positionForm']) {
        this.$refs['positionForm'].clearValidate()
      }
      this.$emit('update:open', false)
    },
    saveModalData() {
      this.$refs['positionForm'].validate(async valid => {
        if (valid) {
          console.log('not error submit!!')
          if (this.data.position_id) {
            const res = await request({
              url: '/position/' + this.data.position_id,
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
              url: '/position',
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
              this.$emit('saveData', 'create')
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
