<template>
  <dialog-f
    title="Редактор специнструментов"
    width="70%"
    :show-dialog="open"
    @update:showDialog="closeDialog"
    @closeDialog="closeDialog"
    @saveData="saveModalData()"
  >
    <el-form
      ref="specialToolForm"
      :rules="rules"
      :model="data"
      label-position="left"
      label-width="220px"
    >
      <el-row :gutter="20">
        <el-col :span="18">
          <el-form-item label="Номер специнструмента:" prop="tool_code">
            <el-input
              v-model="data.tool_code"
              autocomplete="off"
              :disabled="role_name == 'translator'"
            />
          </el-form-item>
          <el-form-item label="Название:" prop="tool_name">
            <el-input
              v-model="data.tool_name"
              autocomplete="off"
              :disabled="role_name == 'translator'"
            />
          </el-form-item>
          <el-form-item
            v-if="role_name == 'translator'"
            label="Название (EN):"
            prop="tool_name_en"
          >
            <el-input v-model="data.tool_name_en" autocomplete="off" />
          </el-form-item>
          <el-form-item
            v-if="role_name == 'translator'"
            label="Название (ES):"
            prop="tool_name_es"
          >
            <el-input v-model="data.tool_name_es" autocomplete="off" />
          </el-form-item>
          <el-form-item label="Комментарии:">
            <el-input
              v-model="data.tool_comment"
              type="textarea"
              autosize
              autocomplete="off"
              :disabled="role_name == 'translator'"
            />
          </el-form-item>
          <el-form-item
            v-if="role_name == 'translator'"
            label="Комментарии (EN):"
          >
            <el-input
              v-model="data.tool_comment_en"
              type="textarea"
              autosize
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            v-if="role_name === 'translator'"
            label="Комментарии (ES):"
          >
            <el-input
              v-model="data.tool_comment_es"
              type="textarea"
              autosize
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
  name: 'SpecialAddDialog',
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
        ],
        tool_code: [
          { required: true, message: 'Заполните поле', trigger: 'blur' }
        ]
      },
      formData: {
        tool_name: '',
        tool_image: '',
        tool_code: '',
        tool_comment: '',
        toolType_id: 1
      }
    }
  },
  computed: {
    ...mapGetters(['role_name'])
  },
  methods: {
    closeDialog() {
      if (this.$refs['specialToolForm']) {
        this.$refs['specialToolForm'].clearValidate()
      }
      this.$emit('update:open', false)
    },
    saveModalData() {
      this.$refs['specialToolForm'].validate(async (valid) => {
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
