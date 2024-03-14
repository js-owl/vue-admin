<template>
  <el-form
    ref="refOperation"
    v-loading="loadingSubmitForm"
    :model="formOperation"
    :rules="rules"
    label-position="top"
    label-width="200px"
    @submit="saveData()"
  >
    <el-form-item label="Название элемента" prop="flowChartItem_name">
      <el-row :gutter="24" style="margin-bottom: 10px">
        <el-col :span="14" style="padding-left: 10px; padding-right: 20px">
          <el-autocomplete
            v-model="formOperation.flowChartItem_name"
            placeholder="Введите название"
            :fetch-suggestions="getOperation"
            value-key="operation_name"
            style="width: 100%"
            @select="handleSelectAutocomplete"
          >
            <template #default="{ item }">
              {{ item.action_name }} {{ item.action_ext }}
            </template>
          </el-autocomplete>
        </el-col>
        <el-col :span="10" style="padding-left: 0">
          <el-button
            type="primary"
            @click="
              $router.push(
                `/operations/edit/?updateflowchart_id=${flowchartId}&item_id=${flowChartItem_id2}`
              )
            "
          >
            Добавить
          </el-button>
        </el-col>
      </el-row>
    </el-form-item>
  </el-form>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'OperationUpdate',
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      }
    },
    flowchartId: {
      type: Number,
      default: 0
    },
    itemid: {
      type: Number,
      default: 0
    }
  },

  emits: ['input', 'operationUpdate'],
  data() {
    return {
      loadingSubmitForm: false,
      rules: {
        flowChartItem_name: [
          { required: true, message: 'Заполните поле', trigger: 'blur' }
        ]
      },
      formOperation: {},
      flowChartItem_id2: 0
    }
  },
  async mounted() {
    if (this.$route.query?.fromOperation) {
      const operation_id = this.$route.query?.fromOperation
      const o = await this.getInfo(operation_id)
      this.formOperation = Object.assign({}, o)
      Object.assign(this.formOperation, o)
      this.formOperation.flowChartItem_name = o.action_name + ' ' + o.action_ext
    } else {
      this.formOperation = Object.assign({}, this.value)
      this.flowChartItem_id2 = this.formOperation.flowChartItem_id
    }
  },

  methods: {
    async getOperation(filter, cb) {
      const res = await request({
        url: '/operations/',
        method: 'get',
        params: { filter: filter }
      })
      const list = res.data
      list.map((v) => {
        this.$set(v, 'operation_name', v.action_name + ' ' + v.action_ext)
      })
      cb(list)
    },
    async getInfo(id) {
      this.isLoading = false
      const res = await request({
        url: '/operations/' + id,
        method: 'get'
      })
      if (!res) {
        console.log('GET request error')
        return
      }
      this.formOperation = res
      return res
    },
    handleSelectAutocomplete(v) {
      this.$refs['refOperation'].clearValidate()
      // this.$emit('operationUpdate', v)
    },
    closeDialog() {
      if (this.$refs['refOperation']) {
        this.$refs['refOperation'].clearValidate()
      }
      this.$emit('update:open', false)
    },
    async saveData() {
      if (this.$refs['refOperation']) {
        this.$refs['refOperation'].clearValidate()
      }
      this.$refs['refOperation'].validate(async (valid) => {
        console.log(valid)
        this.loadingSubmitForm = true
        if (valid) {
          const params = Object.assign({}, this.formOperation)
          params.flowChartItem_name = this.formOperation.flowChartItem_name
          params.flowChartItem_id = this.itemid
          params.isActive = true
          if (this.itemid) {
            const res = await request({
              url: '/flowchartitem/' + this.itemid,
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
              this.$emit('updateOperation', res)
              this.$emit('saveData', 'update', res)
              this.$emit('update:open', false)
              this.modeOperation === ''
              if (this.$route.query?.fromOperation) {
                this.$router.push(`/flowchart/edit/${this.flowchartId}`)
              }
            } else {
              console.log('PUT request error')
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
