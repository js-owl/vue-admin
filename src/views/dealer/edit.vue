<template>
  <div class="app-container">
    <el-card
      class="max_string el_card_header_sample dealer_edit_card"
      style="margin-bottom: 20px"
    >
      <div slot="header" class="clearfix">
        <span>Основная информация</span>
      </div>
      <el-form
        ref="dealerEditForm"
        v-loading="loadingCity"
        :rules="rules"
        :model="dealerFormData"
      >
        <el-row>
          <el-col :span="7">
            <el-form-item label="Наименование" prop="name">
              <el-input
                v-model="dealerFormData.name"
                contenteditable="true"
                autocomplete="off"
                minlength="3"
                clearable
              />
            </el-form-item>
            <el-form-item label="Телефон" prop="phone">
              <el-input v-model="dealerFormData.phone" minlength="3" />
            </el-form-item>
            <el-form-item prop="crmCity_id">
              <el-row style="justify-content: start">
                <label class="el-form-item__label city_asterisk"> Город </label>
              </el-row>
              <el-row>
                <el-select
                  v-model="dealerFormData.crmCity_id"
                  filterable
                  remote
                  :remote-method="getCities"
                  placeholder="Выберите город"
                  :loading="loadingCity"
                  clearable
                  @change="changeCity"
                >
                  <el-option-group
                    v-for="group in cities"
                    :key="group.crmRegion_id"
                    :label="group.region_name"
                  >
                    <el-option
                      v-for="item in group.cities"
                      :key="item.crmCity_id"
                      :label="item.city_name"
                      :value="item.crmCity_id"
                    />
                  </el-option-group>
                </el-select>
              </el-row>
            </el-form-item>
            <el-form-item label="Тип дилера" prop="dealerTypeName">
              <type-dealer v-model="dealerFormData.dealerTypeName" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="Код CRM" prop="code">
              <el-input
                v-model="dealerFormData.code"
                :disabled="id ? true : false"
                minlength="3"
              />
            </el-form-item>
            <el-form-item label="Email" prop="email">
              <el-input v-model="dealerFormData.email" minlength="3" />
            </el-form-item>
            <el-form-item label="Регион" prop="region_id">
              <el-select
                v-model="dealerFormData.crmRegion_id"
                placeholder="Выберите регион"
                :disabled="true"
                :loading="loadingRegion"
              >
                <el-option
                  v-for="item in Object.values(cities)"
                  :key="item.crmRegion_id"
                  :label="item.region_name"
                  :value="item.crmRegion_id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Статус дилера" prop="dealer_status_id">
              <status-dealer v-model="dealerFormData.dealer_status_id" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item />
            <el-form-item label="Веб сайт" prop="website">
              <el-input v-model="dealerFormData.website" minlength="3" />
            </el-form-item>
            <el-form-item label="Адрес" prop="address">
              <el-input v-model="dealerFormData.address" minlength="3" />
            </el-form-item>
            <el-form-item label="Экспорт" prop="isExport">
              <export-dealer v-model="dealerFormData.isExport" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        <el-button type="primary" @click="submitForm">Сохранить</el-button>
      </el-row>
    </el-card>
    <el-card
      v-if="id"
      class="el_card_header_sample"
      style="margin-bottom: 20px"
    >
      <div slot="header" class="clearfix">
        <span>Список сотрудников дилера</span>
      </div>
      <user-list
        :edit-mode="false"
        :dealer-id="id"
        :show-checked-field="true"
        :show-dealer-field="true"
        @check-user="handleCheckUser"
      />
    </el-card>

    <el-card v-if="id" :gutter="20" style="margin-bottom: 20px">
      <div class="chart-container">
        <chart
          :pi="data4chart"
          chart-name="Активность за 10 дней"
          y-axis-name="действия"
          height="100%"
          width="100%"
        />
      </div>
    </el-card>

    <el-row v-if="id" :gutter="20">
      <el-col :span="24">
        <el-card class="el_card_header_sample" style="margin-bottom: 20px">
          <div slot="header" class="clearfix">
            <span>Активность</span>
          </div>
          <activity-list
            :dealer-id="id"
            :show-company="true"
            :show-btn-export-excel="true"
          />
        </el-card>
      </el-col>
    </el-row>

    <el-row
      v-if="id"
      :gutter="20"
      style="margin-bottom: 20px; margin-left: 0px; margin-right: 0px"
    >
      <history-dealer :dealer-id="id" />
    </el-row>

    <el-card
      v-if="id"
      class="el_card_header_sample"
      style="margin-bottom: 20px"
    >
      <div slot="header" class="clearfix">
        <span>Обратная связь</span>
      </div>
      <feed-back :edit-mode="false" :dealer-id="id" />
    </el-card>

    <el-row v-if="id" :gutter="20">
      <el-col :span="24">
        <el-card class="el_card_header_sample">
          <div slot="header" class="clearfix">
            <span>Бюллетени</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import request from '@/utils/request'
import UserList from '@/components/UserList'
import FeedBack from '@/components/FeedBack'
import Chart from '@/components/Charts/LineMarker'
import typeDealer from '@/views/dealer/typeDealer'
import statusDealer from '@/views/dealer/statusDealer'
import exportDealer from '@/views/dealer/exportDealer'
import historyDealer from '@/views/dealer/historyDealer'
import ActivityList from '@/views/directory/activity/components/ActivityList'
import { mapState } from 'vuex'

