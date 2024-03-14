<template>
  <div class="app-container">
    <el-row>
      <div class="box">
        <el-card class="box-card">
          <template #header>
            <h4
              class="card-header"
              style="
                text-transform: uppercase;
                font-weight: 600;
                justify-content: center;
              "
            >
              Запчасти в дилерской, отсутствующие или заблокированные в Инкадеа
            </h4></template
          >
          <el-row> Итого: {{ total }} </el-row>
        </el-card>
      </div>
    </el-row>

    <el-row>
      <filterSelect
        v-model="currentFilter"
        :show-search="true"
        :show-select-section-status="true"
        :is-multiple="false"
        :show-select-section="isShowSelectSection"
        :show-button-xls="false"
        search-placeholder="Наименование детали/артикул"
        @SearchOnFilter="searchList"
        @input="searchList"
        @onFilterChangeStatus="filterChangeStatus"
        @onHandleBtnXsl="downloadAnalisisReport"
      />
    </el-row>

    <el-table
      v-model="activeRow"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      :default-sort="{ prop: 'status', order: 'ascending' }"
      @sort-change="sortChange"
    >
      <el-table-column label="Номер детали" width="200">
        <template #default="scope">
          <el-tooltip
            class="box-item"
            effect="light"
            placement="top-start"
            content="Перейти в ЭЛИС"
            popper-class="uaz__tooltip uaz__tooltip-left"
          >
            <a
              :href="`https://elis.uaz.ru/?elis.uaz=parts-search#search:${scope.row.part_code};pageNumber:1;`"
              target="_blank"
              style="text-decoration: underline; align-self: center"
              >{{ scope.row.part_code }}</a
            >
          </el-tooltip>

          <el-tooltip
            class="box-item"
            effect="light"
            placement="top-start"
            content="Скопировать"
            popper-class="uaz__tooltip uaz__tooltip-left"
          >
            <el-button
              size="mini"
              type="primary"
              class="el-icon-document"
              style="margin-left: auto; align-self: center"
              @click="handleCopy(scope.row.part_code, $event)"
            >
              <!-- <i class="el-icon-document" /> -->
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="Наименование">
        <template #default="scope">
          {{ scope.row.part_name }}
        </template>
      </el-table-column>

      <el-table-column
        label="Время в обработке"
        :sortable="'custom'"
        width="175"
        prop="time"
        column-key="time"
      >
        <template #default="scope">
          {{ formatTime(scope.row.created_at) }}</template
        >
      </el-table-column>

      <el-table-column
        label="Статус"
        prop="status"
        column-key="status"
        :sortable="'custom'"
        width="170"
      >
        <template #default="scope">
          {{ transformStatus(scope.row.status) }}
        </template>
      </el-table-column>

      <el-table-column width="90" class-name="mini-padding fixed-width">
        <!-- <template #default="scope"> -->
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
            class="box-item"
            effect="light"
            placement="top-start"
            content="История"
            popper-class="uaz__tooltip uaz__tooltip-left"
          >
            <el-button
              size="mini"
              class="el-icon-notebook-1"
              @click="showModalHistoryElement(scope.$index, scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <edit-part-dialog
      v-if="isOpen"
      v-model="activeRow"
      :open.sync="isOpen"
      @update:status="updateValue"
    />
    <history-dialog v-model="activeRow" :open.sync="dialogFormVisibleHistory" />
    <!-- Стандартный блок пагинации -->
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
import request from '@/utils/request'
import editPartDialog from '@/views/productportfolio/analysisofblocked/editPartDialog'
import historyDialog from '@/views/productportfolio/analysisofblocked/historyDialog'
import filterSelect from '@/components/Header/filter'
import Pagination from '@/components/Pagination'
import clip from '@/utils/clipboard' // use clipboard directly
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive
export default {
  name: 'RequestList',
  components: { Pagination, filterSelect, editPartDialog, historyDialog },
  directives: {
    clipboard
  },
  data() {
    return {
      currentFilter: {},
      isStatus: '',
      optionsStatus: [
        {
          value: 'null',
          label: 'К исполнению'
        },
        {
          value: 'wait',
          label: 'Ожидает добавления в прайс'
        },
        {
          value: 'executed',
          label: 'Обработано'
        },
        {
          value: 'declined',
          label: 'Отклонено'
        }
      ],
      list: null,
      total: 0,
      sortField: 'status',
      sortDirection: 'ascending',
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20
        // sort: '+id'
      },
      isOpen: false,
      selectedPart: 0,
      dialogFormVisible: false,
      isShowSelectSection: false,
      historible_id: null,
      historible_type: null,
      dialogFormVisibleHistory: false,
      rowData: {
        tool_name: '',
        tool_image: '',
        tool_code: '',
        tool_comment: '',
        toolType_id: 1
      },
      activeRow: null,
      filter: '',
      selectListClick: '',
      selectListClickStatus: '',
      selectListClickLanguage: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true

      const params = {
        page: this.listQuery.page,
        limit: 100,
        status: this.isStatus || '',
        sort_field: this.sortField,
        sort_direction: this.sortDirection
      }
      if (this.currentFilter.filter) {
        params.filter = this.currentFilter.filter
      }
      const res = await request({
        url: '/partanalysisblocked',
        method: 'get',
        params
      })
      this.list = res.data
      this.total = res.total
      this.listQuery.page = res.current_page
      this.listQuery.limit = res.per_page
      this.listLoading = false
    },
    transformStatus(status) {
      switch (status) {
        case 'null':
          return 'К исполнению'
        case 'wait':
          return 'Ожидает добавления в прайс'
        case 'executed':
          return 'Обработано'
        case 'declined':
          return 'Отклонено'
        default:
          return 'К исполнению'
      }
    },
    async downloadAnalisisReport() {
      // const res = await request({
      //   url: '/partanalysisblocked/xls',
      //   method: 'get',
      //   responseType: 'blob',
      //   params: this.vm
      // })
      // window.open(URL.createObjectURL(res))
      this.$alert('Временно недоступна', 'Ссылка для скачивания файла', {
        confirmButtonText: 'Готово'
      })
    },
    searchList() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      this.listQuery.page = 1
      this.sortField = data.prop
      this.sortDirection = data.order
      this.getList()
    },

    showModalHistoryElement(index, row) {
      this.activeRow = row
      this.dialogFormVisibleHistory = !this.dialogFormVisibleHistory
    },
    formatTime(dateTime) {
      const dateTimePart = new Date(dateTime)
      const now = new Date()

      if (
        Math.round((now.getTime() - dateTimePart.getTime()) / 3600000) <= 24
      ) {
        return '0 дней'
      } else if (
        Math.round((now.getTime() - dateTimePart.getTime()) / 3600000) > 24
      ) {
        return (
          Math.floor(
            Math.round(now.getTime() - dateTimePart.getTime()) / 3600000 / 24
          ) + ' дней'
        )
      }
    },
    handleCopy(text, event) {
      clip(text, event)
      this.$message({
        message: 'Номер детали успешно скопирован.',
        type: 'success'
      })
    },
    showModalEditElement(index, row) {
      this.activeRow = row
      this.isOpen = !this.isOpen
    },
    filterChangeStatus(e) {
      this.selectListClickStatus = e
      this.isStatus = e
      this.searchList()
    },
    updateValue(v) {
      this.activeRow.status = this.transformStatus(v)
      this.searchList()
    }
  }
}
</script>

<style></style>
