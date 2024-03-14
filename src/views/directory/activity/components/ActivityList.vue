<template>
  <div class="dealer_edit_card dealer_activity_card">
    <filterSelect
      v-model="currentFilter"
      class="search_edit"
      show-search
      search-placeholder="VIN/Артикул/E-mail"
      @SearchOnFilter="getList"
    />
    <div class="dealer_activity_select">
      <div class="dealer_activity_select">
        <p>Выберите дату</p>
        <el-date-picker
          v-model="dayPeriod"
          type="daterange"
          range-separator="|"
          start-placeholder="Начало периода"
          format="dd.MM.yyyy"
          value-format="yyyy-MM-dd"
          end-placeholder="Конец периода"
          @change="getList"
        />
        <el-button
          v-if="showBtnExportExcel && false"
          style="margin: 0 0 20px 20px"
          type="primary"
          icon="el-icon-document"
          @click="handleDownload"
        >
          Export Excel
        </el-button>
      </div>
      <div class="dealer_activity_select">
        <activity-dealer
          v-model="currentFilter"
          @input="getList"
        />
      </div>
    </div>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-table
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column label="Описание">
            <template #default="scope">
              {{ scope.row.activity_desc }}
            </template>
          </el-table-column>
          <el-table-column label="Пользователь" width="250">
            <template #default="scope">
              {{ scope.row.user_lname }} {{ scope.row.user_fname }}
              {{ scope.row.user_mname }}
            </template>
          </el-table-column>
          <el-table-column label="Роль" width="100">
            <template #default="scope">
              {{ scope.row.role_description }}
            </template>
          </el-table-column>
          <el-table-column label="E-mail" width="250">
            <template #default="scope">
              {{ scope.row.user_email }}
            </template>
          </el-table-column>
          <el-table-column v-if="showCompany" label="Компания" width="250">
            <template #default="scope">
              {{ scope.row.user_company }}
            </template>
          </el-table-column>
          <el-table-column label="Дата" width="145">
            <template #default="scope">
              {{ $utcDate(scope.row.created_at) }}
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          layout="total, prev, pager, next"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          :auto-scroll="false"
          @pagination="getList"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import request from '@/utils/request'
import filterSelect from '@/components/Header/filter'
import activityDealer from '@/views/dealer/activityDealer'

export default {
  name: 'ActivityList',
  components: { Pagination, filterSelect, activityDealer },
  props: {
    dealerId: {
      type: Number,
      default() {
        return null
      }
    },
    showCompany: {
      type: Boolean,
      default() {
        return false
      }
    },
    showBtnExportExcel: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      currentFilter: {},
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      dayPeriod: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const params = {
        page: this.listQuery.page
      }
      if (this.currentFilter.activity_type) {
        params.activity_type = this.currentFilter.activity_type
      }
      if (this.dayPeriod) {
        params.start_date = this.currentFilter.start_date = this.dayPeriod[0]
        params.end_date = this.currentFilter.end_date = this.dayPeriod[1]
      }
      if (this.currentFilter.filter) {
        params.filter = this.currentFilter.filter
      }
      if (this.dealerId) {
        params.dealer_id = this.currentFilter.dealer_id = this.dealerId
      }
      const res = await request({
        url: '/activity',
        method: 'get',
        params
      })
      this.list = res.data
      this.total = res.total
      this.listQuery.page = res.current_page
      this.listQuery.limit = res.per_page
      this.listLoading = false
    },
    handleDownload() {
      console.log('handleDownload')
    }
  }
}
</script>

<style>
.el-table .warning-row {
  color: #e57070;
}

.dealer_activity_select {
  display: inline-block;
  margin: 0 10px 5px 0;
}
.dealer_activity_select p {
  font-size: 12px;
  color: #606266;
  font-weight: 700;
  margin-bottom: 5px;
  font-size: 14px;
}
</style>
