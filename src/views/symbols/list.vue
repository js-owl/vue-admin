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
      <el-table-column label="Вид" width="240">
        <template #default="scope">
          {{ scope.row.symbolType_name }}
        </template>
      </el-table-column>
      <el-table-column label="Название">
        <template #default="scope">
          {{ scope.row.symbol_name }}
        </template>
      </el-table-column>
      <el-table-column label="Изображение" width="125" align="center">
        <template #default="scope">
          <el-image
            style="width: 100px; height: 50px"
            :src="storage + scope.row.symbol_image"
            fit="scale-down"
          />
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
              @click="showModalEditElement(scope.$index, scope.row)"
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
    <symbol-dialog
      :open.sync="dialogFormVisible"
      :data.sync="tempData"
      @saveData="saveModalData"
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
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import request from '@/utils/request'
import SymbolDialog from '@/components/Dialog/SymbolDialog'
import filterSelect from '@/components/Header/filter'

export default {
  name: 'SymbolsList',
  components: { Pagination, SymbolDialog, filterSelect },
  data() {
    return {
      list: null,
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
      tempData: {
        symbol_name: '',
        symbol_name_en: '',
        symbol_name_es: '',
        symbol_image: '',
        symbolType_id: ''
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
        url: '/symbols',
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
      this.tempData = {
        symbol_name: '',
        symbol_image: '',
        symbolType_id: ''
      }
      this.showModalEditElement(null, null)
    },
    showModalEditElement(index, row) {
      this.activeRow = row
      Object.assign(this.tempData, row)
      this.dialogFormVisible = !this.dialogFormVisible
    },
    async deleteRow(index, row) {
      const res = await request({
        url: '/symbols/' + row.symbol_id,
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
