<template>
  <div class="app-container">
    <el-card style="margin-bottom: 20px">
      <div slot="header" class="clearfix">
        <span>Основная информация</span>
      </div>
      <el-form
        ref="userEditForm"
        v-loading="loading"
        :rules="rules"
        :model="userFormData"
        label-width="200px"
      >
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
        <el-form-item label="Email" prop="email">
          <el-input
            v-model="userFormData.email"
            contenteditable="true"
            autocomplete="off"
            minlength="3"
            disabled
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
        <el-form-item label="Телефон" prop="phone">
          <el-input
            v-model="userFormData.phone"
            contenteditable="true"
            autocomplete="off"
            minlength="3"
          />
        </el-form-item>
        <el-form-item prop="lang" label="Язык по умолчанию">
          <el-select
            v-model="userFormData.lang"
            placeholder="Выберите язык"
            style="width: 100%"
          >
            <el-option
              v-for="item in defaultLang"
              :key="item.code"
              :label="item.text"
              :value="item.text"
            />
          </el-select>
        </el-form-item>

        <el-form-item prop="position_id" label="Должность">
          <el-select
            v-model="userFormData.position_id"
            placeholder="Выберите должность"
            style="width: 100%"
          >
            <el-option
              v-for="item in positions"
              :key="item.position_id"
              :label="item.position_name"
              :value="item.position_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="dealer_id" label="Дилер">
          <el-select
            v-model="userFormData.dealer_id"
            placeholder="Выберите дилера"
            style="width: calc(100% - 105px)"
            filterable
          >
            <el-option
              v-for="item in dealers"
              :key="item.dealer_id"
              :label="item.name"
              :value="item.dealer_id"
            />
          </el-select>
          <el-button type="primary" @click="createDealer"> Добавить </el-button>
        </el-form-item>
      </el-form>
      <el-row>
        <el-button type="primary" @click="saveForm('agreed')">
          Согласовать
        </el-button>
        <el-button type="primary" @click="saveForm('declined')">
          Отклонить
        </el-button>
        <el-button type="primary" @click="saveForm('save')">
          Сохранить
        </el-button>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import request from '@/utils/request'
import { mapState } from 'vuex'

export default {
  name: 'UserRequestEdit',
  components: {},
  data() {
    const api_uri = process.env.VUE_APP_BACKEND_HOST + '/api'
    const id = null
    return {
      dealers: [],
      positions: [],
      api_uri,
      id,
      loading: false,
      rules: {
        lname: [{ required: true, message: 'Заполните поле', trigger: 'blur' }],
        dealer_id: [
          { required: true, message: 'Заполните поле', trigger: 'blur' }
        ]
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
        lang: '',
        requestUpdate: true
      }
    }
  },
  computed: {
    ...mapState({
      dealer_lname: (state) => {
        return state.dealer.dealer_lname
      },
      dealer_id: (state) => {
        return state.dealer.dealer_id
      }
    })
  },
  mounted() {
    console.log('🚀 \x1b[33m ~ file: editRequest.vue:186')
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
    createDealer() {
      this.$store.commit('dealer/SET_DEALER_LNAME', this.userFormData.company)
      this.$store.commit('dealer/SET_DEALER_PHONE', this.userFormData.phone)
      this.$store.commit('dealer/SET_DEALER_EMAIL', this.userFormData.email)
      this.$store.commit('dealer/SET_REQUEST_ID', this.id)
      this.$router.push(`/dealer/edit?from=request`)
    },
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
        url: '/user/request/' + this.id,
        method: 'get'
      })
      if (this.$route.query?.from == 'dealer') {
        this.userFormData.dealer_id = this.dealer_lname
      }
    },
    saveForm(state) {
      this.loading = true
      this.userFormData.dealer_id = this.dealer_id
      this.$refs['userEditForm'].validate(async (valid) => {
        if (valid || state === 'declined') {
          if (this.id) {
            this.userFormData.regRequestState = state
            let notify_mes = 'Данные успешно сохранены'
            let notify_type = 'success'
            switch (state) {
              case 'agreed':
                notify_mes = 'Данные успешно сохранены. Доступ согласован'
                break
              case 'declined':
                notify_type = 'warning'
                notify_mes = 'Данные успешно сохранены. В доступе отказано'
                break
            }
            this.userFormData.requestUpdate = true
            const res = await request({
              url: 'users/' + this.userFormData.id,
              method: 'put',
              data: this.userFormData
            })
            if (res) {
              this.$notify({
                title: 'Успешно!',
                message: notify_mes,
                type: notify_type,
                duration: 5000
              })
              if (state !== 'save') {
                this.$router.push(`/dealer/request`)
              }
            }
          }
        } else {
          console.log('error submit!!')
        }
        this.loading = false
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
