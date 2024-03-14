<template>
  <el-form
    ref="formDataHeaderFlowchart"
    v-loading="loadingSubmitForm"
    :model="formDataHeaderFlowchart"
    :rules="rules"
    label-position="top"
    label-width="200px"
    @submit="saveData()"
  >
    <el-form-item label="Название элемента" prop="flowChartItem_name">
      <el-input
        v-model="formDataHeaderFlowchart.flowChartItem_name"
        placeholder="Введите название"
        autocomplete="off"
        minlength="3"
        clearable
        focus
      />
    </el-form-item>
  </el-form>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'FlowchartHeader',
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
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      loadingSubmitForm: false,
      rules: {
        flowChartItem_name: [
          { required: true, message: 'Заполните поле', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    formDataHeaderFlowchart: {
      get() {
        return this.value[0]
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  // TODO переделать очистку валидации формы!!!!!!!!!!!!!
  watch: {
    value(newValue, oldValue) {
      this.$refs['formDataHeaderFlowchart'].clearValidate()
    }
  },
  methods: {
    closeDialog() {
      if (this.$refs['formDataHeaderFlowchart']) {
        this.$refs['formDataHeaderFlowchart'].clearValidate()
        // this.formDataHeaderFlowchart.flowChartItem_name = ''
      }
      this.$emit('update:open', false)
    },
    async saveData() {
      if (this.$refs['formDataHeaderFlowchart']) {
        this.$refs['formDataHeaderFlowchart'].clearValidate()
      }
      this.$refs['formDataHeaderFlowchart'].validate(async (valid) => {
        console.log(valid)
        this.loadingSubmitForm = true
        this.$emit('loading', true)
        if (valid) {
          let params = Object.assign({}, this.formDataHeaderFlowchart)
          if (this.formDataHeaderFlowchart.flowChartItem_id) {
            // this.formDataHeaderFlowchart.flowChartItem_name = Object.assign({}, data)
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
              this.$emit('handleItemEmitUpdateHeader', res)
              this.$emit('saveData', 'update', res)
              this.$emit('update:open', false)
              this.$emit('loading', false)
              this.modeOperation === ''
              // this.editData = { flowChartItem_id: null, flowChartItem_name: '' }
            } else {
              console.log('PUT request error')
            }
            // this.$emit('update:open', false)
          } else {
            params = [
              {
                flowChart_id: this.flowchartId,
                flowChartItemType_id: '5',
                flowChartItem_name:
                  this.formDataHeaderFlowchart.flowChartItem_name,
                flowChartItem_parent:
                  this.formDataHeaderFlowchart.flowChartItem_parent,
                position: this.formDataHeaderFlowchart.position,
                flowChartItem_ref: this.formDataHeaderFlowchart.flowChartItem_id
              }
            ]
            const res = await request({
              url: '/flowchartitem/',
              method: 'post',
              data: params
            })
            console.log(res)
            if (res) {
              this.$notify({
                title: 'Успешно!',
                message: 'Данные успешно добавлены',
                type: 'success',
                duration: 5000
              })
              this.$emit('handleItemEmitHeader', res)
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
