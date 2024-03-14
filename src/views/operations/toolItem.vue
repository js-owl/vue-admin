<template>
  <div class="app-container">
    <div class="tool_item">
      <filterSelect
        v-model="currentFilter"
        class="tool_item_flex"
        show-search
        search-placeholder="Введите название"
        @SearchOnFilter="searchList"
      />
      <el-button
        class="el_button_save_modal tool_item_flex"
        type="primary"
        @click="isOpen = true"
      >
        Добавить
      </el-button>
    </div>
    <el-table
      ref="toolsTable"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      row-key="tool_id"
      @select="handleSelectionChange"
    >
      <el-table-column type="selection" width="35" :reserve-selection="true" />
      <el-table-column prop="tool_name" label="" />
    </el-table>
    <!-- Add new tools item  -->
    <equipment-add-dialog
      v-if="url === '/tools/equipment/'"
      :open.sync="isOpen"
      :data.sync="tempData2"
      @saveData="saveModalData"
    />
    <general-add-dialog
      v-if="url === '/tools/general/'"
      :open.sync="isOpen"
      :data.sync="tempData4"
      @saveData="saveModalData"
    />
    <special-add-dialog
      v-if="url === '/tools/special/'"
      :open.sync="isOpen"
      :data.sync="tempData1"
      @saveData="saveModalData"
    />
    <material-add-dialog
      v-if="url === '/tools/material/'"
      :open.sync="isOpen"
      :data.sync="tempData3"
      @saveData="saveModalData"
    />
    <pagination
      v-show="total > 0"
      layout="prev, pager, next"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="handlePagination"
    />
  </div>
</template>

<script>
import request from '@/utils/request'
import filterSelect from '@/components/Header/filter'
import Pagination from '@/components/Pagination'

import EquipmentAddDialog from '@/components/Dialog/EquipmentAddDialog'
import GeneralAddDialog from '@/components/Dialog/GeneralAddDialog'
import SpecialAddDialog from '@/components/Dialog/SpecialAddDialog'
import MaterialAddDialog from '@/components/Dialog/MaterialAddDialog'

export default {
  components: {
    filterSelect,
    Pagination,
    EquipmentAddDialog,
    GeneralAddDialog,
    SpecialAddDialog,
    MaterialAddDialog
  },
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    url: { type: String, default: '' }
  },
  data() {
    return {
      list: [],
      total: 0,
      listQuery: { page: 1, limit: 20 },
      listLoading: true,

      currentFilter: {
        filter: ''
      },
      isOpen: false,
      tempData1: {
        // special
        tool_name: '',
        tool_image: '',
        tool_code: '',
        tool_comment: '',
        toolType_id: 1
      },
      tempData2: {
        // equipment
        tool_name: '',
        tool_image: '',
        toolType_id: 2
      },
      tempData3: {
        // material
        tool_name: '',
        tool_image: '',
        toolType_id: 3
      },
      tempData4: {
        // general
        tool_name: '',
        toolType_id: 4
      },
      selectedTools: []
    }
  },
  created() {
    this.selectedTools = [...this.selectedTools, ...this.value]
    this.getList().then(() => {
      this.toggleSelection()
    })
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
        url: this.url,
        method: 'get',
        params
      })
      this.list = res.data
      this.total = res.total
      this.listQuery.page = res.current_page
      this.listQuery.limit = res.per_page
      this.listLoading = false
    },
    handleSelectionChange(v, row) {
      const cond = this.isInArray(row.tool_id, this.selectedTools)
      if (cond) {
        this.selectedTools = this.selectedTools.filter(
          (x) => x.tool_id !== row.tool_id
        )
      } else {
        this.selectedTools.push(row)
      }
      this.$emit('input', this.selectedTools)
      this.toggleSelection()
    },
    searchList() {
      this.listQuery.page = 1
      this.getList()
    },
    saveModalData() {
      this.getList()
    },
    toggleSelection() {
      this.$refs['toolsTable'].clearSelection()
      this.list.forEach((row) => {
        this.selectedTools.forEach((sel) => {
          if (row.tool_id === sel.tool_id) {
            this.$refs['toolsTable'].toggleRowSelection(row, undefined)
          }
        })
      })
    },
    isInArray(id, arr) {
      if (arr.some((e) => e.tool_id === id)) {
        return true
      }
      return false
    },
    handlePagination() {
      this.getList().then(() => {
        this.toggleSelection()
      })
    }
  }
}
</script>

<style scoped>
.tool_item {
  margin: 0;
  display: flex;
  align-items: flex-end;
}
.tool_item_flex {
  margin: 0 10px 10px 0;
}
</style>
