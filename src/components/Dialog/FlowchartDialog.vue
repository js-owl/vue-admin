<template>
  <dialog-f
    class="flowchart_editor"
    title="Редактор"
    :show-dialog="open"
    :disable="isLoading"
    @open="handleOpen"
    @update:showDialog="closeDialog"
    @closeDialog="closeDialog"
    @saveData="saveModalData"
  >
    <!-- Тип элемента -->
    <el-tabs
      v-model="typeSelected"
      type="border-card"
      prop="flowchart_type"
      @tab-click="handleTabClick"
    >
      <el-tab-pane
        v-for="item in typeOptions"
        :key="item.flowChartItemType_id"
        :label="item.name"
        :name="item.flowChartItemType_id"
        style="padding: 5px 15px"
      />
      <!-- Заголовок -->
      <flowchart-header
        v-if="typeSelected == '5'"
        ref="refFlowchartHeader"
        v-model="headers"
        :flowchart-id="id"
        @loading="handleLoad"
        @handleItemEmitHeader="handleItemEmitHeader"
        @handleItemEmitUpdateHeader="handleItemEmitUpdateHeader"
      />
      <!-- Раздел тех карты -->
      <flowchart-chapter-select
        v-else-if="typeSelected == '3'"
        ref="refFlowchartHeader"
        v-model="flowchartData"
        :flowchart-id="id"
        :position="position"
        :parent="parent"
        @loading="handleLoad"
        @emitCreateFlowchartSelect="createItem"
        @emitUpdateFlowchartSelect="updateItem"
      />
      <!-- Уведомления -->
      <notification-select
        v-if="
          modeOperation == 'create' &&
          (typeSelected == '4' || typeSelected == '7')
        "
        ref="refFlowchartHeader"
        v-model="notifications"
        :flowchart-id="id"
        :position="position"
        :parent="parent"
        @loading="handleLoad"
        @handleItemEmitHeader="handleItemEmitHeader"
      />
      <notification-update
        v-if="
          modeOperation == 'update' &&
          (typeSelected == '4' || typeSelected == '7')
        "
        ref="refFlowchartHeader"
        v-model="notification"
        @notificationUpdate="handleItemEmitUpdate"
      />

      <!-- Предупреждения -->
      <!-- <notification-select
        v-if="typeSelected == '7' && modeOperation == 'create'"
        ref="refFlowchartHeader"
        v-model="flowChartItem_names7"
        :flowchart-id="id"
        :is-warning="true"
        :position="position"
        :parent="parent"
        @loading="handleLoad"
        @handleItemEmitHeader="handleItemEmitHeader"
      />
      <notification-update
        v-if="typeSelected == '7' && modeOperation == 'update'"
        ref="refFlowchartHeader"
        v-model="notification"
        @notificationUpdate="handleItemEmitUpdate"
      /> -->
      <!-- Операции -->
      <operation-select
        v-if="typeSelected == '1' && modeOperation == 'create'"
        ref="refFlowchartHeader"
        v-model="operations"
        :flowchart-id="id"
        :position="position"
        :parent="parent"
        @handleItemEmitHeader="handleItemEmitHeader"
        @loading="handleLoad"
      />
      <operation-update
        v-if="typeSelected == '1' && modeOperation == 'update'"
        ref="refFlowchartHeader"
        v-model="operation"
        :flowchart-id="id"
        :itemid="flowChartItem_id"
        @updateOperation="updateItem"
      />
      <!-- Тех карта -->
      <flowchart-select
        v-else-if="typeSelected == '2'"
        ref="refFlowchartHeader"
        v-model="flowchartData"
        :flowchart-id="id"
        :position="position"
        :parent="parent"
        @loading="handleLoad"
        @emitCreateFlowchartSelect="createItem"
        @emitUpdateFlowchartSelect="updateItem"
      />

      <!-- <el-form-item
          v-else-if="typeSelected == '2'"
          label="Название элемента"
          prop="flowChartItem_flowchart"
        >
          <flowchart-select
            v-model="formData.flowChartItem_flowchart"
            @flowchartEmit="handleItemEmit"
          />
        </el-form-item>-->
      <!-- Таблицы-->
      <table-select
        v-else-if="typeSelected == '6'"
        ref="refFlowchartHeader"
        v-model="flowchartData"
        :flowchart-id="id"
        :position="position"
        :parent="parent"
        @loading="handleLoad"
        @createTable="createItem"
        @updateTable="updateItem"
      />
      <!-- <el-form-item
          v-else-if="typeSelected == '6'"
          label="Название элемента"
          prop="flowChartItem_tables"
        > -->
      <!-- <table-select
            v-model="formData.flowChartItem_tables"
            @tableEmit="handleItemEmit"
          /> -->
      <!-- </el-form-item> -->
    </el-tabs>
    <!-- </el-form>  -->
  </dialog-f>
