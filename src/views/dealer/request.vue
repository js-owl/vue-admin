<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      class="table_sample break_word card_user_index"
      :data="list"
      border
      fit
      height="calc(100vh - 170px)"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="ФИО" min-width="100">
        <template #default="scope">
          {{ scope.row.user_lname }} {{ scope.row.user_fname }}
          {{ scope.row.user_mname }}
        </template>
      </el-table-column>
      <el-table-column label="Компания" min-width="100">
        <template #default="scope">
          {{ scope.row.user_company }}
        </template>
      </el-table-column>
      <el-table-column label="Телефон" width="110">
        <template #default="scope">
          {{ scope.row.user_phone }}
        </template>
      </el-table-column>
      <el-table-column label="E-mail" width="250">
        <template #default="scope">
          {{ scope.row.user_email }}
        </template>
      </el-table-column>
      <el-table-column label="Дата регистрации" width="145">
        <template #default="scope">
          {{ $utcDate(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="Статус" width="105">
        <template #default="scope">
          {{ getRegStateLabel(scope.row.user_regState) }}
        </template>
      </el-table-column>
      <el-table-column
        align="right"
        width="50"
        class-name="mini-padding"
      >
        <template #default="scope">
          <router-link :to="'/user/editRequest/' + scope.row.user_id">
            <el-tooltip
              class="box-item"
              effect="light"
              placement="top-start"
              content="Редактировать"
              popper-class="uaz__tooltip uaz__tooltip-left"
            >
              <el-button size="mini" class="el-button-icon">
                <i class="el-icon-edit" />
              </el-button>
            </el-tooltip>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > listQuery.limit"
      layout="total, prev, pager, next"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      :auto-scroll="false"
      @pagination="getList"
    />
  </div>
</template>

<script>
import request from '@/utils/request'
import Pagination from '@/components/Pagination'

export default {
  name: 'DealerListRequest',
  components: {
    Pagination
  },
  data() {
    const currentFilter = {
      filter: ''
    }
    return {
      currentFilter,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 25
      },
      filter: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getRegStateLabel(state) {
      switch (state) {
        case 'declined':
          return 'Отклонена'
        case 'agreed':
          return 'Согласована'
        default:
          return 'Ожидает согласования'
      }
    },
    async getList() {
      const params = {
        page: this.listQuery.page
      }
      const res = await request({
        url: '/user/request',
        method: 'get',
        params
      })
      this.list = res.data
      this.total = res.total
      this.listQuery.page = res.current_page
      this.listQuery.limit = res.per_page
      this.listLoading = false
    }
  }
}
</script>

<style>
</style>
