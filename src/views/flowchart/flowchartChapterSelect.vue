<template>
  <div class="operationSelect flowchart_input_width">
    <el-row>
      <el-form
        ref="refFlowchartSelect"
        v-loading="loadingSubmitForm"
        :model="formFlowchartSelect"
        :rules="rules"
        label-position="top"
        label-width="200px"
        size="large"
        @submit="saveData()"
      >
        <el-form-item label="Название элемента">
          <el-col :span="12">
            <el-form-item prop="flowChart_name">
              <el-autocomplete
                v-model="formFlowchartSelect.flowChart_name"
                placeholder="Введите название"
                :fetch-suggestions="getFlowchart"
                value-key="flowChart_name"
                suffix-icon="el-icon-arrow-down"
                clearable
                @select="handleSelect"
              >
                <template #default="{ item }">
                  {{ item.flowChart_name }}
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <span v-show="formFlowchartSelect.flowChart_name">
              <el-form-item prop="flowChartItem_name">
                <el-select
                  v-model="formFlowchartSelect.flowChartItem_name"
                  placeholder="Выберите тип"
                  clearable
                  style="width: 100%"
                  @change="getRefId"
                >
                  <el-option
                    v-for="item in flowchartItems"
                    :key="item.flowChartItem_id"
                    :label="item.flowChartItem_name"
                    :value="item.flowChartItem_name"
                  />
                </el-select>
              </el-form-item>
            </span>
          </el-col>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import request from '@/utils/request'
import { html2Text } from '@/utils'

export default {
  name: 'FlowchartChapterSelect',
  props: {
    value: {
      type: Object,
      default() {
        return {}
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
      flowchartSelected: '',
      flowchartItems: [],
      id_ref: 0,
      loadingSubmitForm: false,
      rules: {
        flowChart_name: [
          { required: true, message: 'Заполните поле', trigger: 'change' }
        ],
        flowChartItem_name: [
          { required: true, message: 'Заполните поле', trigger: 'change' }
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
  mounted() {
    const id = this.formFlowchartSelect.flowChart_ref
    if (id) this.getInfo(id)
  },
  methods: {
    async getFlowchart(filter, cb) {
      const res = await request({
        url: '/flowchart/',
        method: 'get',
        params: {
          flowChart_name: html2Text(filter)
        }
      })
      cb(res.data)
    },
    handleSelect(v) {
      this.getInfo(v.flowChart_id)
      this.$emit('selectValue', this.getInfo(v.flowChart_id))
    },
    async getInfo(id) {
      const res = await request({
        url: '/flowchart/get/' + id,
        method: 'get',
        params: { toHierarchy: true }
      })
      this.flowchartItems = res.data.items
    },
    getRefId(name) {
      // eslint-disable-next-line eqeqeq
      const o = this.flowchartItems.find((v) => v.flowChartItem_name == name)
      this.id_ref = Number(o.flowChartItem_id)
    },
    closeDialog() {
      if (this.$refs['refFlowchartSelect']) {
        this.$refs['refFlowchartSelect'].clearValidate()
      }
      this.$emit('update:open', false)
    },
    async saveData() {
      if (this.$refs['refFlowchartSelect']) {
        this.$refs['refFlowchartSelect'].clearValidate()
      }
      this.$refs['refFlowchartSelect'].validate(async (valid) => {
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
                flowChart_id: this.flowchartId,
                flowChartItemType_id: '3',
                flowChartItem_name: this.formFlowchartSelect.flowChartItem_name,
                flowChart_name: this.formFlowchartSelect.flowChart_name,
                flowChartItem_parent: this.parent,
                position: this.position,
                flowChartItem_ref: this.id_ref
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
