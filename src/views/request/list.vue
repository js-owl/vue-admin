<template>
  <div class="app-container">
    <filterSelect
      v-model="currentFilter"
      :show-select-section-status="true"
      :show-filter="true"
      :show-search="true"
      :show-button="true"
      :show-lang="true"
      :filter-show-select-section="currentFilter.sections"
      :filter-show-select-status="currentFilter.status"
      :filter-show-lang="currentFilter.lang"
      @onFilterChange="filterChange"
      @onFilterChangeStatus="filterChangeStatus"
      @onFilterChangeLanguage="filterChangeLanguage"
    />
    <!--{{ currentFilter }}
    <filterSelect v-model="currentFilter" :show-select-section-status="true" :show-filter="true" :show-search="true" :show-button="false" :show-lang="false" :filter-show-select-section="currentFilter.sections" :filter-show-select-status="currentFilter.status" :filter-show-lang="currentFilter.lang" />

=======
    <filterSelect v-model="currentFilter" :show-select-section-status="true" :show-filter="true" :show-search="true" :show-button="true" :show-lang="true" :filter-show-select-section="currentFilter.sections" :filter-show-select-status="currentFilter.status" :filter-show-lang="currentFilter.lang" />
-->
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="Номер">
        <template #default="scope">
          {{ String(scope.row.request_id).padStart(6, '0') }}
        </template>
      </el-table-column>

      <el-table-column label="Статус">
        <template #default="scope">
          {{ scope.row.request_state }}
        </template>
      </el-table-column>

      <el-table-column label="Время">
        <template #default="scope"> {{ scope.row.request_id }} дней </template>
      </el-table-column>

      <el-table-column label="Название заявки">
        <template #default="scope">
          {{ scope.row.request_name }}
        </template>
      </el-table-column>

      <el-table-column
        align="right"
        width="111"
        class-name="mini-padding fixed-width"
      >
        <template #default="scope">
          <router-link :to="'/request/bid/edit/' + scope.row.request_id">
            <el-tooltip
              class="box-item"
              effect="light"
              placement="top-start"
              content="Просмотр"
              popper-class="uaz__tooltip uaz__tooltip-left"
            >
              <el-button size="mini" class="el-button-icon">
                <i class="el-icon-folder-opened" />
              </el-button>
            </el-tooltip>
          </router-link>
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
</template>

<script>
import request from '@/utils/request'
import filterSelect from '@/components/Header/filter'
import Pagination from '@/components/Pagination'
export default {
  name: 'RequestList',
  components: { Pagination, filterSelect },
  data() {
    return {
      currentFilter: {
        sections: '',
        status: '',
        lang: ''
      },
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      dialogFormVisible: false,
      rowData: {
        tool_name: '',
        tool_image: '',
        tool_code: '',
        tool_comment: '',
        toolType_id: 1
      },
      activeRow: null,
      filter: '',
      selectListClick: '',
      selectListClickStatus: '',
      selectListClickLanguage: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const res = await request({
        url: '/requests/',
        method: 'get',
        params: {
          page: this.listQuery.page,
          limit: 15
        }
      })
      this.list = res.data
      this.total = res.total
      this.listQuery.page = res.current_page
      this.listQuery.limit = res.per_page
      this.listLoading = false
    },
    showModalEditElement(index, row) {
      this.activeRow = row
      Object.assign(this.rowData, row)
      this.dialogFormVisible = !this.dialogFormVisible
    },
    filterChange(e) {
      this.selectListClick = e
      this.currentFilter.sections = e
      // console.log(e, '88888')
    },
    filterChangeStatus(e) {
      this.selectListClickStatus = e
      this.currentFilter.status = e
    },
    filterChangeLanguage(e) {
      this.selectListClickLanguage = e
      this.currentFilter.lang = e
    }
  }
}
</script>

<style></style>
