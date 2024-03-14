<template>
  <div class="app-container dealer_list_card">
    <filterSelect
      v-model="currentFilter"
      show-search
      search-placeholder="Название/Код CRM/Город"
      @SearchOnFilter="searchList"
    />
    <div class="dealer_list_select dealer_list_select_all">
      <div class="dealer_list_select">
        <p>Статус</p>
        <status-dealer
          v-model="currentFilter.dealerStatus_id"
          @input="getList"
        />
      </div>
      <div class="dealer_list_select">
        <p>Тип</p>
        <type-dealer v-model="currentFilter.dealerTypeName" @input="getList" />
      </div>
      <div class="dealer_list_select">
        <p>Экспорт</p>
        <export-dealer v-model="currentFilter.isExport" @input="getList" />
      </div>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="Код CRM" width="100">
        <template #default="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>

      <el-table-column label="Наименование">
        <template #default="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column label="Город" width="200">
        <template #default="scope">
          {{ scope.row.city_name }}
        </template>
      </el-table-column>
      <el-table-column label="Экспорт" width="80">
        <template #default="scope">
          {{ scope.row.isExport ? 'Да' : 'Нет' }}
        </template>
      </el-table-column>
      <el-table-column label="Тип дилера" width="130">
        <template #default="scope">
          {{ scope.row.dealerTypeName }}
        </template>
      </el-table-column>

      <el-table-column label="Статус дилера" width="250">
        <template #default="scope">
          {{ scope.row.dealerStatus_name }}
        </template>
      </el-table-column>

      <el-table-column
        align="right"
        width="90"
        class-name="mini-padding fixed-width button-tooltip"
      >
        <template #header>
          <router-link :to="'/dealer/edit/'">
            <el-button size="mini" type="primary">Добавить</el-button>
          </router-link>
        </template>
        <template #default="scope">
          <router-link :to="'/dealer/edit/' + scope.row.dealer_id">
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
import filterSelect from '@/components/Header/filter'
import typeDealer from '@/views/dealer/typeDealer'
import statusDealer from '@/views/dealer/statusDealer'
import exportDealer from '@/views/dealer/exportDealer'

export default {
  name: 'DealerList',
  components: {
    Pagination,
    filterSelect,
    typeDealer,
    statusDealer,
    exportDealer
  },
  data() {
    const currentFilter = {
      filter: ''
    }
    return {
      currentFilter,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      filter: ''
    }
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
      if (this.currentFilter.dealerTypeName) {
        params.dealerTypeName = this.currentFilter.dealerTypeName
      }
      if (this.currentFilter.dealerStatus_id) {
        params.dealerStatus_id = this.currentFilter.dealerStatus_id
      }
      if (this.currentFilter.isExport !== undefined) {
        params.isExport = this.currentFilter.isExport
      }
      params.isBlocked = false
      const res = await request({
        url: '/dealer/',
        method: 'get',
        params
      })
      this.list = res.data
      this.total = res.total
      this.listQuery.page = res.current_page
      this.listQuery.limit = res.per_page
      this.listLoading = false
    },
    async deleteRow(index, row) {
      const res = await request({
        url: '/dealer/' + row.dealer_id,
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
    searchList() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>

<style>
.dealer_list_select {
  display: inline-block;
  margin: 0 10px 0 0;
}
.dealer_list_select_all {
  margin-bottom: 17px;
}
.dealer_list_select p {
  font-size: 12px;
  color: #606266;
  font-weight: 700;
  margin-bottom: 5px;
  font-size: 14px;
}
</style>
