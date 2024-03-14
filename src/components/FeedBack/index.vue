<template>
  <div>
    <el-table
      v-loading="listLoading"
      class="table_sample break_word"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="ФИО" width="250">
        <template #default="scope">
          {{ scope.row.user_lname }} {{ scope.row.user_fname }}
          {{ scope.row.user_mname }}
        </template>
      </el-table-column>
      <el-table-column label="E-mail" width="200">
        <template #default="scope">
          {{ scope.row.user_email }}
        </template>
      </el-table-column>
      <el-table-column label="Дата" width="145">
        <template #default="scope">
          {{ $utcDate(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="Сообщение">
        <template #default="scope">
          {{ scope.row.email_message }}
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      layout="total, prev, pager, next"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      :page-size="100"
      :auto-scroll="false"
      background
      @pagination="getList"
    />
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import request from '@/utils/request'
import Pagination from '@/components/Pagination'
export default {
  name: 'FeedBack',
  components: { Pagination },
  props: {
    editMode: {
      type: Boolean,
      default() {
        return true
      }
    },
    dealerId: {
      type: Number,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      const res = await request({
        url: '/emails/',
        method: 'get',
        params: {
          page: this.listQuery.page,
          dealer_id: this.dealerId
        }
      })
      this.list = res.data
      this.total = res.total
      this.listQuery.page = res.current_page
      this.listQuery.limit = res.per_page
      this.listLoading = false
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

<style scoped></style>
