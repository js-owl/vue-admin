<template>
  <el-dialog
    :visible="open"
    width="70%"
    title="История"
    @open="getHistory"
    @update:visible="$emit('update:open', $event)"
  >
    <slot name="default" />
    <el-table
      v-loading="listLoading"
      :data="historyList"
      border
      fit
      highlight-current-row
      style="width: 100%; max-height: 100%; overflow: auto"
    >
      <el-table-column
        v-for="(column, index) in columns"
        :key="index"
        :prop="column.prop"
        :label="column.label"
        :formatter="column.formatter"
      >
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'HistoryDialog',
  props: {
    value: {
      type: Object,
      default: null
    },
    open: { type: Boolean, default: false }
  },
  data() {
    return {
      historyList: null,
      listLoading: false,
      columns: [
        { prop: 'fio', label: 'ФИО' },
        {
          prop: 'status',
          label: 'Статус',
          formatter: (row, col, cell, index) => this.transformStatus(cell)
        },
        { prop: 'comment', label: 'Комментарий' },
        {
          prop: 'created_at',
          label: 'Дата',
          formatter: (row, col, cell, index) => this.localeDate(cell)
        }
      ]
    }
  },
  mounted() {
    if (this.value) {
      this.getHistory()
    }
  },
  methods: {
    async getHistory() {
      this.listLoading = true
      this.historyList = []
      const res = await request({
        url: '/partanalysisblocked/getInfoOfPartID/' + this.value.part_id,
        method: 'get'
      })
      if (res.history) this.historyList = res.history

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
    localeDate(vdate) {
      return (
        new Date(vdate).toLocaleDateString() +
        ' ' +
        new Date(vdate).toLocaleTimeString()
      )
    }
  }
}
</script>
