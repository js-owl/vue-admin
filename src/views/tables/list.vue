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
      <el-table-column label="Название">
        <template #default="scope">
          {{ scope.row.tables_name }}
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
    <pagination
      v-show="total > 0"
      layout="prev, pager, next"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <table-dialog :open.sync="isModalOpen" :data.sync="modalData" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import request from '@/utils/request'
import TableDialog from '@/components/Dialog/TableDialog'
import filterSelect from '@/components/Header/filter'

export default {
  name: 'TablesList',
  components: { TableDialog, Pagination, filterSelect },
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
      isModalOpen: false,
      modalData: {
        tables_name: '',
        tables_name_en: '',
        tables_name_es: '',
        tables_description: '',
        tables_description_en: '',
        tables_description_es: ''
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
        url: '/tables',
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
      this.modalData = {
        tables_name: '',
        tables_description: ''
      }
      this.showModalEditElement(null, null)
    },
    showModalEditElement(index, row) {
      this.activeRow = row
      Object.assign(this.modalData, row)
      if (this.$refs['tablesForm']) {
        this.$refs['tablesForm'].clearValidate()
      }
      this.isModalOpen = !this.isModalOpen
    },
    async deleteRow(index, row) {
      const res = await request({
        url: '/tables/' + row.tables_id,
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
