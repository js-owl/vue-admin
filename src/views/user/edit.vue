<template>
  <div class="app-container user_edit_card">
    <el-card style="margin-bottom: 20px">
      <div slot="header" class="clearfix">
        <span>Основная информация</span>
      </div>
      <el-form ref="userEditForm" :rules="rules" :model="userFormData">
        <el-row>
          <el-form-item label="Фамилия" prop="lname">
            <el-input
              v-model="userFormData.lname"
              contenteditable="true"
              autocomplete="off"
              minlength="3"
            />
          </el-form-item>
          <el-form-item label="Имя" prop="fname">
            <el-input
              v-model="userFormData.fname"
              contenteditable="true"
              autocomplete="off"
              minlength="3"
            />
          </el-form-item>
          <el-form-item label="Отчество" prop="mname">
            <el-input
              v-model="userFormData.mname"
              contenteditable="true"
              autocomplete="off"
              minlength="3"
            />
          </el-form-item>
          <el-form-item label="Логин AD" prop="activeDirectoryId">
            <el-input
              v-model="userFormData.activeDirectoryId"
              contenteditable="true"
              autocomplete="off"
              minlength="3"
            />
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input
              v-model="userFormData.email"
              contenteditable="true"
              autocomplete="off"
              minlength="3"
            />
          </el-form-item>
          <el-form-item label="Компания" prop="company">
            <el-input
              v-model="userFormData.company"
              contenteditable="true"
              autocomplete="off"
              minlength="3"
            />
          </el-form-item>
          <el-form-item label="Новый пароль" prop="password">
            <el-input
              v-model="userFormData.password"
              contenteditable="true"
              autocomplete="off"
              minlength="3"
            />
          </el-form-item>
          <el-form-item label="Телефон" prop="phone">
            <el-input
              v-model="userFormData.phone"
              contenteditable="true"
              autocomplete="off"
              minlength="3"
            />
          </el-form-item>

          <el-form-item prop="sectionGroup_names" class="user_edit_form">
            <label class="el-form-item__label"> Выберите роль </label>
            <el-row>
              <el-select
                v-model="userFormData.sectionGroup_names"
                placeholder="Выберите тип"
              >
                <el-option
                  v-for="item in sectionGroupNames"
                  :key="item.code"
                  :label="item.text"
                  :value="item.text"
                />
              </el-select>
            </el-row>
          </el-form-item>

          <el-form-item prop="request_sections" class="user_edit_form">
            <label class="el-form-item__label"> Выберите раздел </label>
            <el-row>
              <el-select
                v-model="userFormData.request_sections"
                placeholder="Выберите раздел"
              >
                <el-option
                  v-for="item in requestSections"
                  :key="item.code"
                  :label="item.text"
                  :value="item.text"
                />
              </el-select>
            </el-row>
          </el-form-item>
          <el-form-item prop="request_status" class="user_edit_form">
            <label class="el-form-item__label"> Выберите статус </label>
            <el-row>
              <el-select
                v-model="userFormData.request_status"
                placeholder="Выберите статус"
              >
                <el-option
                  v-for="item in requesStatus"
                  :key="item.code"
                  :label="item.text"
                  :value="item.text"
                />
              </el-select>
            </el-row>
          </el-form-item>
          <el-form-item prop="lang" class="user_edit_form">
            <label class="el-form-item__label"> Язык по умолчанию </label>
            <el-row>
              <el-select
                v-model="userFormData.lang"
                placeholder="Выберите язык"
              >
                <el-option
                  v-for="item in defaultLang"
                  :key="item.code"
                  :label="item.text"
                  :value="item.text"
                />
              </el-select>
            </el-row>
          </el-form-item>

          <el-form-item prop="position_id" class="user_edit_form">
            <label class="el-form-item__label"> Должность </label>
            <el-row>
              <el-select
                v-model="userFormData.position_id"
                placeholder="Выберите должность"
              >
                <el-option
                  v-for="item in positions"
                  :key="item.position_id"
                  :label="item.position_name"
                  :value="item.position_id"
                />
              </el-select>
            </el-row>
          </el-form-item>
          <el-form-item prop="dealer_id" class="user_edit_form">
            <label class="el-form-item__label"> Дилер </label>
            <el-row>
              <el-select
                v-model="userFormData.dealer_id"
                placeholder="Выберите дилера"
                filterable
              >
                <el-option
                  v-for="item in dealers"
                  :key="item.dealer_id"
                  :label="item.name"
                  :value="item.dealer_id"
                />
              </el-select>
            </el-row>
          </el-form-item>
        </el-row>
      </el-form>
      <el-row>
        <el-button type="primary" @click="submitForm">Сохранить</el-button>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'UserEdit',
  components: {},
  data() {
    const api_uri = process.env.VUE_APP_BACKEND_HOST + '/api'
    const id = null
    return {
      dealers: [],
      positions: [],
      api_uri,
      id,
      rules: {
        lname: [{ required: true, message: 'Заполните поле', trigger: 'blur' }]
      },
      sectionGroupNames: [{ text: 'Выберите тип', code: '' }],
      requestSections: [{ text: 'Выберите раздел', code: '' }],
      requesStatus: [{ text: 'Выберите статус', code: '' }],
      defaultLang: [{ text: 'Выберите язык', code: '' }],
      userFormData: {
        lname: '',
        mname: '',
        fname: '',
        position_id: '',
        dealer_id: '',
        activeDirectoryId: '',
        email: '',
        company: '',
        password: '',
        phone: '',
        sectionGroup_names: '',
        request_sections: '',
        request_status: '',
        lang: ''
      }
    }
  },
  mounted() {
    this.getDealers()
    this.getPositions()
    if (this.$route.params && this.$route.params.id) {
      this.id = this.$route.params.id
      this.getInfo(this.id)
    }
    this.sectionGroupNames.push(
      { text: 'Дилер', code: '1' },
      { text: 'Переводчик', code: '2' },
      { text: 'Сотрудник ДПО', code: '3' },
      { text: 'Сотрудник УРРД', code: '4' },
      { text: 'Субдилер', code: '5' },
      { text: 'ФЛ', code: '6' }
    )
    this.requestSections.push(
      { text: 'Товарный портфель', code: '1' },
      { text: 'Руководство по ремонту', code: '2' },
      { text: 'Электросхемы', code: '3' },
      { text: 'Диагностика', code: '4' }
    )
    this.requesStatus.push(
      { text: 'Черновик', code: '1' },
      { text: 'Корректировка', code: '2' },
      { text: 'В работе', code: '3' },
      { text: 'Отправлена', code: '4' },
      { text: 'На согласовании', code: '5' },
      { text: 'К исполнению', code: '6' },
      { text: 'К исполнению PROF-IT', code: '7' },
      { text: 'В работе PROF-IT', code: '8' }
    )
    this.defaultLang.push({ text: 'RU', code: '1' }, { text: 'EN', code: '2' })
  },
  methods: {
    async getDealers() {
      const res = await request({
        url: '/dealer',
        method: 'get',
        params: { limit: 1000 }
      })
      this.dealers = res.data //
    },
    async getPositions() {
      const res = await request({
        url: '/position',
        method: 'get',
        params: {}
      })
      this.positions = res.data
    },
    async getInfo() {
      this.userFormData = await request({
        url: '/users/' + this.id,
        method: 'get'
      })
    },
    submitForm() {
      this.$refs['userEditForm'].validate(async (valid) => {
        if (valid) {
          console.log('not error submit!!')
          if (this.id) {
            const res = await request({
              url: 'users/' + this.id,
              method: 'put',
              data: this.userFormData
            })
            if (res) {
              this.$notify({
                title: 'Успешно!',
                message: 'Данные успешно сохранены',
                type: 'success',
                duration: 5000
              })
            }
          } else {
            const res = await request({
              url: '/users',
              method: 'post',
              data: this.userFormData
            })
            if (res) {
              this.$notify({
                title: 'Успешно!',
                message: 'Данные успешно добавлены',
                type: 'success',
                duration: 5000
              })
            }
          }
        } else {
          console.log('error submit!!')
        }
      })
    }
  }
}
</script>

<style>
.el-form-item {
  margin-bottom: 15px;
}
</style>
