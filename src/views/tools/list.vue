<template>
  <div class="app-container">
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
      <el-table-column label="Изображение" width="125" align="center">
        <template #default="scope">
          <el-image
            style="width: 100px; height: 50px"
            :src="storage + scope.row.tool_image"
            fit="scale-down"
          />
        </template>
      </el-table-column>
      <el-table-column label="Название">
        <template #default="scope">
          {{ scope.row.tool_name }}
        </template>
      </el-table-column>
      <el-table-column
        align="right"
        width="170"
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
              @click="showModalEditElement(scope.$index, scope.row)"
            >
              <i class="el-icon-edit" />
            </el-button>
          </el-tooltip>

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
    <equipment-add-dialog
      :open.sync="dialogFormVisible"
      :data.sync="rowData"
      @saveData="saveModalData"
    />

    <history-dialog
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
import { mapGetters } from 'vuex'
import request from '@/utils/request'
import EquipmentAddDialog from '@/components/Dialog/EquipmentAddDialog'
import HistoryDialog from '@/components/Dialog/HistoryDialog'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import filterSelect from '@/components/Header/filter'

export default {
  name: 'ToolsList',
  components: { EquipmentAddDialog, HistoryDialog, Pagination, filterSelect },

  data() {
    return {
      list: null,
      historible_id: null,
      historible_type: null,
      total: 0,
      storage: process.env.VUE_APP_BACKEND_HOST + '/storage/',
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
      rowData: {
        tool_name: '',
        tool_name_en: '',
        tool_name_es: '',
        tool_image: '',
        toolType_id: 2
      },
      activeRow: null
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
        url: '/tools/equipment',
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
      this.rowData = {
        tool_name: '',
        tool_image: '',
        toolType_id: 2
      }
      this.showModalEditElement(null, null)
    },
    showModalEditElement(index, row) {
      this.activeRow = row
      Object.assign(this.rowData, row)
      if (this.$refs['toolForm']) {
        this.$refs['toolForm'].clearValidate()
      }
      this.dialogFormVisible = !this.dialogFormVisible
    },
    showModalHistoryElement(index, row) {
      this.dialogFormVisibleHistory = !this.dialogFormVisibleHistory
      this.historible_id = row.tool_id
      this.historible_type = 'tool'
    },
    async deleteRow(index, row) {
      const res = await request({
        url: '/tools/' + row.tool_id,
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
    saveModalData() {
      this.getList()
    }
  }
}
</script>

<style>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
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
