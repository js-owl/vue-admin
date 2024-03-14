<template>
  <dialog-f
    title="Редактор таблицы"
    :show-dialog.sync="open"
    width="70%"
    @saveData="saveModalData()"
    @closeDialog="closeDialog"
    @update:showDialog="closeDialog"
  >
    <el-form
      ref="tablesForm"
      :rules="rules"
      :model="data"
      label-position="left"
      label-width="180px"
    >
      <el-form-item v-if="role_name !== 'translator'" label="Название таблицы:" prop="tables_name">
        <el-input
          v-model="data.tables_name"
          autocomplete="off"
          clearable
          :disabled="role_name == 'translator'"
        />
      </el-form-item>
      <el-form-item v-if="role_name !== 'translator'" label="Описание таблицы:" prop="tables_description">
        <ckeditor
          ref="ckeditorRef"
          v-model="data.tables_description"
          :editor="editor"
          :config="editorConfig"
          @blur="onEditorBlur"
        />
      </el-form-item>

      <el-tabs v-if="role_name == 'translator'" type="border-card">
        <el-tab-pane label="Русский">
          <el-form-item label="Название таблицы:" prop="tables_name">
            <el-input
              v-model="data.tables_name"
              autocomplete="off"
              clearable
              :disabled="role_name == 'translator'"
            />
          </el-form-item>
          <el-form-item label="Описание таблицы:" prop="tables_description">
            <ckeditor
              ref="ckeditorRef"
              v-model="data.tables_description"
              :editor="editor"
              :config="editorConfig"
              @blur="onEditorBlur"
            />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="English">
          <el-form-item label="Название таблицы:" prop="tables_name_en">
            <el-input v-model="data.tables_name_en" autocomplete="off" />
          </el-form-item>
          <el-form-item label="Описание таблицы:" prop="tables_description_en">
            <ckeditor
              ref="ckeditorRef"
              v-model="data.tables_description_en"
              :editor="editor"
              :config="editorConfig"
              @blur="onEditorBlur"
            />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="Espanol">
          <el-form-item label="Название таблицы:" prop="tables_name_es">
            <el-input v-model="data.tables_name_es" autocomplete="off" />
          </el-form-item>
          <el-form-item label="Описание таблицы:" prop="tables_description_es">
            <ckeditor
              ref="ckeditorRef"
              v-model="data.tables_description_es"
              :editor="editor"
              :config="editorConfig"
              @blur="onEditorBlur"
            />
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </dialog-f>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/request'
import DialogF from '@/components/Dialog/DialogF'
import CKEditor from '@ckeditor/ckeditor5-vue2'
import Editor from '../../../ckeditor5/build/ckeditor'

export default {
  name: 'TableDialog',
  components: { DialogF, ckeditor: CKEditor.component },
  props: {
    // TODO Ошибка в консоли: Prop being mutated: "open"
    open: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default() {
        return {
          tables_name: '',
          tables_description: ''
        }
      }
    }
  },
  emits: ['update:open', 'update:data', 'saveData'],
  data() {
    return {
      rules: {
        tables_name: [
          { required: true, message: 'Заполните поле', trigger: 'blur' }
        ],
        tables_description: [
          { required: true, message: 'Заполните поле', trigger: 'blur' }
        ]
      },
      editor: Editor, // ckEditor
      editorData: '<p>Content of the editor.</p>',
      editorConfig: {
        // The configuration of the editor.
      }
    }
  },
  computed: {
    ...mapGetters(['role_name'])
  },
  methods: {
    onEditorBlur() {
      // this.$refs['ckeditorRef'].validate((valid) => {
      //   console.log('valid')
      // })
    },
    saveModalData() {
      this.$refs['tablesForm'].validate(async (valid) => {
        if (valid) {
          if (this.data.tables_id) {
            const res = await request({
              url: '/tables/' + this.data.tables_id,
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
              url: '/tables',
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
    },
    closeDialog() {
      if (this.$refs['tablesForm']) {
        this.$refs['tablesForm'].clearValidate()
      }
      this.$emit('update:open', false)
      this.data.tables_name = ''
      this.data.tables_description = ''
    }
  }
}
</script>
