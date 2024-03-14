<template>
  <div class="app-container message_card">
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="Заголовок" width="340">
        <template #default="scope">
          {{ scope.row.message_title }}
        </template>
      </el-table-column>

      <el-table-column label="Краткое описание">
        <template #default="scope">
          {{ scope.row.message_shortDescription }}
        </template>
      </el-table-column>
      <el-table-column label="Опубликовано" width="125">
        <template #default="scope">
          {{ scope.row.isPublish ? 'Да' : 'Нет' }}
        </template>
      </el-table-column>
      <el-table-column label="Дата публикации" width="125">
        <template #default="scope">
          {{ getDataDatePublish(scope.row.message_datePublish) }}
        </template>
      </el-table-column>
      <el-table-column
        align="right"
        width="80"
        class-name="mini-padding fixed-width button-tooltip"
      >
        <template #header>
          <router-link :to="'/message/edit/'">
            <el-button size="mini" type="primary">Добавить</el-button>
          </router-link>
        </template>
        <template #default="scope">
          <router-link :to="'/message/edit/' + scope.row.message_id">
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
          <el-popconfirm
            confirm-button-text="Да"
            cancel-button-text="Нет"
            title="Подтверждаете удаление?"
            :class="{ delete_cart: scope.row.isPublish ? true : false }"
            :disabled="scope.row.isPublish ? true : false"
            @onConfirm="deleteRow(scope.$index, scope.row)"
          >
            <template #reference>
              <el-tooltip
                class="box-item"
                effect="light"
                placement="top-start"
                :content="
                  scope.row.isPublish
                    ? 'Уведомление уже опубликовано'
                    : 'Удалить'
                "
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

export default {
  name: 'MessageList',
  components: {
    Pagination
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
    async deleteRow(index, row) {
      // const r = await request({
      //   url: '/message/' + row.message_id,
      //   method: 'get'
      // })
      // if (r.isPublish) {
      //   this.$notify({
      //     title: 'Предупреждение!',
      //     message: 'Данные уже опубликованы',
      //     type: 'warning',
      //     duration: 5000
      //   })
      //   this.$router.go()
      // } else {
      const res = await request({
        url: '/message/' + row.message_id,
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
      // }
    },
    getDataDatePublish(vdate) {
      if (vdate) {
        return (
          new Date(vdate).toLocaleDateString() +
          ' ' +
          new Date(vdate)
            .toLocaleTimeString()
            .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3')
        )
      } else {
        return 'Черновик'
      }
    },
    async getList() {
      const params = {
        page: this.listQuery.page
      }
      if (this.currentFilter.filter) {
        params.filter = this.currentFilter.filter
      }
      const res = await request({
        url: '/message/',
        method: 'get',
        params
      })
      this.list = res.data
      this.total = res.total
      this.listQuery.page = res.current_page
      this.listQuery.limit = res.per_page
      this.listLoading = false
    },
    searchList() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>

<style>
.delete_cart .el-button-icon.danger {
  color: #a8abb2 !important;
  cursor: not-allowed !important;
  background-image: none !important;
  background-color: #ffffff !important;
  border-color: #e4e7ed !important;
}
</style>
