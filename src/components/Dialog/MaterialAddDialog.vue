<template>
  <dialog-f
    title="Редактор материала"
    width="70%"
    :show-dialog="open"
    @update:showDialog="closeDialog"
    @closeDialog="closeDialog"
    @saveData="saveModalData()"
  >
    <el-form
      ref="materialForm"
      :rules="rules"
      :model="data"
      label-position="left"
      label-width="200px"
    >
      <el-row :gutter="20">
        <el-col :span="18">
          <el-form-item label="Название материала" prop="tool_name">
            <el-input
              v-model="data.tool_name"
              type="textarea"
              autocomplete="off"
              :disabled="role_name == 'translator'"
            />
          </el-form-item>
          <el-form-item
            v-if="role_name == 'translator'"
            label="Название материала (EN)"
            prop="tool_name"
          >
            <el-input
              v-model="data.tool_name_en"
              type="textarea"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            v-if="role_name == 'translator'"
            label="Название материала (ES)"
            prop="tool_name"
          >
            <el-input
              v-model="data.tool_name_es"
              type="textarea"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <upload-image
            v-if="role_name !== 'translator'"
            :value="data.tool_image"
            @changeImage="changeImage"
          />
        </el-col>
      </el-row>
    </el-form>
  </dialog-f>
</template>
<script>
import { mapGetters } from 'vuex'
import request from '@/utils/request'
import DialogF from '@/components/Dialog/DialogF'
import UploadImage from '@/components/Upload/UploadImage'
export default {
  name: 'MaterialAddDialog',
  components: { DialogF, UploadImage },
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
        tool_image: '',
        toolType_id: 3
      }
    }
  },
  computed: {
    ...mapGetters(['role_name'])
  },
  methods: {
    closeDialog() {
      if (this.$refs['materialForm']) {
        this.$refs['materialForm'].clearValidate()
      }
      this.$emit('update:open', false)
    },
    saveModalData() {
      this.$refs['materialForm'].validate(async (valid) => {
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
    },
    changeImage(value) {
      console.log('parent', value)
      this.data.tool_image = value
    }
  }
}
</script>
