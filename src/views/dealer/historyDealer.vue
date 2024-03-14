<template>
  <el-card class="el_card_header_sample">
    <div slot="header" class="clearfix">
      <span>История</span>
    </div>
    <el-table
      class="table_sample break_word"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="Описание">
        <template #default="scope">
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Дата" width="145">
        <template #default="scope">
          {{ $localeDate(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="Пользователь" width="350">
        <template #default="scope">
          {{ scope.row.fname }} {{ scope.row.lname }} {{ scope.row.mname }}
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
      :auto-scroll="false"
      @pagination="getList"
    />
  </el-card>
</template>
<script>
import Pagination from '@/components/Pagination'
import request from '@/utils/request'

export default {
  components: { Pagination },
  props: {
    dealerId: {
      type: Number,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      dealerStatus: ''
    }
  },
  computed: {
    handleDesc() {
      // Обработать следующие строки:
      // "Значение атрибута \"Экспорт\" изменилось с \"1\" на \"\". "
      // "Значение атрибута \"Статус дилера\" изменилось с \"6\" на \"12\".
      return this.list.map((x) => {
        if (x.desc.includes('Экспорт')) {
          x.desc = x.desc.replace('"1"', '"Да"')
          x.desc = x.desc.replace('""', '"Нет"')
        } else if (
          x.desc.includes('Статус') ||
          x.desc.includes('dealer_status_id')
        ) {
          const firstNum = parseInt(x.desc.match(/\d+/))
          x.desc = x.desc.replace(firstNum, this.statusNameById(firstNum))

          const secondNum = parseInt(x.desc.match(/\d+/))
          x.desc = x.desc.replace(secondNum, this.statusNameById(secondNum))
        }
      })
    }
  },
  async created() {
    await this.getStatus()
    await this.getList()
  },
  methods: {
    async getList() {
      const params = {
        page: this.listQuery.page
      }
      if (this.dealerId) {
        params.dealer_id = this.dealerId
      }
      const res = await request({
        url: '/historydealer',
        method: 'get',
        params
      })
      this.list = res.data
      this.list.desc = this.handleDesc
      this.total = res.total
      this.listQuery.page = res.current_page
      this.listQuery.limit = res.per_page
      this.listLoading = false
    },
    async getStatus() {
      const res = await request({
        url: '/dealerstatus/',
        method: 'get',
        params: {
          limit: 50
        }
      })
      this.dealerStatus = res.data
    },
    statusNameById(id) {
      const item = this.dealerStatus.filter((x) => x.dealerStatus_id === id)
      return item[0].dealerStatus_name
    }
  }
}
</script>
