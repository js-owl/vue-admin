<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label="Старый номер">
        <template #default="scope">
          {{ scope.row.old_id }}
        </template>
      </el-table-column>
      <el-table-column label="Новый номер">
        <template #default="scope">
          {{ scope.row.new_id }}
        </template>
      </el-table-column>
      <el-table-column label="Дата замены">
        <template #default="scope">
          {{ scope.row.date_close | localeDate }}
        </template>
      </el-table-column>
      <el-table-column label="Дата импорта в Элис">
        <template #default="scope">
          {{ scope.row.created_at | localeDate }}
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
      background
      @pagination="getList"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import request from '@/utils/request'
// import DialogF from '@/components/Dialog/DialogF'
export default {
  name: 'ModificationGroupsList',
  components: { Pagination },
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
  created() {
    this.getList()
  },
  methods: {
    dd(data) {
      console.log(data)
    },
    async getList() {
      const res = await request({
        url: '/incadea_part_replacements',
        method: 'get',
        params: {
          page: this.listQuery.page
        }
      })
      this.list = res.data
      this.total = res.total
      this.listQuery.page = res.current_page
      this.listQuery.limit = res.per_page
      this.listLoading = false
      console.log(res)
    }
  }
}
</script>

<style>
.edit-input {
  padding-right: 100px;
}
.table-edit-column {
  margin: 5px;
}

/*модальное окно*/
.app-container .el-dialog {
  margin-top: 3vh!important;/*приподняли*/
}
.app-container .el-dialog__header {/*шапка*/
  height: 60px;
  background-color: #cfdbd9;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  text-transform: uppercase;
  color: #003d2d;
}
.el-table .warning-row {
  color: #e57070;
}
.app-container .el-dialog__body {
  height: 600px;/*фиксированная высота*/
}
</style>
