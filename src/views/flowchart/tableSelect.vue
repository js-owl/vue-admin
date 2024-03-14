<template>
  <div class="operationSelect flowchart_input_width">
    <el-form
      ref="formTable"
      v-loading="loadingSubmitForm"
      :model="formTable"
      :rules="rules"
      label-position="top"
      label-width="200px"
      size="large"
      @submit="saveData()"
    >
      <el-form-item label="Название элемента" prop="flowChartItem_name">
        <el-row>
          <el-col :span="14">
            <el-autocomplete
              v-model="formTable.flowChartItem_name"
              width="100%"
              placeholder="Введите название"
              :fetch-suggestions="getTables"
              value-key="tables_name"
              suffix-icon="el-icon-arrow-down"
              clearable
              @select="handleSelectionChange"
            >
              <template #default="{ item }">
                {{ item.tables_name }}
              </template>
            </el-autocomplete>
          </el-col>
          <el-col :span="10">
            <el-button type="primary" @click="isModalOpen = true">
              Добавить
            </el-button>
          </el-col>
        </el-row>
        <table-dialog
          :open.sync="isModalOpen"
          :data.sync="modalData"
          @saveData="getAddedTable"
      /></el-form-item>
    </el-form>
  </div>
</template>

<script>
import request from '@/utils/request'
import TableDialog from '@/components/Dialog/TableDialog'

export default {
  name: 'TableSelect',
  components: { TableDialog },
  props: {
    flowchartId: {
      type: Number,
      default: 0
    },
    value: {
      type: Object,
      default() {
        return {}
      }
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
  data() {
    var validateSelect = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('Заполните поле'))
      } else if (this.tableSelected.tables_id === undefined) {
        return callback('Выберите элемент из выпадающего списка')
      }
      return callback()
    }
    return {
      isModalOpen: false,
      loadingSubmitForm: false,
      rules: {
        flowChartItem_name: [
          {
            validator: validateSelect,
            required: true,
            message: 'Выберите название элемента из выпадающего списка'
          }
        ]
      },
      modalData: {
        tables_name: '',
        tables_description: ''
      },
      tableSelected: {}
    }
  },
  computed: {
    formTable: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  // TODO переделать очистку валидации формы!!!!!!!!!!!!!
  watch: {
    value(newValue, oldValue) {
      this.$refs['formTable'].clearValidate()
    }
  },
  methods: {
    async getTables(filter, cb) {
      const res = await request({
        url: '/tables/',
        method: 'get',
        params: { filter: filter }
      })
      cb(res.data)
    },
    getAddedTable(method, el) {
      this.formTable.flowChartItem_name = el.tables_name
      this.tableSelected.tables_id = el.tables_id
    },
    handleSelectionChange(v, row) {
      this.tableSelected = v
    },
    closeDialog() {
      if (this.$refs['formTable']) {
        this.$refs['formTable'].clearValidate()
      }
      this.$emit('update:open', false)
    },
    async saveData() {
      if (this.$refs['formTable']) {
        this.$refs['formTable'].clearValidate()
      }
      this.$refs['formTable'].validate(async (valid) => {
        this.loadingSubmitForm = true
        this.$emit('loading', true)
        if (valid) {
          let params = Object.assign({}, this.formTable)
          if (params.flowChartItem_id) {
            params.isActive = true
            const res = await request({
              url: '/flowchartitem/' + params.flowChartItem_id,
              method: 'put',
              data: params
            })
            if (res) {
              this.$notify({
                title: 'Успешно!',
                message: 'Данные успешно сохранены',
                type: 'success',
                duration: 5000
              })
              this.$emit('updateTable', res)
              this.$emit('saveData', 'update', res)
              this.$emit('update:open', false)
              this.$emit('loading', false)
              this.modeOperation === ''
              this.editData = { tables_id: null, flowChartItem_name: '' }
            } else {
              console.log('PUT request error')
            }
          } else {
            params = [
              {
                flowChart_id: this.flowchartId,
                flowChartItemType_id: '6',
                flowChartItem_name: this.formTable.flowChartItem_name,
                flowChartItem_parent: this.parent,
                position: this.position,
                tables_ref: this.tableSelected.tables_id
              }
            ]
            const res = await request({
              url: '/flowchartitem/',
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
              this.$emit('createTable', res)
              this.$emit('saveData', 'create', res)
            }
          }
          this.closeDialog()
        } else {
          console.log('error submit!!')
        }
        this.loadingSubmitForm = false
      })
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
