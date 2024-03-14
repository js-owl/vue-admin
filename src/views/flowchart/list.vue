<template>
  <div class="app-container break_word">
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
      <el-table-column label="Номер" width="70">
        <template #default="scope">
          {{ scope.row.flowChart_code }}
        </template>
      </el-table-column>
      <el-table-column label="Применимость" min-width="200">
        <template #default="props">
          <div v-if="props.row.modifications.length !== 0" class="mod">
            <div v-if="!props.row.isSecondApplicabilityOpen" class="first_mod">
              {{ props.row.modifications[0].productModel_name }} -
              {{ props.row.modifications[0].productModification_name }} -
              {{ props.row.modifications[0].revStart }}
              <el-button
                v-if="props.row.modifications.length > 1"
                size="mini"
                type="text"
                @click="openSecond(props.$index, props.row)"
              >
                ...
              </el-button>
            </div>
            <div
              v-show="props.row.isSecondApplicabilityOpen"
              class="second_mod"
            >
              <div
                v-for="m in props.row.modifications"
                :key="m.productModification_id"
              >
                {{ m.productModel_name }} - {{ m.productModification_name }} -
                {{ m.revStart }}
              </div>
              <el-button
                size="mini"
                type="text"
                @click="hideSecond(props.$index, props.row)"
              >
                Скрыть
              </el-button>
            </div>
          </div>
          <div v-if="props.row.parts.length !== 0" class="parts">
            <div v-if="!props.row.isSecondApplicabilityOpen" class="first_part">
              {{ props.row.parts[0].part_code }} -
              {{ props.row.parts[0].part_name }}
              <el-button
                v-if="props.row.parts.length > 1"
                type="text"
                @click="openSecond(props.$index, props.row)"
              >
                ...
              </el-button>
            </div>
            <div
              v-show="props.row.isSecondApplicabilityOpen"
              class="second_parts"
            >
              <div v-for="p in props.row.parts" :key="p.part_id">
                {{ p.part_code }} - {{ p.part_name }}
              </div>
              <el-button
                type="text"
                @click="hideSecond(props.$index, props.row)"
              >
                Скрыть
              </el-button>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Название" min-width="250">
        <template #default="scope">
          {{ scope.row.flowChart_name }}
        </template>
      </el-table-column>
      <el-table-column label="Статус" width="95">
        <template #default="scope">
          {{ $transformStatus(scope.row.request_state) }}
        </template>
      </el-table-column>
      <!-- Отображение статуса перевода EN/ES -->
      <el-table-column
        v-if="role_name === 'translator'"
        label="EN/ES"
        width="80"
        header-align="center"
      >
        <template #default="scope">
          <span
            class="glyphicon glyphicon-ok"
            :class="{ glyphicon_active: scope.row.inEnglish }"
          />
          /
          <span
            class="glyphicon glyphicon-remove"
            :class="{ glyphicon_active: scope.row.inSpanish }"
          />
        </template>
      </el-table-column>
      <!-- Кнопки редактирования -->
      <el-table-column
        id="button-tooltip"
        header-align="right"
        class-name="mini-padding button-tooltip"
        width="282"
      >
        <template #header>
          <router-link to="/flowchart/edit/">
            <el-button
              v-show="role_name != 'translator'"
              size="mini"
              type="primary"
            >
              Добавить
            </el-button>
          </router-link>
        </template>
        <template #default="scope">
          <div>
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
                @click="goEditFlowchart(scope.row)"
              >
                <i class="el-icon-edit" />
              </el-button>
            </el-tooltip>
          </div>

          <el-tooltip
            v-show="role_name != 'translator'"
            class="box-item"
            effect="light"
            placement="top-start"
            content="Частичное редактирование"
            popper-class="uaz__tooltip uaz__tooltip-left"
          >
            <router-link
              :to="
                '/flowchart/edit/' + scope.row.flowChart_id + '?localedit=true'
              "
            >
              <el-button size="mini" class="el-button-icon">
                <i class="el-icon-edit-outline" />
              </el-button>
            </router-link>
          </el-tooltip>
          <!--!!!Копирование - не сделано-->
          <el-tooltip
            v-show="role_name != 'translator'"
            class="box-item"
            effect="light"
            placement="top-start"
            content="Скопировать"
            popper-class="uaz__tooltip uaz__tooltip-left"
          >
            <el-button size="mini" class="el-button-icon">
              <i class="el-icon-document-copy" />
            </el-button>
          </el-tooltip>
          <el-tooltip
            class="box-item"
            effect="light"
            placement="top-start"
            content="Предварительный просмотр"
            popper-class="uaz__tooltip uaz__tooltip-left"
          >
            <el-button
              size="mini"
              class="el-button-icon"
              @click="handlePreview(scope.$index, scope.row)"
            >
              <i class="el-icon-view" />
            </el-button>
          </el-tooltip>
          <el-tooltip
            class="box-item"
            effect="light"
            placement="top-start"
            content="Скачать"
            popper-class="uaz__tooltip uaz__tooltip-left"
          >
            <el-button size="mini" class="el-button-icon">
              <i class="el-icon-download" />
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
              class="el-button-icon"
              @click="showModalHistoryElement(scope.$index, scope.row)"
            >
              <i class="el-icon-notebook-1" />
            </el-button>
          </el-tooltip>
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
    <flowchart-preview-dialog
      v-if="flowchartId"
      :open.sync="isPreviewOpen"
      :flowchart-id="flowchartId"
      @closeDialog="handleCloseDialog"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/request'
