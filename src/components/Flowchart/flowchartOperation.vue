<template>
  <div class="operation">
    <el-row class="operation_table_thead">
      <div class="operation_row-container">
        <el-col :span="10" class="operation_title operation_title-left">
          Изображение
        </el-col>
        <el-col :span="10" class="operation_title operation_title-right">
          Описание операции
        </el-col>
      </div>
    </el-row>
    <el-row
      v-for="(item, index) in data"
      :key="index"
      class="operation_table_tbody"
    >
      <div class="operation_row-container">
        <el-col :span="10" class="td_left operation_row_border-top">
          <div v-if="item.operation_image">
            <img
              class="uaz__flowchart-img"
              :src="storage + item.operation_image"
            />
            Рис. {{ index + 1 }}
          </div>
          <div v-else>
            <img class="uaz__flowchart-img" src="placeholder.PNG" />
          </div>
        </el-col>
        <el-col v-if="!editable_state" :span="10" class="td_right">
          <div
            v-for="(item2, index2) in item.children"
            :key="item2.flowChartItem_id"
            class="uaz__flowchart-section"
            style="width: 265px"
          >
            <div
              v-if="type == 'preview'"
              class="padding-left name"
              style="margin: 0 0 3rem"
            >
              <div>
                {{ currentIndex(index, index2) }}.
                {{ item2.flowChartItem_name }}
              </div>
            </div>
            <div
              v-if="type == 'bid'"
              class="padding-left name button"
              style="margin: 0 0 3rem"
              @click="addComment(item2)"
            >
              <div>
                <div v-if="role_name == 'translator'">RU:</div>
                {{ currentIndex(index, index2) }}.
                {{ item2.flowChartItem_name }}
              </div>
              <div v-if="role_name == 'translator'">
                EN:
                {{ currentIndex(index, index2) }}.
                {{ item2.operation_name_en }}
              </div>
            </div>
            <p
              v-for="tool in item2.tools"
              :key="tool.tool_name"
              style="margin: 0 0 3rem"
            >
              <strong class="padding-left">{{ tool.tool_name }}</strong>
            </p>
            <p v-if="item2.operation_torque">
              <strong class="padding-left">
                Момент затяжки - {{ item2.operation_torque }} Н·м
              </strong>
            </p>
            <div v-if="item2.operation_description" class="padding-left">
              <div v-if="role_name == 'translator'">RU:</div>
              <strong class="padding-left">
                {{ item2.operation_description }}
              </strong>

              <div v-if="role_name == 'translator'">
                EN: {{ item2.operation_name_en }}
              </div>
              <div
                v-for="n in [
                  { i: 1, note: 'a', notification_icon: 'warning' },
                  { i: 2, note: 'b', notification_icon: 'warning' }
                ]"
                :key="n.i"
                style="color: #0070c0; font-weight: bold; padding-top: 20px"
              >
                <span
                  v-if="n.notification_icon === 'warning'"
                  class="glyphicon glyphicon-warning-sign"
                  style="color: #ffa500"
                />
                <span
                  v-if="n.notification_icon === 'error'"
                  class="glyphicon glyphicon-warning-sign"
                  style="color: #d8000c"
                />
                <span
                  v-if="n.notification_icon === 'single'"
                  icon-class="notification-delete-icon"
                  class="notification__icon"
                />
                <span
                  v-if="n.notification_icon === 'trash'"
                  class="glyphicon glyphicon-trash notification__icon"
                  style="color: #000"
                />
                {{ n.note }}
              </div>
            </div>
            <flowchart-message
              class="flowchart-message-operation"
              :comments="commentsById(item2.flowChartItem_id)"
            />
          </div>
        </el-col>
        <el-col v-if="editable_state" :span="10" class="td_right">
          <div
            v-for="(item2, index2) in item.children"
            :key="item2.flowChartItem_id"
            class="uaz__flowchart-section"
            style="width: 265px"
          >
            <div
              v-if="type == 'bid'"
              class="padding-left name"
              style="margin: 0 0 3rem"
            >
              <el-row style="padding-right: 0">
                <el-col :span="20" style="border: none">
                  <div class="button" @click="addComment(item2)">
                    <div v-if="role_name == 'translator'">RU:</div>
                    {{ currentIndex(index, index2) }}.
                    {{ item2.flowChartItem_name }}
                  </div>
                  <div v-if="role_name == 'translator'">
                    EN:
                    {{ currentIndex(index, index2) }}.
                    {{ item2.operation_name_en }}
                  </div>
                </el-col>
                <el-col :span="4" style="border: none">
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
                      @click="goOperation(item2.operation_id)"
                    >
                      <i class="el-icon-edit" />
                    </el-button>
                  </el-tooltip>
                </el-col>
              </el-row>
              <p
                v-for="tool in item2.tools"
                :key="tool.tool_name"
                style="margin: 0 0 3rem"
              >
                <strong class="padding-left">{{ tool.tool_name }}</strong>
              </p>
              <p v-if="item2.operation_torque">
                <strong class="padding-left">
                  Момент затяжки - {{ item2.operation_torque }} Н·м
                </strong>
              </p>
              <div v-if="item2.operation_description" class="padding-left">
                <div>
                  <div v-if="role_name == 'translator'">RU:</div>
                  {{ item2.operation_description }}
                </div>
                <div v-if="role_name == 'translator'">
                  EN: {{ item2.operation_name_en }}
                </div>
              </div>
              <flowchart-message
                class="flowchart-message-operation"
                :comments="commentsById(item2.flowChartItem_id)"
              />
            </div>
          </div>
        </el-col>
      </div>
    </el-row>
    <flowchart-change-dialog
      :data.sync="tempData"
      :open.sync="isModalOpen"
      @saveData="saveComments"
    />
  </div>
