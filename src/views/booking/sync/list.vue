<template>
  <div v-if="dealerID" class="app-container booking-history">
    <filterSelect
      v-model="currentFilter"
      show-search
      search-placeholder="Название/номер/код"
      @SearchOnFilter="getList"
    />
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="bookingImportLog_id" width="150">
        <template #default="scope">
          {{ scope.row.bookingImportLog_id }}
        </template>
      </el-table-column>

      <el-table-column label="ID дилера" align="center" width="200">
        <template #default="scope">
          {{ scope.row.dealer_id }}
        </template>
      </el-table-column>

      <el-table-column label="ID пользователя" align="center" width="200">
        <template #default="scope">
          {{ scope.row.user_id }}
        </template>
      </el-table-column>

      <el-table-column label="Статус" align="center" width="200">
        <template #default="scope">
          {{ scope.row.status }}
        </template>
      </el-table-column>

      <el-table-column label="Обновлено" align="center" width="200">
        <template #default="scope">
          {{ $localeDate(scope.row.updated_at) }}
        </template>
      </el-table-column>

      <el-table-column label="Создано" align="center" width="200">
        <template #default="scope">
          {{ $localeDate(scope.row.created_at) }}
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        width="60"
        class-name="mini-padding fixed-width button-tooltip"
      >
        <template #header> JSON </template>
        <template #default="scope">
          <el-tooltip
            class="box-item"
            effect="light"
            placement="top-start"
            content="Открыть файл"
            popper-class="uaz__tooltip uaz__tooltip-left"
          >
            <el-button
              size="mini"
              class="el-button-icon"
              @click="openFile(scope.row.filename)"
            >
              <i class="el-icon-folder" />
            </el-button>
          </el-tooltip>
          <el-dialog title="JSON" :visible.sync="dialogTableVisible" center>
            <json-viewer
              :value="jsonData"
              :expand-depth="5"
              theme="my-awesome-json-theme"
              copyable
              sort
            />
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      layout="prev, pager, next"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
  <div v-else class="app-container">
    Учетная запись не привязана. Обратитесь в тех. поддержку support@elis.uaz.ru
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import request from '@/utils/request'
import filterSelect from '@/components/Header/filter'
import JsonViewer from 'vue-json-viewer'
import store from '@/store'

export default {
  name: 'SyncList',
  components: { Pagination, filterSelect, JsonViewer },

  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      storage: process.env.VUE_APP_BACKEND_HOST + '/storage/',
      tempData: {},
      activeRow: null,
      currentFilter: {
        filter: ''
      },
      dialogTableVisible: false,
      jsonData: {},
      dealerID: ''
    }
  },
  computed: {
    ...mapGetters(['role_name'])
  },
  created() {
    this.dealerID = store.state.user.dealer_id
    this.getList()
  },
  methods: {
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
    async openFile(urlFile) {
      const test = await this.getJson(urlFile)
      this.jsonData = test
      this.dialogTableVisible = true
    },
    async getJson(urlFile) {
      const res = await request({
        url: this.storage + urlFile,
        method: 'get'
      })
      const data = await res.data
      if (data != null) return data
      else return res
    }
  }
}
</script>
<style type="scss">
/*шапка*/
.app-container .el-dialog__header {
  height: 60px;
  background-color: #cfdbd9;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  text-transform: uppercase;
  color: #003d2d;
}
</style>