import Pagination from '@/components/Pagination'
import flowchartPreviewDialog from '@/components/Dialog/FlowchartPreviewDialog'
import filterSelect from '@/components/Header/filter'

export default {
  name: 'FlowchartList',
  components: { Pagination, flowchartPreviewDialog, filterSelect },

  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      currentFilter: {
        filter: ''
      },
      dialogFormVisible: false,
      tempData: {},
      activeRow: null,
      isPreviewOpen: false,
      flowchartId: null
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
        url: '/flowchart',
        method: 'get',
        params
      })
      this.list = res.data
      this.list = this.list.map((v) => {
        // https://vuejs.org/v2/guide/reactivity.html
        this.$set(v, 'isSecondApplicabilityOpen', false)
        return v
      })
      this.total = res.total
      this.listQuery.page = res.current_page
      this.listQuery.limit = res.per_page
      this.listLoading = false
    },
    handlePreview(idx, row) {
      this.flowchartId = row.flowChart_id
      this.isPreviewOpen = true
    },
    showModalHistoryElement(index, row) {
      // this.dialogFormVisibleHistory = !this.dialogFormVisibleHistory
      // this.historible_id = row.operation_id
      // this.historible_type = 'operations'
    },
    async deleteRow(index, row) {
      const res = await request({
        url: '/actions/' + row.action_id,
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
    openSecond(idx, row) {
      row.isSecondApplicabilityOpen = true
    },
    hideSecond(idx, row) {
      row.isSecondApplicabilityOpen = false
    },
    handleCloseDialog() {
      this.flowchartId = null
    },
    goEditFlowchart(data) {
      if (this.role_name === 'translator') {
        this.$router.push('/flowchart/bidedit/' + data.request_id)
      } else {
        switch (true) {
          case data.request_state === 'draft':
            this.$router.push('/flowchart/edit/' + data.flowChart_id)
            break
          default:
            this.$router.push('/flowchart/bidedit/' + data.request_id)
            break
        }
      }
    }
  }
}
</script>

<style scoped>
.glyphicon {
  position: relative;
  display: inline-block;
  margin: 0;
  box-sizing: border-box;
  padding: 0 10px;
}

.glyphicon-ok::before {
  content: '\e013';
}

.glyphicon-remove::before {
  content: '\e014';
}

.glyphicon_active {
  color: #7ea09a;
}
</style>