</template>

<script>
import request from '@/utils/request'
import { mapGetters } from 'vuex'
import FlowchartChangeDialog from '@/components/Dialog/FlowchartChangeDialog'
import flowchartMessage from '@/components/Flowchart/flowchartMessage'

export default {
  components: {
    FlowchartChangeDialog,
    flowchartMessage
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    type: {
      type: String,
      default: 'preview'
    },
    flowchartId: {
      type: Number,
      default: ''
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
      request_id: this.$route.params.id,
      storage: process.env.VUE_APP_BACKEND_HOST + '/storage/',
      isModalOpen: false,
      tempData: {
        comment_time: '',
        fio: '',
        comment_description: ''
      },
      // comments: [
      //   {
      //     comment_time: this.$localeDate(Date.now()),
      //     fio: 'администратор',
      //     comment_description: 'operation'
      //   }
      // ],
      activeRow: {}
    }
  },
  computed: {
    ...mapGetters(['role_name', 'fio', 'editable_state'])
  },
  mounted() {
    this.commentsById()
  },
  methods: {
    commentsById(id) {
      return this.comments.filter((item) => item.object_id === id)
    },
    currentIndex: function (imagesIndex, recordIndex) {
      let index = 1
      let len = 0
      for (let i = 0; i < imagesIndex; i = i + 1) {
        len = this.data[i].children.length
        index = index + len
      }
      return index + recordIndex
    },
    addComment(item2) {
      this.activeRow = null
      this.tempData = {
        fio: this.fio,
        request_id: this.request_id,
        object_id: item2.flowChartItem_id,
        comment_description: '',
        user_id: this.user_id,
        comment_target: 'flowchart'
      }
      this.isModalOpen = true
    },
    async saveComments($type) {
      if ($type === 'update') {
        Object.assign(this.activeRow, this.tempData)
      }
      if ($type === 'create') {
        const res = await request({
          url: '/comments/',
          method: 'get',
          params: {
            request_id: this.request_id
          }
        })
        this.comments = res.data
      }
    },
    goOperation(id) {
      this.$router.push(`/operations/edit/${id}?request_id=${this.request_id}`)
    }
  }
}
</script>

<style scoped>
.button:hover {
  background-color: orange;
  cursor: pointer;
}

.operation {
  border-left: 1px solid #000;
  margin: 5px -10px 5px 0;
  font-family: 'Times New Roman';
  font-size: 15.5px;
  line-height: 1;
  box-sizing: border-box;
}

.operation_title {
  font-weight: bold;
  padding: 10px 0;
  text-align: center;
  border: 1px solid #000;
  border-right: none;
}

.operation_title-left {
  border-left: none;
}

.operation_title-right {
  border-right: 1px solid #000;
}
.operation_row-container {
  display: flex;
  flex-direction: row;
  align-items: stretch;
}

.operation_row_border-top {
  border-bottom: 1px solid #000;
  box-sizing: border-box;
}

.td_left {
  padding: 0.5cm 0.25cm 0;
}

.td_right {
  padding: 5px;
}
.operation_title-right,
.td_right {
  width: 275px;
}

.td_right {
  border: 1px solid #000;
  border-top: none;
  box-sizing: border-box;
}

.td_right:last-of-child {
  border-bottom: 1px solid #000;
}

.uaz__flowchart-img {
  width: 100%;
  object-fit: cover;
}
</style>
