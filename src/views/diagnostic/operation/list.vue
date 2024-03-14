<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="Операция">
        <template #default="scope">
          {{ scope.row.diagnosticOperation_action }}
        </template>
      </el-table-column>

      <el-table-column label="Вопрос">
        <template #default="scope">
          {{ scope.row.diagnosticOperation_question }}
        </template>
      </el-table-column>

      <el-table-column
        align="right"
        width="90"
        class-name="mini-padding fixed-width button-tooltip"
      >
        <template #header>
          <router-link :to="'/diagnostic/operation/edit/'">
            <el-button size="mini" type="primary">Добавить</el-button>
          </router-link>
        </template>
        <template #default="scope">
          <router-link
            :to="
              '/diagnostic/operation/edit/' + scope.row.diagnosticOperation_id
            "
          >
            <el-tooltip
              class="box-item"
              effect="light"
              placement="top-start"
              content="Редактировать"
              popper-class="uaz__tooltip uaz__tooltip-left"
            >
              <el-button
                size="mini"
                class="el-button-icon"
              >
                <i class="el-icon-edit" />
              </el-button>
            </el-tooltip>
          </router-link>
          <el-popconfirm
            confirm-button-text="Да"
            cancel-button-text="Нет, спасибо"
            title="Подтверждаете удаление?"
            @onConfirm="deleteRow(scope.$index, scope.row)"
          >
            <template #reference>
              <el-tooltip
                class="box-item"
                effect="light"
                placement="top-start"
                content="Удалить"
                popper-class="uaz__tooltip uaz__tooltip-left"
              >
                <el-button
                  size="mini"
                  class="el-button-icon danger"
                >
                  <i class="el-icon-delete" />
                </el-button>
              </el-tooltip>
            </template>
          </el-popconfirm>
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
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import request from '@/utils/request'

export default {
  name: 'DiagnosticOperationList',
  components: { Pagination },

  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      dialogFormVisible: false,
      tempData: {},
      activeRow: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const res = await request({
        url: '/diagnostic_operations',
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
    },
    createRow() {
      this.tempData = {}
      this.dialogFormVisible = true
    },
    editRow(index, row) {
      this.activeRow = row
      this.tempData = Object.assign({}, row)
      this.dialogFormVisible = true
    },
    async deleteRow(index, row) {
      const res = await request({
        url: '/actions/' + row.action_id,
        method: 'delete'
      })
      if (res) {
        this.$notify({
          title: 'Успешно!',
          message: 'Данные успешно удалены',
          type: 'success',
          duration: 5000
        })
        this.list.splice(index, 1)
      }
    },
    saveModalData($type) {
      if ($type === 'update') {
        Object.assign(this.activeRow, this.tempData)
      }
      if ($type === 'create') {
        this.getList()
      }
    }
  }
}
</script>
<style>
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
