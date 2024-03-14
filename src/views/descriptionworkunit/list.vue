<template>
  <div class="app-container">
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
          <i
            v-if="scope.row.action_isClearances"
            class="el-icon-check"
            style="margin: 0 auto"
          />
        </template>
      </el-table-column>

      <el-table-column
        label="Указать момент затяжки"
        align="center"
        width="200"
      >
        <template #default="scope">
          <i
            v-if="scope.row.action_isTorque"
            class="el-icon-check"
            style="margin: 0 auto"
          />
        </template>
      </el-table-column>

      <el-table-column
        align="right"
        width="250"
        class-name="mini-padding fixed-width button-tooltip"
      >
        <template #header>
          <el-button size="mini" type="primary" @click="createRow"
            >Добавить</el-button
          >
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
          <!--!!!Копирование - не сделано-->
          <el-tooltip
            class="box-item"
            effect="light"
            placement="top-start"
            content="Скопировать"
            popper-class="uaz__tooltip uaz__tooltip-left"
          >
            <el-button
              size="mini"
              class="el-button-icon"
              @click="editRow(scope.$index, scope.row, 'copy')"
            >
              <i class="el-icon-document-copy" />
            </el-button>
          </el-tooltip>
          <el-tooltip
            class="box-item"
            effect="light"
            placement="top-start"
            content="Предварительный просмотр"
            popper-class="uaz__tooltip uaz__tooltip-left"
          >
            <el-button size="mini" class="el-button-icon">
              <i class="el-icon-view" />
            </el-button>
          </el-tooltip>
          <el-tooltip
            class="box-item"
            effect="light"
            placement="top-start"
            content="Скачать"
            popper-class="uaz__tooltip uaz__tooltip-left"
          >
            <el-button size="mini" class="el-button-icon">
              <i class="el-icon-download" />
            </el-button>
          </el-tooltip>
          <el-tooltip
            class="box-item"
            effect="light"
            placement="top-start"
            content="История"
            popper-class="uaz__tooltip uaz__tooltip-left"
          >
            <el-button
              size="mini"
              class="el-button-icon"
              @click="showModalHistoryElement(scope.$index, scope.row)"
            >
              <i class="el-icon-notebook-1" />
            </el-button>
          </el-tooltip>
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
                <el-button size="mini" class="el-button-icon danger">
                  <i class="el-icon-delete" />
                </el-button>
              </el-tooltip>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <dialog-f
      :show-dialog.sync="dialogFormVisibleHistory"
      :hide-button="true"
      width="70%"
      title="История"
      @closeDialog="dialogFormVisibleHistory = false"
    >
      <el-table
        v-loading="listLoading"
        :data="historyList"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="ФИО">
          <template #default="scope">
            {{ scope.row.fio }}
          </template>
        </el-table-column>
        <el-table-column label="Действие">
          <template #default="scope">
            {{ scope.row.historyAction_name }}
          </template>
        </el-table-column>
        <el-table-column label="Дата">
          <template #default="scope">
            {{ localeDate(scope.row.history_time) }}
          </template>
        </el-table-column>
      </el-table>
    </dialog-f>
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
import ActionDialog from '@/components/Dialog/ActionDialog'
import DialogF from '@/components/Dialog/DialogF'
import filterSelect from '@/components/Header/filter'

export default {
  name: 'DescriptionworkunitList',
  components: { Pagination, ActionDialog, DialogF, filterSelect },

  data() {
    return {
      list: null,
      historyList: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      currentFilter: {
        filter: ''
      },
      dialogFormVisible: false,
      dialogFormVisibleHistory: false,
      tempData: {},
      activeRow: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    localeDate(vdate) {
      return (
        new Date(vdate).toLocaleDateString() +
        ' ' +
        new Date(vdate).toLocaleTimeString()
      )
    },
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
      this.listQuery.page = res.from
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
    async getHistory(row) {
      const res = await request({
        url: '/histories',
        method: 'get',
        params: {
          page: this.listQuery.page,
          historible_id: row.tool_id,
          historible_type: 'tool'
        }
      })
      this.historyList = res.data
    },
    showModalHistoryElement(index, row) {
      this.dialogFormVisibleHistory = !this.dialogFormVisibleHistory
      this.getHistory(row)
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