</template>

<script>
// import request from '@/utils/request'
import DialogF from '@/components/Dialog/DialogF'
import flowchartHeader from '@/views/flowchart/flowchartHeader'
import flowchartChapterSelect from '@/views/flowchart/flowchartChapterSelect'
import notificationSelect from '@/views/flowchart/notificationSelect'
import notificationUpdate from '@/views/flowchart/notificationUpdate'
import operationSelect from '@/components/Operations/operationSelect'
import operationUpdate from '@/views/flowchart/operationUpdate'
import flowchartSelect from '@/views/flowchart/flowchartSelect'
import tableSelect from '@/views/flowchart/tableSelect'

export default {
  name: 'FlowchartDialog',
  components: {
    DialogF,
    flowchartHeader,
    flowchartChapterSelect,
    notificationSelect,
    notificationUpdate,
    operationSelect,
    operationUpdate,
    flowchartSelect,
    tableSelect
  },
  props: {
    // открывает модальное окно
    open: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  // передаёт статус открытого модального окна, добавляет/обновляет данные на странице техкарт и сервере
  emits: ['update:open', 'update:data', 'saveData'],
  data() {
    // var validateListElements = (rule, value, callback) => {
    //   console.log(value)
    //   if (value.length === 0) {
    //     callback(new Error('Выберите элементы'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      url: '/flowchart/',
      id: Number(this.$route.params?.id), // todoпрокинуть в ребенка через пропс
      rules: {
        // Заголовок
        flowChartItem_name: [
          { required: true, message: 'Заполните поле', trigger: 'blur' }
        ],
        flowChartItem_flowchart: [
          { required: true, message: 'Заполните поле', trigger: 'blur' }
        ],
        // Таблицы
        flowChartItem_tables: [
          { required: true, message: 'Заполните поле', trigger: 'blur' }
        ]
        // flowChartItem_operation: [
        //   { validator: validateListElements, trigger: 'blur' }
        // ]
      },
      loadingSubmitForm: false,
      // resSubmitFormHeader: [],
      value: '',
      flowChartItem_header: '',
      formData: {
        flowChartItemOld_id: null,
        // Заголовок
        flowChartItem_name: '',
        // Раздел тех карты
        flowChartItem_flowchartSelect: '',
        // Уведомление
        flowChartItem_notification: '',
        // Операция / Уведомления
        flowChartItem_operation: [],
        // Тех карта
        flowChartItem_flowchart: '',
        // Таблицы
        flowChartItem_tables: '',
        tables_name: ''
      },
      flowChartItem_names7: [],
      typeOptionsFull: [
        { flowChartItemType_id: '5', name: 'Заголовок' },
        { flowChartItemType_id: '3', name: 'Раздел тех карты' },
        { flowChartItemType_id: '4', name: 'Уведомление/Предупреждение' },
        { flowChartItemType_id: '1', name: 'Операция' },
        { flowChartItemType_id: '2', name: 'Тех карта' },
        { flowChartItemType_id: '6', name: 'Таблицы' }
      ],
      typeOptions: [],
      typeSelected: '5',
      flowchartID: 0,
      modeOperation: '',
      position: '',
      flowChartItem_id: 0,

      headers: [],
      notifications: [],
      notification: {},
      operations: [],
      flowchartData: {},
      isLoading: false
    }
  },
  watch: {
    data(newValue, oldValue) {
      this.headers = newValue
      this.flowchartData = newValue[0]
      this.notifications = newValue
      // this.flowChartItem_names7 = newValue
      this.notification = newValue[0]
      this.operations = newValue
      this.operation = newValue[0]
    }
  },
  methods: {
    handleTabClick() {
      this.isLoading = false
      this.headers = [
        {
          flowChartItem_name: ''
        }
      ]
      this.notifications = [
        {
          flowChartItem_name: ''
        }
      ]
      this.notification = {
        flowChartItem_name: ''
      }
      this.operations = [
        {
          flowChartItem_name: ''
        }
      ]
      this.operation = {
        flowChartItem_name: ''
      }
      this.flowchartData = {
        flowChartItem_name: ''
      }
    },
    // handleFlowchartEmit(v) {
    //   this.formData = v
    // },
    // TODO сделать универсально для табсов
    handleItemEmitHeader(v) {
      this.$emit('saveData', 'create', v)
      this.closeDialog()
    },
    handleItemEmitUpdateHeader(v) {
      const arr_update = []
      arr_update.push(v)
      this.$emit('saveData', 'update', arr_update)
      this.closeDialog()
    },

    createItem(v) {
      this.$emit('saveData', 'create', v)
      this.closeDialog()
    },
    updateItem(v) {
      const arr_update = []
      arr_update.push(v)
      this.$emit('saveData', 'update', arr_update)
      this.closeDialog()
    },
    handleItemEmitUpdate(v) {
      const arr_update = []
      arr_update.push(v)
      this.$emit('saveData', 'update', arr_update)
      this.closeDialog()
    },
    updateValue(value) {
      this.value = value
    },
    handleOpen() {
      this.isLoading = false
      this.typeOptions = [...this.typeOptionsFull]
      const tmp = this.data
      this.position = tmp[0].position
      this.parent = tmp[0].flowChartItem_parent
      this.flowChartItem_id = Number(tmp[0].flowChartItem_id)

      if (tmp[0].flowChartItem_id) {
        this.typeSelected = '' + tmp[0].flowChartItemType_id
        this.typeOptions = this.typeOptions.filter(
          (v) => v.flowChartItemType_id === this.typeSelected
        )
        this.modeOperation = 'update'
      } else {
        this.modeOperation = 'create'
        if (this.$route.query?.createOperation) {
          this.formData = {
            flowChartItem_id: null,
            flowChartItem_name: '',
            flowChartItemType_id: '1'
          }
          this.typeSelected = '1'
        } else if (this.$route.query?.createFlowchart) {
          this.formData = {
            flowChartItem_id: null,
            flowChartItem_name: '',
            flowChartItemType_id: '2'
          }
          this.typeSelected = '2'
        } else {
          this.formData = { flowChartItem_id: null, flowChartItem_name: '' }
          // если нажали на 'Добавить внутрь' - скрыть вкладку Заголовок
          if (tmp[0].position === 'in' || tmp[0].treeLevel === 2) {
            this.typeOptions.shift()
            this.typeSelected = '3'
          } else {
            this.typeSelected = '5'
          }
        }
      }
      Object.assign(this.formData, tmp[0])
    },

    saveModalData(event) {
      this.$refs['refFlowchartHeader'].saveData()
    },
    closeDialog() {
      if (this.$route.query?.createOperation) {
        this.$router.push(`/flowchart/edit/${this.$route.params?.id}`)
      }
      this.$emit('update:open', false)
    },
    handleLoad(v) {
      this.isLoading = v
    }
  }
}
</script>

<style scoped>
.flowChart_modal_table_name {
  line-height: 20px;
}
</style>
