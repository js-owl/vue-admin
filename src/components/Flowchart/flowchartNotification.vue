<template>
  <div class="flowchart">
    <el-row>
      <el-col :span="23">
        <div v-if="type == 'preview'" style="padding-bottom: 10px">
          <span
            v-if="data.notification_icon === 'warning'"
            class="glyphicon glyphicon-warning-sign"
            style="color: #ffa500"
          />
          <span
            v-if="data.notification_icon === 'error'"
            class="glyphicon glyphicon-warning-sign"
            style="color: #d8000c"
          />
          <span v-if="data.notification_icon === 'single'">
            <svg-icon
              icon-class="notification-delete-icon"
              class="notification__icon"
            />
          </span>
          <span
            v-if="data.notification_icon === 'trash'"
            class="glyphicon glyphicon-trash notification__icon"
            style="color: #000"
          />
          <span
            v-if="data.isWarning"
            style="color: red; font-weight: bold; font-size: 15.5px"
          >
            ВНИМАНИЕ:
            {{ data.flowChartItem_name }}
          </span>
          <span
            v-else
            style="color: #0070c0; font-weight: bold; font-size: 15.5px"
          >
            УВЕДОМЛЕНИЯ: {{ data.flowChartItem_name }}</span
          >
        </div>
        <div v-if="type == 'bid'">
          <!-- Russian -->
          <div
            class="notification button"
            style="color: #0070c0"
            @click="addComment()"
          >
            <span v-if="role_name === 'translator'"> RU: </span>
            <span
              v-if="data.notification_icon === 'warning'"
              class="glyphicon glyphicon-warning-sign"
              style="color: #ffa500"
            />
            <span
              v-if="data.notification_icon === 'error'"
              class="glyphicon glyphicon-warning-sign"
              style="color: #d8000c"
            />
            <span
              v-if="data.notification_icon === 'single'"
              icon-class="notification-delete-icon"
              class="notification__icon"
            />
            <span
              v-if="data.notification_icon === 'trash'"
              class="glyphicon glyphicon-trash notification__icon"
              style="color: #000"
            />
            <span v-if="data.isWarning" style="color: #d8000c">
              ВНИМАНИЕ:
              {{ data.flowChartItem_name }}
            </span>
            <span v-else> УВЕДОМЛЕНИЯ: {{ data.flowChartItem_name }}</span>
          </div>
          <!-- English -->
          <div
            v-if="role_name === 'translator'"
            class="notification button"
            style="color: #0070c0"
            @click="editNotification(data)"
          >
            <span> EN: </span>
            <span
              v-if="data.notification_icon === 'warning'"
              class="glyphicon glyphicon-warning-sign"
              style="color: #ffa500"
            />
            <span
              v-if="data.notification_icon === 'error'"
              class="glyphicon glyphicon-warning-sign"
              style="color: #d8000c"
            />
            <span
              v-if="data.notification_icon === 'single'"
              icon-class="notification-delete-icon"
              class="notification__icon"
            />
            <span
              v-if="data.notification_icon === 'trash'"
              class="glyphicon glyphicon-trash notification__icon"
              style="color: #000"
            />
            <span v-if="data.isWarning" style="color: #d8000c">
              ATTENTION:
              {{ data.flowChartItem_name_en }}
            </span>
            <span v-else> CAUTION: {{ data.flowChartItem_name_en }}</span>
          </div>
        </div>

        <!-- <div v-else>
          <p class="button" style="color: #0070c0" @click="openModal(data)">
            <span
              v-if="role_name === 'translator'"
              style="text-transform: uppercase"
            >
              {{ lang }}:
            </span>

            <span
              v-if="data.notification_icon === 'warning'"
              class="glyphicon glyphicon-warning-sign"
              style="color: #ffa500"
            />
            <span
              v-if="data.notification_icon === 'error'"
              class="glyphicon glyphicon-warning-sign"
              style="color: #d8000c"
            />
            <span
              v-if="data.notification_icon === 'single'"
              icon-class="notification-delete-icon"
              class="notification__icon"
            />
            <span
              v-if="data.notification_icon === 'trash'"
              class="glyphicon glyphicon-trash notification__icon"
              style="color: #000"
            />
            <span v-if="data.isWarning">
              {{ lang == 'ru' ? 'ВНИМАНИЕ:' : 'ATTENTION:' }}
              {{
                lang == 'ru'
                  ? data.notification_text
                  : data.notification_text_en
              }}
            </span>
            <span v-else>
              {{ lang == 'ru' ? 'УВЕДОМЛЕНИЯ:' : 'CAUTION:' }}
              {{
                lang == 'ru'
                  ? data.notification_text
                  : data.notification_text_en
              }}
            </span>
          </p>
        </div> -->
      </el-col>
      <el-col :span="1">
        <flowchart-message-store :item-id="data.flowChartItem_id" />
      </el-col>
    </el-row>
    <notification-dialog
      :open.sync="isNotificationOpen"
      :data.sync="notificationData"
      @saveData="saveNotification"
    />
    <flowchart-change-dialog
      :data.sync="tempData"
      :open.sync="isModalOpen"
      @saveData="getRequestComments($route.params.id)"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import FlowchartChangeDialog from '@/components/Dialog/FlowchartChangeDialog'
import NotificationDialog from '@/components/Dialog/NotificationDialog'
import flowchartMessageStore from '@/components/Flowchart/flowchartMessageStore'

export default {
  components: {
    FlowchartChangeDialog,
    NotificationDialog,
    flowchartMessageStore
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    type: {
      type: String,
      default: 'preview'
    }
  },
  data() {
    return {
      isNotificationOpen: false,
      notificationData: {
        isActive: 1,
        isWarning: 0,
        notification_icon: 'warning',
        notification_text: '',
        notification_text_en: '',
        notification_text_es: '',
        flowChartItem_name_en: '',
        flowChartItem_name_es: ''
      },
      isModalOpen: false,
      tempData: {
        comment_time: '',
        fio: '',
        comment_description: ''
      },
      activeRow: {}
    }
  },
  computed: {
    ...mapGetters(['user_id', 'role_name', 'fio'])
  },

  methods: {
    ...mapActions('request', ['getRequestComments']),
    addComment() {
      this.activeRow = null
      this.tempData = {
        fio: this.fio,
        request_id: this.$route.params.id,
        object_id: this.data.flowChartItem_id,
        comment_description: '',
        user_id: this.user_id,
        comment_target: 'flowchart'
      }
      this.isModalOpen = true
    },
    editNotification(data) {
      this.activeRow = data
      Object.assign(this.notificationData, data)
      this.isNotificationOpen = true
    },
    saveNotification() {
      Object.assign(this.activeRow, this.notificationData)
    }
  }
}
</script>
<style scoped>
.button:hover {
  background-color: orange;
  cursor: pointer;
}
.notification {
  display: block;
  width: 640px;
  text-align: left;
  font-size: 15.5px;
  font-weight: 500;
  white-space: normal;
}
</style>
