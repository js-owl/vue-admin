<template>
  <dialog-f
    title="Редактор общего инструмента"
    width="70%"
    :show-dialog="open"
    @update:showDialog="closeDialog"
    @closeDialog="closeDialog"
    @saveData="saveModalData()"
  >
    <el-form
      ref="generalToolForm"
      :rules="rules"
      :model="data"
      label-position="left"
      label-width="230px"
    >
      <el-form-item label="Название инструмента" prop="tool_name">
        <el-input
          v-model="data.tool_name"
          autocomplete="off"
          :disabled="role_name == 'translator'"
        />
      </el-form-item>
      <el-form-item
        v-if="role_name == 'translator'"
        label="Название инструмента (EN)"
        prop="tool_name_en"
      >
        <el-input v-model="data.tool_name_en" autocomplete="off" />
      </el-form-item>
      <el-form-item
        v-if="role_name == 'translator'"
        label="Название инструмента (ES)"
        prop="tool_name_es"
      >
        <el-input v-model="data.tool_name_es" autocomplete="off" />
      </el-form-item>
    </el-form>
  </dialog-f>
</template>
<script>
import { mapGetters } from 'vuex'
import request from '@/utils/request'
import DialogF from '@/components/Dialog/DialogF'
// import UploadImage from '@/components/Upload/UploadImage'
export default {
  name: 'GeneralAddDialog',
  // components: { DialogF, UploadImage },
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
        tool_name: [
          { required: true, message: 'Заполните поле', trigger: 'blur' }
        ]
      },
      formData: {
        tool_name: '',
        toolType_id: 4
      }
    }
  },
  computed: {
    ...mapGetters(['role_name'])
  },
  methods: {
    closeDialog() {
      if (this.$refs['generalToolForm']) {
        this.$refs['generalToolForm'].clearValidate()
      }
      this.$emit('update:open', false)
    },
    saveModalData() {
      this.$refs['generalToolForm'].validate(async (valid) => {
        if (valid) {
          if (this.data.tool_id) {
            const res = await request({
              url: '/tools/' + this.data.tool_id,
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
              this.data.tool_image = res.tool_image
              Object.assign(this.data.tool_id, this.data)
              this.$emit('saveData', 'update')
              this.$emit('update:data', this.data)
              this.$emit('update:open', false)
            }
          } else {
            const res = await request({
              url: '/tools',
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
        }
      })
    }
  }
}
</script>
