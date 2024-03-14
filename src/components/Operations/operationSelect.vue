<template>
  <div class="operationSelect">
    <el-row :gutter="24" style="margin-bottom: 10px">
      <el-col :span="12">
        <el-input
          v-model="searchFilter"
          placeholder="Введите название"
          clearable
          @input="searchList"
        />
      </el-col>
      <el-col :span="12" style="padding-left: 0">
        <el-button
          type="primary"
          @click="
            $router.push(`/operations/edit/?createflowchart_id=${flowchartId}`)
          "
        >
          Добавить новую операцию
        </el-button>
      </el-col>
    </el-row>
    <el-row v-loading="loadingSubmit">
      <el-col :span="12">
        <el-table
          ref="refOperations"
          :data="operationData"
          style="width: 100%"
          row-key="operation_id"
          class="operation_selection"
          @current-change="handleCurrentChange"
          @select="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="30"
            :reserve-selection="true"
          />
          <el-table-column label="Выберите операцию">
            <template #default="scope">
              {{ scope.row.action_name }} {{ scope.row.action_ext }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <el-table
          ref="refOperationSelected"
          :data="operationSelected"
          style="width: 100%"
          row-key="operation_id"
          @select="handleSelectionChange"
        >
          <!-- Удалить -->
          <el-table-column width="30">
            <template #default="scope">
              <el-tooltip
                class="box-item"
                effect="light"
                placement="top-start"
                content="Удалить"
                popper-class="uaz__tooltip uaz__tooltip-left"
              >
                <i
                  link
                  size="mini"
                  class="el-icon-close"
                  @click.prevent="deleteRow(scope.$index, scope.row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
          <!-- Посмотреть изображение -->
          <el-table-column width="50">
            <template #default="scope">
              <el-tooltip
                v-if="scope.row.operation_image"
                class="box-item"
                effect="light"
                placement="top-start"
                content="Посмотреть изображение"
                popper-class="uaz__tooltip uaz__tooltip-left"
              >
                <el-button
                  size="mini"
                  class="el-button-icon"
                  @click="showImage(scope.row)"
                >
                  <i class="el-icon-picture" />
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <!-- Название операции -->
          <el-table-column
            :label="'Выбранные элементы (' + operationSelected.length + ')'"
          >
            <template #default="scope">
              {{ scope.row.action_name }} {{ scope.row.action_ext }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <image-dialog :open.sync="isImageOpen" :data.sync="imageData" />
  </div>
</template>

<script>
import request from '@/utils/request'
import imageDialog from '@/components/Dialog/ImageDialog'

export default {
  name: 'OperationSelect',
  components: {
    imageDialog
  },
  props: {
    // open: {
    //   type: Boolean,
    //   default: false
    // },
    value: {
      type: Array,
      default() {
        return []
      }
    },
    flowchartId: {
      type: Number,
      default: 0
    },
    position: {
      type: String,
      default: ''
    },
    parent: {
      type: Number,
      default: 0
    }
  },
  emits: ['input'],
  data() {
    return {
      operationData: [],
      operationSelected: [],
      searchFilter: '',
      loadingSubmit: false,
      isImageOpen: false,
      imageData: ''
    }
  },
  // очистка формы при переходе на другую вкладку
  // watch: {
  //   value(newValue, oldValue) {
  //     this.$refs['refOperations'].clearSelection()
  //     this.operationSelected = []
  //     this.$refs['refOperationSelected'].clearSelection()
  //     this.searchFilter = ''
  //   }
  // },
  async mounted() {
    this.getOperations()
    const o = this.$route.query?.createOperation
    if (o && o != 'cancel') {
      const operation_id = this.$route.query?.createOperation
      const o = await this.getInfo(operation_id)
      this.operationSelected.push(o)
    }
  },
  methods: {
    async getOperations() {
      this.loadingSubmit = true
      const params = { filter: this.searchFilter }
      const res = await request({
        url: '/operations',
        method: 'get',
        params: params
      })
      this.operationData = res.data
      this.loadingSubmit = false
    },
    async getInfo(id) {
      this.loadingSubmit = true
      this.isLoading = false
      const res = await request({
        url: '/operations/' + id,
        method: 'get'
      })
      if (!res) {
        console.log('GET request error')
        this.loadingSubmit = false
        return
      }
      this.loadingSubmit = false
      return res
    },
    handleCurrentChange(v) {
      this.handleSelectionChange({}, v)
    },
    handleSelectionChange(v, row) {
      const cond = this.isInArray(row.operation_id, this.operationSelected)
      if (cond) {
        this.operationSelected = this.operationSelected.filter(
          (o) => row.operation_id !== o.operation_id
        )
      } else {
        this.operationSelected.push(row)
      }
      this.$emit('input', this.operationSelected)
      this.toggleSelection()
    },
    deleteRow(idx, row) {
      this.operationSelected = this.operationSelected.filter((x) => x !== row)
      this.$refs['refOperations'].clearSelection()
      this.operationData.forEach((row) => {
        this.operationSelected.forEach((sel) => {
          if (row === sel) {
            this.$refs['refOperations'].toggleRowSelection(row, undefined)
          }
        })
      })
    },
    searchList() {
      this.getOperations()
    },
    async saveData() {
      if (this.operationSelected.length === 0) {
        this.$notify({
          title: 'Предупреждение!',
          message: 'Выберите данные',
          type: 'warning',
          duration: 2000
        })
        return
      }
      this.loadingSubmit = true
      this.$emit('loading', true)
      const params = Object.assign({}, this.operationSelected)
      this.operationSelected.map((v, i) => {
        params[i].flowChart_id = this.flowchartId
        params[i].flowChartItemType_id = '1'
        params[i].operation_ref = v.operation_id
        params[i].flowChartItem_name = v.action_name + ' ' + v.action_ext
        params[i].flowChartItem_parent = this.parent
        params[i].position = this.position
      })
      const res = await request({
        url: '/flowchartitem',
        method: 'post',
        data: params
      })
      if (res) {
        this.$notify({
          title: 'Успешно!',
          message: 'Данные успешно добавлены',
          type: 'success',
          duration: 5000
        })
        this.$emit('handleItemEmitHeader', res)
        this.$emit('saveData', 'create', res)
        this.$emit('loading', false)
        if (this.$route.query?.createOperation) {
          this.$router.push(`/flowchart/edit/${this.flowchartId}`)
        }
      }
      this.loadingSubmit = false
    },
    isInArray(id, arr) {
      if (arr.some((e) => e.operation_id === id)) {
        return true
      }
      return false
    },
    toggleSelection() {
      this.$refs['refOperations'].clearSelection()
      this.operationData.forEach((row) => {
        this.operationSelected.forEach((sel) => {
          if (row.operation_id === sel.operation_id) {
            this.$refs['refOperations'].toggleRowSelection(row, undefined)
          }
        })
      })
    },
    showImage(v) {
      this.imageData = v.operation_image
      this.isImageOpen = true
    }
  }
}
</script>

<style scoped>
.el-icon-close {
  color: #7ea09a;
  cursor: pointer;
  font-weight: bolder;
}
</style>
