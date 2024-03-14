<template>
  <div class="app-container break_word">
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
      <el-table-column label="Операции">
        <template #default="scope">
          {{ scope.row.action_name }} {{ scope.row.action_ext }}
        </template>
      </el-table-column>

      <el-table-column label="Дополнительная информация">
        <template #default="scope">
          {{ scope.row.operation_description }}
        </template>
      </el-table-column>

      <el-table-column
        align="right"
        width="170"
        class-name="mini-padding fixed-width button-tooltip"
      >
        <template #header>
          <router-link to="/operations/edit/">
            <el-button
              v-if="role_name != 'translator'"
              size="mini"
              type="primary"
            >
              Добавить
            </el-button>
            <!-- @click="createRow"-->
          </router-link>
        </template>
        <template #default="scope">
          <router-link :to="'/operations/edit/' + scope.row.operation_id">
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

          <el-tooltip
            v-if="role_name != 'translator'"
            class="box-item"
            effect="light"
            placement="top-start"
            content="Список техкарт"
            popper-class="uaz__tooltip uaz__tooltip-left"
          >
            <el-button size="mini" class="el-button-icon">
              <i class="el-icon-tickets" />
            </el-button>
          </el-tooltip>

          <el-tooltip
            v-if="role_name != 'translator'"
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
    <!--<dialog-f
      :show-dialog.sync="dialogFormVisibleHistory"
      :hide-button="true"
      width="70%"
      title="История"
      @closeDialog="dialogFormVisibleHistory=false"
    >
      <el-table v-loading="listLoading" :data="historyList" border fit highlight-current-row style="width: 100%">
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
    </dialog-f>-->
    <HistoryDialog
      v-if="historible_id"
      :show-dialog.sync="dialogFormVisibleHistory"
      :historible_id="historible_id"
      :historible_type="historible_type"
    />
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
import { mapGetters, mapActions } from 'vuex'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import request from '@/utils/request'
import HistoryDialog from '@/components/Dialog/HistoryDialog'
import filterSelect from '@/components/Header/filter'

export default {
  name: 'OperationsList',
  components: { Pagination, HistoryDialog, filterSelect },

  data() {
    return {
      historible_id: null,
      historible_type: null,
      list: null,
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
      dialogFormVisibleHistory: false
    }
  },
  computed: {
    ...mapGetters(['role_name'])
  },
  created() {
    this.clearOperationAction()
    this.clearOperationImg()
    this.getList()
  },
  methods: {
    ...mapActions('operation', ['clearOperationAction', 'clearOperationImg']),
    async getList() {
      const params = {
        page: this.listQuery.page
      }
      if (this.currentFilter.filter) {
        params.filter = this.currentFilter.filter
      }
      const res = await request({
        url: '/operations',
        method: 'get',
        params
      })
      this.list = res.data
      this.total = res.total
      this.listQuery.page = res.current_page
      this.listQuery.limit = res.per_page
      this.listLoading = false
    },
    showModalHistoryElement(index, row) {
      this.dialogFormVisibleHistory = !this.dialogFormVisibleHistory
      this.historible_id = row.operation_id
      this.historible_type = 'operations'
    },
    async deleteRow(index, row) {
      const res = await request({
        url: '/operations/' + row.operation_id,
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
    saveModalData($type) {}
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
