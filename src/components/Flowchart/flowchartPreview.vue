<template>
  <div class="app-container sticky_edit modal_preview">
    <!-- <panel-button :show-button="showButtons" @clickBtnClosed="testCorrection" /> -->
    <!-- Предварительный просмотр -->
    <!-- fpc - short for flowchartPreview card -->
    <div class="fpc" :class="{ bidEdit_card_bid: type == 'bid' }">
      <div v-if="type == 'bid'" class="fpc-header">
        <h3 class="fpc-header__name">
          Заявка на изменение тех. карты ({{ $transformStatus(request_state) }})
        </h3>
        <div class="fpc-header__right">
          <div class="fpc-header__owner">
            Владелец: {{ owner.user_lname }} {{ owner.user_fname }}
            {{ owner.user_mname }}
          </div>
          <a class="fpc-header__pdf">Скачать PDF</a>
          <router-link :to="'/flowchart/edit/' + flowchartId">
            <el-button
              v-if="role_name !== 'translator' && editable_state"
              class="warning fpc-header__button"
            >
              Перейти к редактированию
            </el-button>
          </router-link>
        </div>
      </div>
      <!-- Название техкарты -->
      <div
        style="
          color: #0070c0;
          font-weight: bold;
          font-size: 20.5px;
          padding-bottom: 30px;
          text-align: left;
        "
      >
        <flowchart-name :type="type" :data="formData" :comments="comments" />
      </div>
      <!-- Модификации или запчасти техкарты -->
      <div v-if="type == 'bid'" class="fpc-modification">
        <flowchart-modifications
          :modifications="modifications"
          :comments="comments"
        />
      </div>
      <!-- Оборудование и инструменты -->
      <flowchart-equipments
        v-if="equipments.length"
        :type="type"
        :equipments="equipments"
        :comments="comments"
      />
      <!-- Материалы -->
      <flowchart-materials
        v-if="materials.length"
        :type="type"
        :materials="materials"
        :comments="comments"
      />
      <!-- Общие инструменты -->
      <flowchart-generals
        v-if="generals.length"
        :type="type"
        :generals="generals"
        :comments="comments"
      />
      <!-- Специальный инструмент -->
      <flowchart-specials
        v-if="specials.length"
        :type="type"
        :specials="specials"
        :comments="comments"
      />
      <div v-for="(tools, index) in items" :key="index">
        <div v-for="tool in tools" :key="tool.flowchartItem_id">
          <flowchart-notification
            v-if="
              tool.flowChartItemType_id === 4 || tool.flowChartItemType_id === 7
            "
            :type="type"
            :data="tool"
          />
          <flowchart-title
            v-if="tool.flowChartItemType_id === 5"
            :type="type"
            :data="tool"
          />
          <flowchart-redirect
            v-if="
              tool.flowChartItemType_id === 2 || tool.flowChartItemType_id === 3
            "
            :key="index"
            :type="type"
            :data="tool"
            :flowchart-id="flowchartId"
            :comments="comments"
          />
          <flowchart-table
            v-if="tool.flowChartItemType_id === 6"
            :data="tool"
            :type="type"
            :flowchart-id="flowchartId"
            :comments="comments"
          />
          <flowchart-operation
            v-if="Array.isArray(tool)"
            :data="tool"
            :type="type"
            :flowchart-id="flowchartId"
            :comments="comments"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import { mapGetters } from 'vuex'
// import PanelButton from '@/components/PanelButton/PanelButton'
import FlowchartName from '@/components/Flowchart/flowchartName'
import FlowchartModifications from '@/components/Flowchart/flowchartModifications'
import FlowchartEquipments from '@/components/Flowchart/flowchartEquipments'
import flowchartMaterials from '@/components/Flowchart/flowchartMaterials'
import FlowchartGenerals from '@/components/Flowchart/flowchartGenerals'
import FlowchartSpecials from '@/components/Flowchart/flowchartSpecials'
import FlowchartNotification from '@/components/Flowchart/flowchartNotification'
import FlowchartTitle from '@/components/Flowchart/flowchartTitle'
import FlowchartRedirect from '@/components/Flowchart/flowchartRedirect'
import FlowchartTable from '@/components/Flowchart/flowchartTable'
import FlowchartOperation from '@/components/Flowchart/flowchartOperation'

function combine(obj) {
  const mapping = []
  const result = []
  let data = []
  for (let i = 0; i < obj.length; i = i + 1) {
    const flowchart = obj[i]
    if (mapping.length === 0) {
      mapping.push(flowchart.flowChartItemType_id)
      data.push(flowchart)
    } else if (
      mapping[mapping.length - 1] === flowchart.flowChartItemType_id ||
      mapping[mapping.length - 1] === 5
    ) {
      mapping.push(flowchart.flowChartItemType_id)
      data.push(flowchart)
    } else {
      result.push(data)
      data = []
      mapping.push(flowchart.flowChartItemType_id)
      data.push(flowchart)
    }

    if (i === obj.length - 1) {
      result.push(data)
    }
  }

  return result
}
function formatter(obj) {
  const newObj = obj.map((item) => {
    if (item.filter((item2) => item2.flowChartItemType_id === 1).length > 0) {
      const result = []
      const images = []
      for (let i = 0; i < item.length; i = i + 1) {
        if (item[i].flowChartItemType_id !== 1) {
          result.push(item[i])
        } else {
          if (item[i].operation_image) {
            images.push({ ...item[i], children: [item[i]] })
          } else {
            if (!images[images.length - 1]) {
              images.push({ ...item[i], children: [item[i]] })
            } else {
              images[images.length - 1].children.push(item[i])
            }
          }
        }
      }
      result.push(images)
      return result
    }
    return item
  })
  return newObj
}

