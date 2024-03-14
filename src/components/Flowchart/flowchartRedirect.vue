<template>
  <div class="redirect">
    <el-row :gutter="20">
      <el-col :span="23">
        <div
          v-if="type == 'preview'"
          class="redirect"
          style="
            color: black;
            font-weight: bold;
            font-size: 15.5px;
            padding-bottom: 10px;
          "
        >
          <span>Обратиться к инструкции: {{ data.flowChartItem_name }}</span>
          <span> ({{ data.flowChart_code_ref }})</span>
        </div>
        <div v-if="type == 'bid'">
          <!-- Russian -->
          <p class="redirect button" @click="addComment()">
            <span v-if="role_name === 'translator'"> RU: </span>
            <span>Обратиться к инструкции: {{ data.flowChartItem_name }}</span>
            <span> ({{ data.flowChart_code_ref }})</span>
          </p>
          <!-- English -->
          <p
            v-if="role_name === 'translator'"
            class="redirect button"
            @click="editHeader(data)"
          >
            <span> EN: </span>
            <span>
              Refer to the instruction: {{ data.flowChartItem_name_en }}
            </span>
            <span> ({{ data.flowChart_code_ref }})</span>
          </p>
        </div>
        <!-- <p v-else class="button title" @click="openModal(data)">
          <span
            v-if="role_name === 'translator'"
            style="text-transform: uppercase"
          >
            {{ lang }}:
          </span>
          {{
            lang == 'ru'
              ? 'Обратиться к инструкции:'
              : 'Refer to the instruction -'
          }}
          {{
            lang == 'ru' ? data.flowChartItem_name : data.flowChartItem_name_en
          }}
          <span> ({{ data.flowChart_code_ref }})</span>
        </p> -->
      </el-col>
      <el-col :span="1">
        <flowchart-message :comments.sync="commentsById" />
      </el-col>
    </el-row>
    <header-dialog
      :data.sync="headerData"
      :open.sync="isHeaderOpen"
      @saveData="saveHeader"
    />
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
import HeaderDialog from '@/components/Dialog/HeaderDialog'
import flowchartMessage from '@/components/Flowchart/flowchartMessage'
export default {
  components: {
    FlowchartChangeDialog,
    HeaderDialog,
    flowchartMessage
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
      isModalOpen: false,
      isHeaderOpen: false,
      headerData: {
        flowChartItem_name: '',
        flowChartItem_name_en: '',
        flowChartItem_name_es: ''
      },
      tempData: {
        comment_time: '',
        fio: '',
        comment_description: ''
      },
      // comments: [
      //   {
      //     comment_time: this.$localeDate(Date.now()),
      //     fio: 'администратор',
      //     comment_description:
      //       'fdsgfgfd hsdfhsdfhdfhd ashfhfdhdhfd hfhdshsfdhfdhdsfhsdhdhdhd hfdshdfhdhdhds'
      //   }
      // ],
      activeRow: {}
    }
  },
  computed: {
    ...mapGetters(['role_name', 'fio']),
    commentsById() {
      const id = this.data.flowChartItem_id
      return this.comments.filter((item) => item.object_id === id)
    }
  },
  methods: {
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
    async saveComments($type) {
      if ($type === 'update') {
        Object.assign(this.activeRow, this.tempData)
      }
      if ($type === 'create') {
        const res = await request({
          url: '/comments/',
          method: 'get',
          params: {
            request_id: this.$route.params.id
          }
        })
        this.comments = res.data
      }
    },
    editHeader(data) {
      this.activeRow = data
      Object.assign(this.headerData, data)
      this.isHeaderOpen = true
    },
    saveHeader() {
      Object.assign(this.activeRow, this.headerData)
    }
  }
}
</script>
<style scoped>
.button:hover {
  background-color: orange;
  cursor: pointer;
}
</style>
