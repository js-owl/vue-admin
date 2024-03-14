<template>
  <div class="app-container action_list">
    <action-dialog
      :open.sync="dialogFormVisible"
      :data.sync="tempData"
      @saveData="saveModalData"
    />
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
      <el-table-column label="Название действия">
        <template #default="scope">
          {{ scope.row.action_name }}
        </template>
      </el-table-column>

      <el-table-column label="Указать зазор" align="center" width="200">
        <template #default="scope">
          <i v-if="scope.row.action_isClearances" class="el-icon-check" />
          <!--<el-checkbox v-model="scope.row.action_isClearances" disabled />-->
        </template>
      </el-table-column>

      <el-table-column
        label="Указать момент затяжки"
        align="center"
        width="200"
      >
        <template #default="scope">
          <i v-if="scope.row.action_isTorque" class="el-icon-check" />
          <!--<el-checkbox v-model="scope.row.action_isTorque" disabled />-->
        </template>
      </el-table-column>

      <el-table-column
        align="right"
        width="90"
        class-name="mini-padding fixed-width button-tooltip"
      >
        <template #header>
          <el-button
            v-if="role_name != 'translator'"
            size="mini"
            type="primary"
            @click="createRow"
          >
            Добавить
          </el-button>
        </template>
        <template #default="scope">
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
              @click="editRow(scope.$index, scope.row)"
            >
              <i class="el-icon-edit" />
            </el-button>
          </el-tooltip>

          <el-popconfirm
            v-if="role_name != 'translator'"
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
                <el-button size="mini" class="el-button-icon danger">
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
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import request from '@/utils/request'
import ActionDialog from '@/components/Dialog/ActionDialog'
import filterSelect from '@/components/Header/filter'

export default {
  name: 'ActionList',
  components: { Pagination, ActionDialog, filterSelect },

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
      activeRow: null,
      currentFilter: {
        filter: ''
      }
    }
  },
  computed: {
    ...mapGetters(['role_name'])
  },
  created() {
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
        url: '/actions',
        method: 'get',
        params
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
