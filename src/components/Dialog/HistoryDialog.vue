<template>
  <el-dialog
    :visible="showDialog"
    width="70%"
    title="История"
    @open="getHistory"
    @update:visible="$emit('update:showDialog', $event)"
  >
    <slot name="default" />
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
      <el-table-column v-if="historible_type == 'operations'" label="Статус">
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
  </el-dialog>
</template>

<script>
import request from '@/utils/request'
export default {
  props: ['showDialog', 'listLoading', 'historible_id', 'historible_type'],
  data() {
    return {
      historyList: null
    }
  },
  mounted() {
    this.getHistory()
  },
  methods: {
    localeDate(vdate) {
      return (new Date(vdate)).toLocaleDateString() + ' ' + new Date(vdate).toLocaleTimeString()
    },
    async getHistory() {
      const res = await request({
        url: '/histories',
        method: 'get',
        params: {
          // page: this.listQuery.page,
          historible_id: this.historible_id,
          historible_type: this.historible_type
        }
      })
      this.historyList = res.data
    }
  }
}
</script>
