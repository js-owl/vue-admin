<template>
  <div class="userlist_index_card dealer_card">
    <div class="filter_search_select">
      <filterSelect
        v-model="currentFilter"
        :show-search="showSearch"
        :show-export="showExport"
        search-placeholder="ФИО/E-mail/Дилер"
        @SearchOnFilter="getList"
        @input="getList"
      />
      <!--<div class="dealer_list_select">
        <p>Экспорт</p>
        <export-dealer v-model="currentFilter.isExport" @input="getList" />
      </div>-->
    </div>
    <el-table
      ref="multipleTableRef"
      v-loading="listLoading"
      class="table_sample break_word card_user_index"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="showCheckedField"
        type="selection"
        width="35"
        :reserve-selection="true"
      />
      <el-table-column label="ФИО">
        <template #default="scope">
          {{ scope.row.lname }} {{ scope.row.fname }} {{ scope.row.mname }}
        </template>
      </el-table-column>
      <el-table-column label="E-mail" width="250">
        <template #default="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column v-if="!showDealerField" label="Дилер" width="200">
        <template #default="scope">
          <span>{{ scope.row.dealer_name }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="false" label="Должность">
        <template #default="scope">
          {{ scope.row.position_name }}
        </template>
      </el-table-column>
      <el-table-column v-if="false" label="Телефон">
        <template #default="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="Роль" width="125">
        <template #default="scope">
          {{ scope.row.user_role }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="editMode"
        align="right"
        width="108"
        class-name="mini-padding fixed-width"
      >
        <template v-if="role_name === 'admin'" #header>
          <router-link :to="'/user/edit/'">
            <el-button size="mini" type="primary">Добавить</el-button>
          </router-link>
        </template>
        <template #default="scope">
          <router-link :to="'/user/edit/' + scope.row.id">
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
      v-show="total > listQuery.limit"
      layout="total, prev, pager, next"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      :auto-scroll="false"
      @pagination="getList"
    />
  </div>
</template>

<script>
import request from '@/utils/request'
import Pagination from '@/components/Pagination'
import filterSelect from '@/components/Header/filter'
import { mapGetters } from 'vuex'
// import exportDealer from '@/views/dealer/exportDealer'
export default {
  name: 'UserList',
  components: { Pagination, filterSelect },
  // exportDealer
  emits: ['check-user'],
  props: {
    showSearch: {
      default: true,
      type: Boolean
    },
    showExport: {
      default: false,
      type: Boolean
    },
    editMode: {
      type: Boolean,
      default() {
        return true
      }
    },
    dealerId: {
      type: Number,
      default() {
        return null
      }
    },
    showCheckedField: {
      type: Boolean,
      default() {
        return false
      }
    },
    showDealerField: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      currentFilter: {},
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      multipleSelection: []
    }
  },
  mounted() {
    this.getList().then(() => {
      this.$refs.multipleTableRef.toggleAllSelection()
    })
  },
  computed: {
    ...mapGetters(['role_name'])
  },
  methods: {
    async getList() {
      const params = {
        page: this.listQuery.page,
        dealer_id: this.dealerId
      }
      if (this.currentFilter.filter) {
        params.filter = this.currentFilter.filter
      }
      if (this.currentFilter.isExport !== undefined) {
        params.isExport = this.currentFilter.isExport
      }

      const res = await request({
        url: '/users/',
        method: 'get',
        params
      })
      this.list = res.data
      this.total = res.total
      this.listQuery.page = res.current_page
      this.listQuery.limit = res.per_page
      this.listLoading = false
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.multipleSelection = this.multipleSelection.map((el) => el.id)
      this.$emit('check-user', this.multipleSelection)
    }
  }
}
</script>

<style scoped>
.dealer_list_select {
  display: inline-block;
  margin: 0;
}
.dealer_list_select p {
  font-size: 12px;
  color: #606266;
  font-weight: 700;
  margin-bottom: 5px;
  line-height: 15px;
  font-size: 14px;
  color: #606266;
}
.filter_search_select{
  display: flex;
  align-items: baseline;
}
.el-scrollbar__wrap {
  overflow-y: hidden;
}
</style>
