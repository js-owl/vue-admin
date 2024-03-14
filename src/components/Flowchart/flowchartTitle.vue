<template>
  <div class="title2">
    <el-row :gutter="20">
      <el-col :span="23">
        <div
          v-if="type == 'preview'"
          style="
            color: black;
            font-weight: bold;
            font-size: 15.5px;
            padding-bottom: 10px;
          "
        >
          <span v-html="data.flowChartItem_name" />
        </div>
        <div v-if="type == 'bid'">
          <div class="title button" @click="addComment()">
            <span v-if="role_name === 'translator'">RU: </span>
            <span v-html="data.flowChartItem_name" />
          </div>
          <div
            v-if="role_name === 'translator'"
            class="title button"
            @click="editHeader(data)"
          >
            <span>EN: </span>
            <span v-html="data.flowChartItem_name_en" />
          </div>
        </div>
      </el-col>
      <el-col :span="1">
        <flowchart-message-store
          v-if="lang == 'ru'"
          :item-id="data.flowChartItem_id"
        />
      </el-col>
    </el-row>
    <header-dialog
      :data.sync="headerData"
      :open.sync="isHeaderOpen"
      @saveData="saveHeader"
    />
    <flowchart-change-dialog
      :open.sync="isCommentOpen"
      :data.sync="commentData"
      @saveData="getRequestComments($route.params.id)"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import FlowchartChangeDialog from '@/components/Dialog/FlowchartChangeDialog'
import HeaderDialog from '@/components/Dialog/HeaderDialog'
import flowchartMessageStore from '@/components/Flowchart/flowchartMessageStore'

export default {
  components: { FlowchartChangeDialog, HeaderDialog, flowchartMessageStore },
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
    lang: {
      type: String,
      default: 'ru'
    }
  },
  data() {
    return {
      isHeaderOpen: false,
      headerData: {
        flowChartItem_name: '',
        flowChartItem_name_en: '',
        flowChartItem_name_es: ''
      },
      isCommentOpen: false,
      commentData: {},
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
      this.commentData = {
        fio: this.fio,
        request_id: this.$route.params.id,
        object_id: this.data.flowChartItem_id,
        comment_description: '',
        user_id: this.user_id,
        comment_target: 'flowchart'
      }
      this.isCommentOpen = true
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
<style>
.button:hover {
  background-color: orange;
  cursor: pointer;
}
.pre {
  text-transform: uppercase;
}
</style>
