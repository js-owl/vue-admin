<template>
  <div class="app-container">
    <el-card
      class="max_string el_card_header_sample"
      style="margin-bottom: 20px"
    >
      <div slot="header" class="clearfix">
        <span>Основная информация</span>
      </div>
      <el-form ref="dealerEditForm" :rules="rules" :model="dealerFormData">
        <el-row>
          <el-col :span="7">
            <el-form-item label="Наименование" prop="name">
              <el-input
                v-model="dealerFormData.name"
                contenteditable="true"
                autocomplete="off"
                minlength="3"
              />
            </el-form-item>
            <el-form-item label="Телефон" prop="phone">
              <el-input v-model="dealerFormData.phone" minlength="3" />
            </el-form-item>
            <el-form-item label="Регион" prop="region_id">
              <el-select
                v-model="dealerFormData.region_id"
                placeholder="Выберите регион"
                :loading="loadingRegion"
                @change="changeRegion"
              >
                <el-option
                  v-for="item in regions"
                  :key="item.crmRegion_id"
                  :label="item.region_name"
                  :value="item.crmRegion_id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Тип дилера" prop="dealerTypeName">
              <el-input v-model="dealerFormData.dealerTypeName" minlength="3" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="Код CRM" prop="code">
              <el-input v-model="dealerFormData.code" minlength="3" />
            </el-form-item>
            <el-form-item label="Email" prop="email">
              <el-input v-model="dealerFormData.email" minlength="3" />
            </el-form-item>
            <el-form-item prop="city_id">
              <el-row style="justify-content: start">
                <label class="el-form-item__label">
                  Город {{ dealerFormData.city_id }} {{ loadingCity }}</label>
              </el-row>
              <el-row>
                <el-select
                  v-model="dealerFormData.city_id"
                  filterable
                  placeholder="Выберите город"
                  :loading="loadingCity"
                >
                  <el-option
                    v-for="item in cities"
                    :key="item.crmCity_id"
                    :label="item.city_name"
                    :value="item.crmCity_id"
                  />
                </el-select>
              </el-row>
            </el-form-item>
            <el-form-item label="Статус дилера" prop="dealer_status_id">
              <el-select
                v-model="dealerFormData.dealer_status_id"
                placeholder="Выберите статус"
              >
                <el-option
                  v-for="item in dealerStatus"
                  :key="item.dealerStatus_id"
                  :label="item.dealerStatus_name"
                  :value="item.dealerStatus_id"
                />
              </el-select>
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
            <el-form-item label="Экспорт" prop="code">
              <el-input v-model="dealerFormData.code" minlength="3" />
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
      <user-list :edit-mode="false" :dealer-id="id" :show-dealer-field="true" />
    </el-card>
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
      <el-col :span="12">
        <el-card class="el_card_header_sample">
          <div slot="header" class="clearfix">
            <span>История</span>
          </div>
          <el-table
            class="table_sample break_word"
            :data="history"
            border
            fit
            highlight-current-row
            style="width: 100%"
          >
            <el-table-column label="Описание">
              <template #default="scope">
                <span>{{ scope.row.description }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Дата" width="130">
              <template #default="scope">
                {{ scope.row.created_at | parseTime('{d}.{m}.{y} {h}:{i}') }}
              </template>
            </el-table-column>
            <el-table-column label="Пользователь">
              <template #default="scope">
                {{ scope.row.user_id }}
              </template>
            </el-table-column>
          </el-table>
          <pagination
            :page-size="100"
            layout="total, prev, pager, next"
            :total="history.length"
            background
          /><!--v-model:current-page="history"-->
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div class="chart-container">
            <chart height="100%" width="100%" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import request from '@/utils/request'
import UserList from '@/components/UserList'
import FeedBack from '@/components/FeedBack'
import Chart from '@/components/Charts/LineMarker'

export default {
  name: 'DealerEdit',
  components: { Pagination, UserList, FeedBack, Chart },
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
      if (res.total > 0) {
        callback(new Error('Дилер с данным наименоваием уже существует'))
      } else {
        callback()
      }
    }
    return {
      history: [
        {
          id: 1,
          created_at: '2022-11-15 09:00:06',
          user_id: 3,
          description: 'Аутентификация в системе'
        },
        {
          id: 2,
          created_at: '2022-11-15 09:00:06',
          user_id: 3,
          description: 'Поиск по слову "двигатель"'
        },
        {
          id: 3,
          created_at: '2022-11-15 09:00:06',
          user_id: 3,
          description: 'Выбор модификации 316300-0000485-24'
        },
        {
          id: 4,
          created_at: '2022-11-15 09:00:06',
          user_id: 3,
          description: 'Закреплен вин "XTT390995P1207149"'
        }
      ],
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
        ]
      },
      cities: [],
      regions: [],
      dealerStatus: [],
      loadingRegion: false,
      loadingCity: false,
      dealerFormData: {
        name: '',
        code: '',
        city_id: null,
        region_id: null,
        dealerTypeName: '',
        dealer_status_id: ''
      }
    }
  },
  watch: {
    'dealerFormData.city_id'(newValue) {
      if (newValue) {
        this.getCities()
      } else {
        this.cities = []
      }
    }
  },
  mounted() {
    if (this.$route.params && this.$route.params.id) {
      this.getInfo(this.id)
    }
    this.getRegions()
    this.getStatus()
  },
  methods: {
    localeDate(vdate) {
      return (
        new Date(vdate).toLocaleDateString() +
        ' ' +
        new Date(vdate).toLocaleTimeString()
      )
    },
    dd(data) {
      console.log(data)
    },
    changeRegion(newValue) {
      this.dealerFormData.city_id = null
      if (newValue) {
        this.getCities()
      }
    },
    async getStatus() {
      const res = await request({
        url: '/dealerstatus/',
        method: 'get',
        params: {
          limit: 50
        }
      })
      this.dealerStatus = res.data
    },
    async getCities() {
      this.loadingCity = true
      const res = await request({
        url: '/city/',
        method: 'get',
        params: {
          limit: 5000,
          region_id: this.dealerFormData.region_id
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
    },
    submitForm() {
      this.$refs['dealerEditForm'].validate(async (valid) => {
        if (valid) {
          console.log('not error submit!!')
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
            }
          }
        } else {
          console.log('error submit!!')
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
  margin: 0px 20px 0px 0;
}
.el-pagination,
.el-pagination .btn-prev,
.el-pagination .btn-next {
  float: right;
}
.el-form-item.el-form-item--medium {
  height: 72px;
}
</style>
