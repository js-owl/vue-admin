<template>
  <div v-if="dealerID" class="app-container booking-settings">
    <panel-button
      class="panel-button sticky_edit"
      :show-button="showButtons"
      @clickBtnSave="saveData"
    />
    <el-card shadow="always">
      <el-row style="padding-bottom: 20px">
        <el-col :span="4"><p class="dealer-title">ID дилера</p></el-col>
        <el-col :span="20">
          <p>{{ dealerID }}</p>
        </el-col>
      </el-row>
      <el-row style="padding-bottom: 20px">
        <el-col :span="4"><p class="dealer-title">Имя</p></el-col>
        <el-col :span="20">
          <p>{{ dealerData.name }}</p>
        </el-col>
      </el-row>
      <el-row style="padding-bottom: 20px">
        <el-col :span="4"><p class="dealer-title">Адрес</p></el-col>
        <el-col :span="20">
          <p>{{ dealerData.city_name }}, {{ dealerData.address }}</p>
        </el-col>
      </el-row>
      <el-row style="padding-bottom: 20px">
        <el-col :span="4"><p class="dealer-title">Адрес DMS дилера</p></el-col>
        <el-col :span="20">
          <el-input
            v-model="dealerSettings.DMS_host"
            placeholder="Введите адрес"
            clearable
            class="input-with-select"
            style="max-width: 400px"
          />
          {{ '/hs/ObmenAPI/GetAPI' }}
        </el-col>
      </el-row>

      <el-row style="padding-bottom: 20px">
        <el-col :span="4"><p class="dealer-title">API Key</p></el-col>
        <el-col :span="20">
          <el-input
            v-model="dealerSettings.apiKey"
            disabled
            placeholder="Сгенерированный ключ"
            style="width: 350px"
          />
          <el-button
            type="primary"
            icon="el-icon-document"
            @click="handleCopy(dealerSettings.apiKey, $event)"
          >
            copy
          </el-button>
          <el-button
            type="primary"
            class="el-button-icon"
            @click="generateKey()"
          >
            Снегерировать ключ
          </el-button>
        </el-col>
      </el-row>

      <el-row style="padding-bottom: 20px">
        <el-col :span="4"><p class="dealer-title">Email</p></el-col>
        <el-col :span="20">
          <el-input
            v-model="dealerSettings.email"
            placeholder="Введите адрес электронной почты"
            clearable
            class="input-with-select"
            style="max-width: 400px"
          />
        </el-col>
      </el-row>
    </el-card>

    <el-card>
      <el-form ref="dealerInfo" :model="dealerInfo">
        <el-form-item label="График работы">
          <el-time-select
            v-model="dealerSettings.dealerWorkStart_at"
            placeholder="Начало"
            clearable
            style="max-width: 140px"
            :picker-options="{
              start: '07:00',
              step: '00:30',
              end: '22:00'
            }"
          />
          <span style="padding: 0 10px">—</span>
          <el-time-select
            v-model="dealerSettings.dealerWorkEnd_at"
            placeholder="Окончание"
            clearable
            style="max-width: 140px"
            :picker-options="{
              start: '12:00',
              step: '00:30',
              end: '22:00',
              minTime: dealerSettings.dealerWorkStart_at
            }"
          />
        </el-form-item>
        <el-form-item label="Размер слота, мин.">
          <el-radio-group v-model="dealerSettings.slot_interval">
            <el-radio-button label="15" />
            <el-radio-button label="30" />
            <el-radio-button label="60" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Количество постов">
          <el-input-number
            v-model="dealerSettings.countPost"
            :step="1"
            :min="1"
            :max="30"
            placeholder="1"
            style="max-width: 130px"
          />
        </el-form-item>
        <el-button id="elis_widget_iframe" type="primary">
          Открыть виджет запись на сервис
        </el-button>
        <!-- <el-form-item style="display: flex; justify-content: flex-end">
          <el-button type="primary" @click="saveData">Сохранить</el-button>
          <el-button>Отмена</el-button>
        </el-form-item> -->
      </el-form>
    </el-card>
    <el-card>
      <el-row style="padding-bottom: 20px">
        <el-col :span="4">
          <p class="dealer-title">Код для вставки</p>
        </el-col>
        <el-col :span="20">
          <p>
            Необходимо создать элемент на странице сайта с
            id="elis_widget_iframe"
          </p>
          <p>
            Например: &lt;a id="elis_widget_iframe" href="#">widget&lt;/a&gt;
          </p>
          <el-input
            v-model="inputData"
            type="textarea"
            :rows="7"
            disabled
            placeholder="Please input"
            style="max-width: 90%"
          />
          <el-button
            type="primary"
            icon="el-icon-document"
            @click="handleCopy(inputData, $event)"
          >
            copy
          </el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
  <div v-else class="app-container">
    Учетная запись не привязана. Обратитесь в тех. поддержку support@elis.uaz.ru
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/request'
import store from '@/store'
import clip from '@/utils/clipboard' // use clipboard directly
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive
import PanelButton from '@/components/PanelButton/PanelButton'
// import filterSelect from '@/components/Header/filter'