export default {
  name: 'BidEdit',
  components: {
    FlowchartName,
    FlowchartModifications,
    FlowchartEquipments,
    flowchartMaterials,
    FlowchartGenerals,
    FlowchartSpecials,
    FlowchartNotification,
    FlowchartTitle,
    FlowchartRedirect,
    FlowchartTable,
    FlowchartOperation
  },
  props: {
    flowchartId: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: 'preview'
    },
    comments: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      specials: [],
      equipments: [],
      materials: [],
      generals: [],
      storage: process.env.VUE_APP_BACKEND_HOST + '/storage/',
      items: [],
      formData: {},
      operations: [],
      flowcharts: [],
      notifications: [],
      headers: [],
      modifications: [],
      parts: [],
      owner: [],
      showButtons: [{ label: 'Закрыть', color: 'grey', emit: 'clickBtnClosed' }]
    }
  },

  computed: {
    ...mapGetters(['role_name', 'request_state', 'editable_state'])
  },
  watch: {
    flowchartId(newValue) {
      this.getItems()
    }
  },
  mounted() {
    console.log(
      '🚀 \x1b[33m ~ file: c_flowchartPreview.vue:245',
      this.flowchartId
    )
    this.getItems()
    this.getEquipments()
  },
  methods: {
    async getItems() {
      const res = await request({
        url: '/flowchart/get/' + this.flowchartId,
        method: 'get',
        params: {}
      })
      this.formData = res.data
      this.modifications = this.formData.modifications
      this.modifications = [
        ...this.formData.modifications,
        ...this.formData.parts
      ]
      this.owner = this.formData.owner
      if (this.formData.items) {
        this.items = formatter(combine(this.formData.items))
        this.operations = this.formData.items.filter(
          (v) => v.flowChartItemType_id === 1
        )
        this.flowcharts = this.formData.items.filter(
          (v) => v.flowChartItemType_id === 2
        )
        this.notifications = this.formData.items.filter(
          (v) => v.flowChartItemType_id === 4
        )
        this.headers = this.formData.items.filter(
          (v) => v.flowChartItemType_id === 5
        )
      }
    },
    async getEquipments() {
      const res = await request({
        url: '/flowchart/tool/' + this.flowchartId,
        method: 'get',
        params: {}
      })
      Object.values(res.data).forEach((x) => {
        x.forEach((y) => {
          if (y.toolType_id === 1) {
            this.specials.push(y)
          }
          if (y.toolType_id === 2) {
            this.equipments.push(y)
          }
          if (y.toolType_id === 3) {
            this.materials.push(y)
          }
          if (y.toolType_id === 4) {
            this.generals.push(y)
          }
        })
      })
    },
    testCorrection() {
      alert('333')
    }
  }
}
</script>
<style>
.fpc {
  box-sizing: border-box;
  max-width: 892px;
  color: rgba(0, 0, 0, 0.87);
}
.bidEdit_card_bid {
  margin: 12px 0;
  padding: 5px 5px 10px;
  border-top: 3px solid #c5e0d9;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
.fpc-header {
  display: flex;
  justify-content: space-between;
  padding: 9px 4px 0px;
  margin-bottom: 28px;
  color: #003d2d !important;
  border-bottom: 1px solid #f4f4f4;
}
.fpc-header__name {
  margin: 0;
  text-transform: uppercase;
  font-size: 18px;
  line-height: 1;
  font-family: 'Source Sans Pro', sans-serif;
  font-weight: 500;
  color: #003d2d;
  text-align: left;
  word-break: break-word;
}
.fpc-header__right {
  display: block;
  width: 300px;
  font-family: 'Consolas', 'Microsoft YaHei', Arial, arial, sans-serif;
  font-weight: 400;
  font-size: 14px;
  text-align: right;
}
.fpc-header__owner {
  padding-bottom: 10px;
}
.fpc-header__pdf,
.fpc-header__pdf:hover,
.fpc-header__pdf:active,
.fpc-header__pdf:focus {
  display: inline-block;
  border-bottom: 1px dashed #000;
  margin-bottom: 15px;
  cursor: pointer;
  color: #000;
  font-size: 16px;
  font-family: 'Consolas', 'Microsoft YaHei', Arial, arial, sans-serif;
}
.fpc-header__button {
  text-transform: uppercase;
  font-size: 14px;
  padding: 6px 12px;
}
.fpc-flowchart {
  color: #0070c0;
  font-weight: bold;
  font-size: 18px;
  font-weight: 100;
  font-family: 'Source Sans Pro', sans-serif;
  opacity: 0.7;
  cursor: pointer;
  text-align: center;
  text-transform: capitalize;
  word-break: break-word;
  padding-bottom: 27px;
}
.fpc_flowchart_bid {
  display: flex;
  justify-content: center;
}
/* ============ fpc-modification ============ */
.fpc-modification {
  margin-left: 23px;
  margin-bottom: 40px;
}
/* .fpc-modification__name {
} */
.fpc-modification__mods {
  font-family: 'Consolas', 'Microsoft YaHei', Arial, arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
}
/* ============ fpc-equipment ============ */
.fpc-equipment__item {
  font-size: 21px;
  font-weight: bold;
  font-family: 'Times New Roman';
  color: rgba(0, 0, 0, 0.87);
  padding-left: 5px;
  padding-bottom: 17px;
}
.fpc-equipment__table {
  margin: 0 3px;
  width: 645px;
  /* align-items: flex-start; */
}
.fpc-equipment__table td {
  vertical-align: top;
}
.fpc-equipment__table .cell {
  flex-direction: column;
}
</style>
