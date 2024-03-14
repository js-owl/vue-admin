<template>
  <dialog-f
    width="30%"
    title="Редактор размеров холста"
    :show-dialog="open"
    @update:showDialog="closeDialog"
    @closeDialog="closeDialog"
    @saveData="saveModalData()"
  >
    <el-form
      ref="dimForm"
      :model="data"
      :rules="rules"
      label-position="left"
      label-width="120px"
    >
      <el-form-item label="Ширина:" prop="width">
        <el-input v-model="data.width" autocomplete="off" minlength="3" />
      </el-form-item>
      <el-form-item label="Высота:" prop="height">
        <el-input v-model="data.height" autocomplete="off" minlength="3" />
      </el-form-item>
    </el-form>
  </dialog-f>
</template>

<script>
import DialogF from '@/components/Dialog/DialogF'

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
        return {}
      }
    }
  },
  data() {
    return {
      rules: {
        height: [
          { required: true, message: 'Заполните поле', trigger: 'change' }
        ],
        width: [
          { required: true, message: 'Заполните поле', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    saveModalData() {
      this.$refs['dimForm'].validate(async (valid) => {
        if (valid) {
          // this.$emit('update:data', this.data)
          this.$emit('saveData', this.data)
          this.closeDialog()
        }
      })
    },
    closeDialog() {
      if (this.$refs['dimForm']) {
        this.$refs['dimForm'].clearValidate()
      }
      this.$emit('update:open', false)
    }
  }
}
</script>