export default {
  name: 'SettingsList',
  components: { PanelButton },
  // components: { Pagination, filterSelect, JsonViewer },
  directives: {
    clipboard
  },
  data() {
    return {
      showButtons: [{ label: 'Сохранить', emit: 'clickBtnSave' }],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      dealerID: '',
      dealerInfo: {
        startTime: '',
        endTime: '',
        sizeSlot: '',
        stepSlot: ''
      },
      dealerData: {},
      dealerSettings: {},
      // storage: process.env.VUE_APP_BACKEND_HOST + '/storage/',
      tempData: {},
      activeRow: null,
      currentFilter: {
        filter: ''
      },
      inputData: '',
      storage: process.env.VUE_APP_BACKEND_HOST + '/widgetbooking/'
    }
  },
  // beforeRouteEnter(to, from, next) {
  //   next((vm) => {
  //     if (from.path == '/login') location.reload()
  //   })
  // },
  computed: {
    ...mapGetters(['role_name'])
  },
  created() {
    this.dealerID = store.state.user.dealer_id || 1
    console.log('🚀 ~ created ~ this.dealerID :', this.dealerID)
    window.elis_widget_booking_dealer_step = 3
    const step = 3
    const iframe = document.createElement('iframe')
    iframe.setAttribute('class', 'elis_iframe')

    iframe.src = `https://v2.elis.uaz.ru/widgetbooking/index.html?id=${this.dealerID}&step=${step}`
    iframe.style = 'display: none;'
    setTimeout(() => {
      const elis_widget_iframe = document.querySelector('#elis_widget_iframe')
      elis_widget_iframe.addEventListener('click', toggleOpen)
    }, 0)

    function toggleOpen() {
      if (iframe.style.display == 'none') {
        iframe.style = 'display:block;'
        iframe.style = `position:fixed; top:0;right:0; height:100%; width:35%; border: none; background-color: transparent; box-shadow: 0px 0px 6px 0px grey; transition: all 0.5s; z-index:1000; `
        if (window.matchMedia('(min-width: 1600px)').matches) {
          iframe.style.width = '35%'
        } else if (window.matchMedia('(min-width: 1070px)').matches) {
          iframe.style.width = '50%'
        } else {
          iframe.style.width = '100%'
        }
      } else {
        iframe.style = 'display: none'
      }
    }

    document.getElementsByTagName('body')[0].appendChild(iframe)
    window.onmessage = function (event) {
      if (event.data == 'closeDrawer') {
        iframe.style = 'display: none'
      }
    }
    // ;(function (d, w) {
    //   const dealerID = store.state.user.dealer_id.toString()
    //   console.log('🚀 ~ created ~ this.dealerID :', dealerID)
    //   w.elis_widget_booking_dealer_step = 3
    //   const js = d.createElement('script')
    //   js.type = 'module'
    //   js.async = true
    //   js.src = `https://v2.elis.uaz.ru/widgetbooking/widget-loader.js?id=${dealerID}`
    //   d.getElementsByTagName('head')[0].appendChild(js)
    // })(document, window)

    // window.elis_widget_booking_dealer_id = this.dealerID
    // console.log('booking/settings id', window.elis_widget_booking_dealer_id)
    // =========== widget iframe ===============
    this.inputData = `<script>(function (d, w) {
      w.elis_widget_booking_dealer_step = 3;
      const js=d.createElement('script'); js.type = 'module'; js.async=true;
      js.src='${this.storage}widget-loader.js?id=${this.dealerID}';
      d.getElementsByTagName('head')[0].appendChild(js)})
      (document, window)<\/script>
      `
    // =========== widget mounted ===============
    // this.inputData = `<script>(function (d, w) {
    //   w.elis_widget_booking_dealer_id=${this.dealerID};
    //   const html=d.createElement('div'); html.setAttribute("id", "widget"); d.getElementsByTagName('body')[0].appendChild(html);
    //   const js=d.createElement('script'); js.type = 'module'; js.async=true; js.src='${this.storage}widget-loader.js';
    //   d.getElementsByTagName('head')[0].appendChild(js)})
    //   (document, window)<\/script>
    //   `
    if (this.dealerID) {
      this.getInfo()
      this.getInfoSettings()
    }
    this.getList()
  },
  methods: {
    async getInfo() {
      this.dealerData = await request({
        url: '/dealer/' + this.dealerID,
        method: 'get'
      })
    },
    async getInfoSettings() {
      this.dealerSettings = await request({
        url: '/dealersetting/' + this.dealerID,
        method: 'get'
      })
    },
    // async getDealerID() {
    //   const res = await request({
    //     url: 'https://dev.v2.elis.uaz.ru/api/auth/login',
    //     method: 'get'
    //   })
    //   this.dealerID = res.user_data.dealer_id
    //   this.listLoading = false
    // },
    async getList() {
      const params = {
        page: this.listQuery.page
      }
      if (this.currentFilter.filter) {
        params.filter = this.currentFilter.filter
      }
      const res = await request({
        url: '/bookingimportlog',
        method: 'get',
        params
      })
      this.list = res.data
      this.total = res.total
      this.listQuery.page = res.current_page
      this.listQuery.limit = res.per_page
      this.listLoading = false
    },
    copyKey() {
      this.$message({
        message: 'Ключ успешно скопирован.',
        type: 'success'
      })
    },
    async saveData() {
      console.log('🚀 ~ saveData ~ this.dealerSettings:', this.dealerSettings)
      const res = await request({
        url: '/dealersetting/' + this.dealerID,
        method: 'put',
        data: this.dealerSettings
      })

      if (res) {
        console.log(res)
        this.$notify({
          title: 'Успешно!',
          message: 'Данные успешно сохранены',
          type: 'success',
          duration: 5000
        })
      } else {
        console.log('PUT request error')
      }
    },
    handleCopy(text, event) {
      clip(text, event)
    },
    generateKey() {
      let result = ''
      const length = 35
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      const charactersLength = characters.length
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        )
      }
      this.dealerSettings.apiKey = result
    }
  }
}
</script>
<style scoped>
/*шапка*/
.app-container .el-dialog__header {
  height: 60px;
  background-color: #cfdbd9;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  text-transform: uppercase;
  color: #003d2d;
}

.el-row > .el-col > .dealer-title {
  display: inline-block;
  max-width: 100%;
  margin-bottom: 0;
  padding: 0 12px 0 0;
  vertical-align: middle;
  font-size: 14px;
  line-height: 36px;
  font-weight: 700;
  color: #606266;
  text-align: right;
  box-sizing: border-box;
}
tbody > .el-table__row > td > .cell {
  margin: 0 !important;
}
</style>