export default {
  name: 'DealerEdit',
  components: {
    UserList,
    FeedBack,
    Chart,
    typeDealer,
    statusDealer,
    exportDealer,
    historyDealer,
    ActivityList
  },
  data() {
    const api_uri = process.env.VUE_APP_BACKEND_HOST + '/api'
    let id = null
    id = Number(this.$route.params.id)
    const checkUniqueDealerName = async (rule, value, callback) => {
      const res = await request({
        url: '/dealer/',
        method: 'get',
        params: {
          name: value,
          limit: 1
        }
      })
      if ((res.total > 0 && !id) || (res.total > 1 && id)) {
        callback(new Error('Дилер с данным наименоваием уже существует'))
      } else {
        callback()
      }
    }
    return {
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      api_uri,
      id,
      rules: {
        name: [
          { required: true, message: 'Заполните поле', trigger: 'blur' },
          { validator: checkUniqueDealerName, trigger: 'blur' }
        ],
        crmCity_id: [
          { required: true, message: 'Заполните город', trigger: 'blur' }
        ]
      },
      cities: [],
      regions: [],
      loadingRegion: false,
      loadingCity: false,
      dealerFormData: {
        name: '',
        code: '',
        crmCity_id: null,
        region_id: null,
        dealerTypeName: '',
        dealer_status_id: ''
      },
      checkedUsers: [],
      data4chart: []
    }
  },
  mounted() {
    console.log('🚀 \x1b[33m dealer-edit.vue:265')
    if (this.$route.params && this.$route.params.id) {
      this.getInfo(this.id)
    }
    const from = this.$route.query?.from
    if (from == 'request') {
      this.dealerFormData.name = this.dealer_lname
      this.dealerFormData.phone = this.dealer_phone
      this.dealerFormData.email = this.dealer_email
    } else {
      this.dealerFormData.name = ''
      this.dealerFormData.phone = ''
      this.dealerFormData.email = ''
    }
  },
  computed: {
    ...mapState({
      dealer_lname: (state) => {
        return state.dealer.dealer_lname
      },
      dealer_phone: (state) => {
        return state.dealer.dealer_phone
      },
      dealer_email: (state) => {
        return state.dealer.dealer_email
      },
      request_id: (state) => {
        return state.dealer.request_id
      }
    })
  },
  methods: {
    changeCity(newValue) {
      let cityObj = ''
      Object.values(this.cities).forEach((region) => {
        Object.values(region.cities).forEach((city) => {
          if (city.crmCity_id === newValue) {
            cityObj = city
            return
          }
        })
      })
      console.log('cityObj', cityObj)
      this.dealerFormData.crmCity_id = cityObj.crmCity_id
      this.dealerFormData.city_name = cityObj.city_name
      this.dealerFormData.crmRegion_id = cityObj.crmRegion_id
      this.dealerFormData.region_name = cityObj.region_name
    },
    async getCities(v) {
      this.loadingCity = true
      const res = await request({
        url: '/city/',
        method: 'get',
        params: {
          toHierarchy: true,
          name: v
          // region_id: this.dealerFormData.region_id,
        }
      })
      this.cities = res.data
      this.loadingCity = false
    },
    async getRegions() {
      this.loadingRegion = true
      const res = await request({
        url: '/region/',
        method: 'get',
        params: {
          limit: 1000
        }
      })
      this.regions = res.data
      this.loadingRegion = false
    },
    async getInfo() {
      this.dealerFormData = await request({
        url: '/dealer/' + this.id,
        method: 'get'
      })
      console.log('dealerFormData', this.dealerFormData)
      this.cities = [
        {
          crmRegion_id: this.dealerFormData.crmRegion_id,
          region_name: this.dealerFormData.region_name,
          cities: [
            {
              crmCity_id: this.dealerFormData.crmCity_id,
              city_name: this.dealerFormData.city_name
            }
          ]
        }
      ]
    },
    submitForm() {
      this.$refs['dealerEditForm'].validate(async (valid) => {
        if (valid) {
          if (this.id) {
            const res = await request({
              url: '/dealer/' + this.id,
              method: 'put',
              data: this.dealerFormData
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
              url: '/dealer',
              method: 'post',
              data: this.dealerFormData
            })
            if (res) {
              this.$notify({
                title: 'Успешно!',
                message: 'Данные успешно добавлены',
                type: 'success',
                duration: 5000
              })
              this.$store.commit('dealer/SET_DEALER_ID', res.dealer_id)
            }
          }
          this.$store.commit(
            'dealer/SET_DEALER_LNAME',
            this.dealerFormData.name
          )
          if (this.$route.query?.from == 'request') {
            this.$router.push(
              `/user/editRequest/${this.request_id}?from=dealer`
            )
          }
        } else {
          console.log('🚀 ~ file: dealer edit.vue:398 ~ submit error')
        }
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    handleCheckUser(v) {
      this.checkedUsers = v
      this.getActivityChartData()
    },
    async getActivityChartData() {
      const res = await request({
        url: '/activity/chart',
        method: 'get',
        params: {
          users: this.checkedUsers
        }
      })
      this.data4chart = res
    }
  }
}
</script>
<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
.max_string .el-form-item {
  margin: 0 20px 0 0;
}
.el-pagination,
.el-pagination .btn-prev,
.el-pagination .btn-next {
  float: right;
}
.el-form-item.el-form-item--medium {
  height: 72px;
}
.city_asterisk:before {
  content: '*';
  color: #ff4949;
}
</style>
