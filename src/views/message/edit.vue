<template>
  <div class="app-container message_edit">
    <el-card
      class="max_string el_card_header_sample"
      style="margin-bottom: 20px"
    >
      <div slot="header" class="clearfix">
        <span>Основная информация</span>
      </div>
      <el-form
        ref="messageEditForm"
        v-loading="loading"
        :rules="rules"
        :model="messageFormData"
      >
        <el-row>
          <el-col :span="24" class="message_edit_margin">
            <el-form-item label="Заголовок" prop="message_title">
              <el-input
                v-model="messageFormData.message_title"
                minlength="3"
                maxlength="80"
                show-word-limit
                :disabled="messageFormData.isPublish"
              />
            </el-form-item>
            <el-form-item
              label="Краткое описание"
              prop="message_shortDescription"
            >
              <el-input
                v-model="messageFormData.message_shortDescription"
                minlength="3"
                :disabled="messageFormData.isPublish"
                maxlength="150"
                show-word-limit
              />
            </el-form-item>
            <el-form-item
              label="Подробное описание"
              prop="message_description"
              class="display_grid"
            >
              <!-- <Tinymce
                ref="editor"
                v-model="messageFormData.message_description"
                :height="400"
              /> -->
              <ckeditor
                ref="ckeditorRef"
                v-model="messageFormData.message_description"
                :disabled="messageFormData.isPublish"
                :editor="editor"
                :config="editorConfig"
                @blur="onEditorBlur"
              />
            </el-form-item>
            <!-- Получатель -->
            <el-form-item
              label="Получатель"
              prop="message_roles"
              class="recipient"
            >
              <el-select
                v-model="messageFormData.message_roles"
                class="select"
                multiple
                clearable
                placeholder="Выберите роль"
                style="width: 30%"
                :disabled="messageFormData.isPublish"
              >
                <el-option
                  v-for="item in rolesFormData"
                  :key="item.role_id"
                  :label="item.role_description"
                  :value="item.role_id"
                />
              </el-select>
              <el-button
                type="primary"
                :disabled="messageFormData.isPublish"
                @click="selectAll"
              >
                Выбрать все
              </el-button>
            </el-form-item>
            <!-- Статус публикации -->
            <el-form-item
              v-if="!messageFormData.isPublish && this.$route.params.id"
              label="Когда опубликовать:"
              prop="publishStatus"
              class="recipient"
            >
              <el-select
                v-model="publishStatus"
                class="select"
                placeholder="Когда опубликовать"
                style="width: 30%"
                @change="updateButtonStatus"
              >
                <el-option
                  v-for="item in status"
                  :key="item.status_id"
                  :label="item.status_label"
                  :value="item.status_id"
                />
              </el-select>
            </el-form-item>
            <!-- Дата публикации -->
            <el-form-item
              v-if="this.$route.params.id && showDatePublish"
              label="Дата публикации"
              prop="message_datePublish"
              class="display_grid"
            >
              <el-date-picker
                v-model="messageFormData.message_datePublish"
                type="datetime"
                format="dd.MM.yyyy HH:mm"
                placeholder="Выберите время"
                :picker-options="limitTime"
                popper-class="messageDayPicker"
                :disabled="messageFormData.isPublish"
                :default-value="defaultTime"
              />
            </el-form-item>
            <el-button
              v-if="this.$route.params.id"
              type="primary"
              @click="openNG"
            >
              Предварительный просмотр
            </el-button>
            <el-button
              v-show="!messageFormData.isPublish"
              type="primary"
              @click="submitForm"
            >
              {{ buttonSaveLabel }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// import { parseTime } from '@/utils'
import request from '@/utils/request'
// import Tinymce from '@/components/Tinymce'
import CKEditor from '@ckeditor/ckeditor5-vue2'
import Editor from '../../../ckeditor5/build/ckeditor'
import moment from 'moment/moment'

export default {
  name: 'MessageEdit',
  // components: { Tinymce },
  components: {
    ckeditor: CKEditor.component
  },
  data() {
    const api_uri = process.env.VUE_APP_BACKEND_HOST + '/api'
    let id = null
    id = Number(this.$route.params.id)

    const validateDescription = (rule, value, callback) => {
      if (!this.$refs.ckeditorRef.value) {
        callback(new Error('Заполните поле'))
      } else {
        callback()
      }
    }
    const validateDatePublish = (rule, value, callback) => {
      const publishDate = Date.parse(value)
      const now = Date.now()

      if (this.publishStatus === 'later' && publishDate) {
        if (publishDate < now && id > 0) {
          callback(new Error('Дата публикации должна быть позже текущей даты'))
        } else {
          callback()
        }
      } else {
        callback(new Error('Заполните поле'))
      }
    }

    return {
      limitTime: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7 // Disable the previous date, today can not help
        }
      },
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      api_uri,
      id,
      rules: {
        message_title: [
          { required: true, message: 'Заполните поле', trigger: 'blur' }
        ],
        message_shortDescription: [
          { required: true, message: 'Заполните поле', trigger: 'blur' },
          {
            min: 1,
            max: 150,
            message: 'Длина текста не должна превышать 150 символов',
            trigger: 'blur'
          }
        ],
        message_description: [
          {
            required: true,
            trigger: 'blur',
            validator: validateDescription
          }
        ],
        message_roles: [
          { required: true, message: 'Заполните поле', trigger: 'change' }
        ],
        publishStatus: [
          { required: true, message: 'Заполните поле', trigger: 'change' }
        ],
        message_datePublish: [
          {
            required: true,
            trigger: 'blur',
            validator: validateDatePublish
          }
        ]
      },
      messageFormData: {
        message_title: '',
        message_shortDescription: '',
        message_description: '',
        message_datePublish: ''
      },
      editor: Editor, // ckEditor
      editorData: '<p>Content of the editor.</p>',
      editorConfig: {
        // The configuration of the editor.
      },
      rolesFormData: {},
      roles: [],
      loading: false,
      status: [
        { status_id: 'draft', status_label: 'Черновик' },
        { status_id: 'now', status_label: 'Сейчас' },
        { status_id: 'later', status_label: 'Позже' }
      ],
      publishStatus: '',
      showDatePublish: false,
      buttonSaveLabel: 'Сохранить'
    }
  },
  computed: {
    defaultTime() {
      return new Date(new Date().getTime() + 300000) // add 5 minutes to current time
    }
  },
  mounted() {
    if (this.$route.params && this.$route.params.id) {
      this.getInfo(this.id)
    } else {
      this.updateButtonStatus()
    }
    this.getRoles()
    // delete warning: async-validator: ['message_roles is required']
    this.messageFormData.message_roles = ' '
  },
  methods: {
    async getInfo() {
      this.messageFormData = await request({
        url: '/message/' + this.id,
        method: 'get'
      })
      // console.log('this.messageFormData', this.messageFormData)
      this.messageFormData.message_roles =
        this.messageFormData.message_roles.map((v) => v.role_id)
      if (this.messageFormData.message_datePublish == null) {
        this.publishStatus = 'draft'
      } else if (
        this.messageFormData.message_datePublish &&
        !this.messageFormData.isPublish
      ) {
        this.publishStatus = 'later'
        this.showDatePublish = true
      }
      this.messageFormData.publishStatus = 'draft'
      this.updateButtonStatus()
    },
    updateButtonStatus() {
      switch (this.publishStatus) {
        case 'draft': {
          this.showDatePublish = false
          if (!this.id) {
            this.buttonSaveLabel = 'Сохранить как черновик и посмотреть'
          } else {
            this.buttonSaveLabel = 'Сохранить'
          }
          break
        }
        case 'now': {
          this.showDatePublish = false
          this.buttonSaveLabel = 'Опубликовать'
          break
        }
        case 'later': {
          this.showDatePublish = true
          this.buttonSaveLabel = 'Опубликовать позже'
          break
        }
        default: {
          this.buttonSaveLabel = 'Сохранить как черновик и посмотреть'
          break
        }
      }
    },
    async getRoles() {
      const res = await request({
        url: '/roles/',
        method: 'get'
      })
      this.rolesFormData = res.data
      if (!this.$route.params?.id) {
        this.selectAll()
      }
    },
    openNG() {
      this.$refs['messageEditForm'].validate(async (valid) => {
        if (valid) {
          if (!this.messageFormData.isPublish) await this.submitForm()
          window.open(process.env.VUE_APP_OLD + '/?elis.uaz=bell-' + this.id)
        }
      })
    },
    async submitForm() {
      this.$refs['messageEditForm'].validate(async (valid) => {
        if (valid) {
          this.loading = true
          if (this.publishStatus === 'draft') {
            this.messageFormData.message_datePublish = null
          } else if (this.publishStatus === 'now') {
            this.messageFormData.isPublish = true
            this.messageFormData.message_datePublish = moment(new Date()).utc()
          } else if (this.publishStatus === 'later') {
            // const r = await request({
            //   url: '/message/' + this.id,
            //   method: 'get'
            // })
            // if (r.isPublish) {
            //   this.$notify({
            //     title: 'Предупреждение!',
            //     message: 'Данные уже опубликованы',
            //     type: 'warning',
            //     duration: 5000
            //   })
            //   this.loading = false
            //   this.messageFormData.isPublish = true
            //   this.$router.push(`/message/edit/${this.id}`)
            //   return
            // }
          }
          if (this.id) {
            const res = await request({
              url: '/message/' + this.id,
              method: 'put',
              data: this.messageFormData
            })
            if (res) {
              this.$notify({
                title: 'Успешно!',
                message: 'Данные успешно сохранены',
                type: 'success',
                duration: 5000
              })
            }
            this.loading = false
          } else {
            const res = await request({
              url: '/message',
              method: 'post',
              data: this.messageFormData
            })
            if (res) {
              this.$notify({
                title: 'Успешно!',
                message: 'Черновик успешно сохранен',
                type: 'success',
                duration: 5000
              })
              window.open(
                'https://elis.uaz.ru/?elis.uaz=bell-' + res.message_id
              )
              this.$router.push(`/message/edit/${res.message_id}`)
            }
          }
          return true
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    selectAll() {
      this.messageFormData.message_roles = this.rolesFormData.map(
        (v) => v.role_id
      )
    },
    onInput() {
      console.log('onInput')
    },
    onEditorBlur() {
      this.$refs['messageEditForm'].validate((valid) => {
        console.log('valid')
      })
    }
  }
}
</script>
<style>
.message_edit .max_string {
  margin-bottom: 20px;
}
.max_string .el-form-item {
  margin: 10px 0;
}
.tinymce-container {
  margin-top: 30px;
}
.message_edit .el-select {
  width: 100% !important;
}
.message_edit .display_grid {
  display: grid;
  justify-items: start;
}
.message_edit .el-date-editor {
  width: 322px !important;
}
/* .date_message button.el-button--text {
  display: none;
} */
.messageDayPicker button.el-button--text {
  display: none;
}
.message_edit .recipient {
  display: flex;
  flex-wrap: wrap;
}
.message_edit .recipient .el-select {
  width: 70% !important;
  margin-right: 10px;
}
.message_edit_margin {
  margin-bottom: 20px;
}
</style>
