<template>
  <div class="app-container">
    <el-table :row-class-name="tableRowClassName" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label="Код норматива" width="200">
        <template #default="scope">
          {{ scope.row.laborTime_code }}
        </template>
      </el-table-column>
      <el-table-column label="№ Группы" width="200">
        <template #default="scope">
          {{ scope.row.structureFlowChart_path }}
        </template>
      </el-table-column>
      <el-table-column label="Наименование группы">
        <template #default="scope">
          {{ scope.row.structureFlowChart_name }}
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" layout="prev, pager, next" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import request from '@/utils/request'
export default {
  name: 'StructureLaborTimeList',
  components: { Pagination },
  data() {
    const tableRowClassName = ({
      row,
      rowIndex
    }) => {
      if (row.lt_count === 0) {
        return 'warning-row'
      }
      return ''
    }
    return {
      tableRowClassName,
      list: null,
      total: 0,
      storage: process.env.VUE_APP_BACKEND_HOST + '/storage/',
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      dialogFormVisible: false,
      dialogFormMode: 'update',
      rowData: {
        modificationGroup_name: '',
        modificationGroup_original_name: ''
      },
      activeRow: null
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
        url: '/structureflowchartlabortimecode',
        method: 'get',
        params: {
          page: this.listQuery.page,
          limit: 10000
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
