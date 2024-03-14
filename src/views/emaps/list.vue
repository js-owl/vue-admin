<template>
  <div class="app-container break_word">
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="editOperation_edit_card">
          <div class="box">
            <el-card class="box-card">
              <template #header>
                <div class="card-header">
                  <p class="title">СПИСОК ЭЛЕКТРОСХЕМ</p>
                </div>
              </template>
              <el-table
                v-loading="listLoading"
                :data="list"
                border
                fit
                highlight-current-row
                style="width: 100%"
              >
                <!-- Название электросхемы -->
                <el-table-column
                  label="Название электросхемы"
                  width="400"
                  align="left"
                >
                  <template #default="scope">
                    {{ scope.row.electricGroup_name }}
                  </template>
                </el-table-column>
                <!-- Вид электросхемы -->
                <el-table-column
                  label="Вид электросхемы"
                  width="200"
                  align="left"
                >
                  <template #default="scope">
                    {{ scope.row.electricGroupType_name }}
                  </template>
                </el-table-column>
                <!-- Статус -->
                <el-table-column label="Статус" width="200" align="left">
                  <template #default="scope">
                    {{ $transformStatus(scope.row.request_state) }}
                  </template>
                </el-table-column>
                <!-- К каким а/м относятся -->
                <el-table-column
                  label="К каким а/м относятся"
                  width="200"
                  align="left"
                >
                  <template #default="scope">
                    <div v-if="scope.row.modifications.length !== 0">
                      <div v-if="!scope.row.isModificationsOpen">
                        {{
                          scope.row.modifications[0].productModification_name
                        }}
                        <br />
                        <div
                          v-if="scope.row.modifications.length > 1"
                          style="cursor: pointer"
                          @click="
                            scope.row.isModificationsOpen =
                              !scope.row.isModificationsOpen
                          "
                        >
                          ...
                        </div>
                      </div>
                      <div v-if="scope.row.isModificationsOpen">
                        <div
                          v-for="m in scope.row.modifications"
                          :key="m.productModification_id"
                        >
                          {{ m.productModification_name }}
                        </div>
                        <el-button
                          size="mini"
                          type="text"
                          @click="
                            scope.row.isModificationsOpen =
                              !scope.row.isModificationsOpen
                          "
                        >
                          Скрыть
                        </el-button>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <!-- Кнопки -->
                <el-table-column label="Действие" align="center">
                  <template #default="scope">
                    <!-- Редактировать -->
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
                        @click="fn(scope.$index, scope.row)"
                      >
                        <i class="el-icon-edit" />
                      </el-button>
                    </el-tooltip>
                    <!-- Предварительный просмотр -->
                    <router-link
                      :to="'/emaps/preview/' + scope.row.electricGroup_id"
                    >
                      <el-tooltip
                        class="box-item"
                        effect="light"
                        placement="top-start"
                        content="Предварительный просмотр"
                        popper-class="uaz__tooltip uaz__tooltip-left"
                      >
                        <el-button size="mini" class="el-button-icon">
                          <i class="el-icon-view" />
                        </el-button>
                      </el-tooltip>
                    </router-link>
                    <el-tooltip
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

                    <el-popconfirm
                      confirm-button-text="Да"
                      cancel-button-text="Нет, спасибо"
                      title="Подтверждаете удаление?"
                      @onConfirm="fn(scope.$index, scope.row)"
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
            </el-card>
          </div>
        </div>
      </el-col>
    </el-row>
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
import Pagination from '@/components/Pagination'

export default {
  name: 'EmapsList',
  components: { Pagination },

  data() {
    return {
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      }
      // currentFilter: {
      //   filter: ''
      // },
      // dialogFormVisible: false,
      // dialogFormVisibleHistory: false
    }
  },
  // computed: {
  //   ...mapGetters(['role_name'])
  // },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const params = {
        page: this.listQuery.page
      }
      const res = await request({
        url: '/electricgroup',
        method: 'get',
        params
      })
      this.list = res.data
      this.list = this.list.map((v) => {
        // https://vuejs.org/v2/guide/reactivity.html
        this.$set(v, 'isModificationsOpen', false)
        return v
      })
      this.total = res.total
      this.listQuery.page = res.current_page
      this.listQuery.limit = res.per_page
      this.listLoading = false
    },
    fn() {
      console.log('🚀 ~ fn ~ fn:')
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
