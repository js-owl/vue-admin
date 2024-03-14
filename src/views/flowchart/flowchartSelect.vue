<template>
  <div class="operationSelect flowchart_input_width">
    <el-form
      ref="formFlowchartSelect"
      v-loading="loadingSubmitForm"
      :model="formFlowchartSelect"
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
              v-model="formFlowchartSelect.flowChartItem_name"
              width="100%"
              placeholder="Введите название"
              :fetch-suggestions="getFlowchart"
              value-key="flowChart_name"
              suffix-icon="el-icon-arrow-down"
              clearable
              @select="select"
            >
              <template #default="{ item }">
                {{ item.flowChart_name }}
              </template>
            </el-autocomplete>
          </el-col>

          <el-col :span="10">
            <el-button
              type="primary"
              @click="
                $router.push(
                  `/flowchart/edit/?createflowchart_id=${flowchartId}`
                )
              "
            >
              Добавить
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import request from '@/utils/request'
import { html2Text } from '@/utils'

export default {
  name: 'FlowchartSelect',
  props: {
    open: {
      type: Boolean,
      default: false
    },
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
      if (!this.$route.query?.createFlowchart) {
        if (value === '') {
          return callback(new Error('Заполните поле'))
        } else if (this.selected.flowChart_id === undefined) {
          return callback('Выберите элемент из выпадающего списка')
        }
      }
      return callback()
    }
    return {
      loadingSubmitForm: false,
      rules: {
        flowChartItem_name: [
          {
            validator: validateSelect,
            required: true,
            message: 'Выберите название элемента из выпадающего списка',
            trigger: 'select'
          }
        ]
      }
    }
  },
  computed: {
    formFlowchartSelect: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  async mounted() {
    const fc_id = this.$route.query?.createFlowchart
    if (fc_id) {
      const fc = await this.getInfo(fc_id)
      // this.formFlowchartSelect = Object.assign({}, fc)
      this.formFlowchartSelect.flowChartItem_name = fc.flowChart_name
      this.formFlowchartSelect.flowChart_id = fc.flowChart_id
    }
  },

  // TODO переделать очистку валидации формы!!!!!!!!!!!!!
  watch: {
    value(newValue, oldValue) {
      this.$refs['formFlowchartSelect'].clearValidate()
    }
  },
  methods: {
    async getFlowchart(filter, cb) {
      const res = await request({
        url: '/flowchart/',
        method: 'get',
        params: {
          filter: 2,
          flowChart_name: html2Text(filter)
        }
      })
      cb(res.data)
    },
    async getInfo(id) {
      const res = await request({
        url: '/flowchart/get/' + id,
        method: 'get',
        params: { toHierarchy: true }
      })
      return res.data
    },
    select(item) {
      this.selected = item
    },
    closeDialog() {
      if (this.$refs['formFlowchartSelect']) {
        this.$refs['formFlowchartSelect'].clearValidate()
      }
      this.$emit('update:open', false)
    },
    async saveData() {
      if (this.$refs['formFlowchartSelect']) {
        this.$refs['formFlowchartSelect'].clearValidate()
      }
      this.$refs['formFlowchartSelect'].validate(async (valid) => {
        console.log(valid)
        this.loadingSubmitForm = true
        this.$emit('loading', true)
        if (valid) {
          let params = Object.assign({}, this.formFlowchartSelect)
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
              this.$emit('emitUpdateFlowchartSelect', res)
              this.$emit('saveData', 'update', res)
              this.$emit('update:open', false)
              this.$emit('loading', false)
              this.modeOperation === ''
              this.editData = { flowChartItem_id: null, flowChartItem_name: '' }
            } else {
              console.log('PUT request error')
            }
          } else {
            params = [
              {
                flowChart_id: this.$route.query?.createFlowchart
                  ? this.formFlowchartSelect.flowChart_id
                  : this.flowchartId,
                flowChartItemType_id: '2',
                flowChartItem_name: this.formFlowchartSelect.flowChartItem_name,
                flowChartItem_ref: this.formFlowchartSelect.flowChartItem_id,
                flowChartItem_parent: this.parent,
                position: this.position
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
              this.$emit('emitCreateFlowchartSelect', res)
              this.$emit('saveData', 'create', res)
              if (this.$route.query?.createFlowchart) {
                this.$router.push(`/flowchart/edit/${this.flowchartId}`)
              }
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
