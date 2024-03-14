<template>
  <dialog-f
    title="Редактор"
    :show-dialog="open"
    @update:showDialog="closeDialog"
    @closeDialog="closeDialog"
    @saveData="saveModalData()"
  >
    <el-form
      ref="flowchartName"
      :rules="rules"
      :model="data"
      label-position="top"
      label-width="200px"
    >
      <el-form-item label="Название тех.карты">
        <el-input
          v-model="data.flowChart_name"
          autocomplete="off"
          minlength="3"
          :disabled="role_name == 'translator'"
        />
      </el-form-item>
      <el-form-item label="Название тех.карты (EN)">
        <el-input
          v-model="data.flowChart_name_en"
          autocomplete="off"
          minlength="3"
        />
      </el-form-item>
      <el-form-item label="Название тех.карты (ES)">
        <el-input
          v-model="data.flowChart_name_es"
          autocomplete="off"
          minlength="3"
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
  name: 'HeaderDialog',
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
      rules: {},
      formData: {}
    }
  },
  computed: {
    ...mapGetters(['role_name'])
  },
  methods: {
    closeDialog() {
      if (this.$refs['flowchartName']) {
        this.$refs['flowchartName'].clearValidate()
      }
      this.$emit('update:open', false)
    },
    saveModalData() {
      this.$refs['flowchartName'].validate(async (valid) => {
        if (valid) {
          const res = await request({
            url: '/flowchart/' + this.data.flowChart_id,
            method: 'put',
            data: {
              flowChart_id: this.data.flowChart_id,
              flowChart_name: this.data.flowChart_name,
              flowChart_name_en: this.data.flowChart_name_en
            }
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
        }
        this.closeDialog()
      })
    }
  }
}
</script>
