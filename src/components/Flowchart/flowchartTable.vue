<template>
  <div class="flowchartTable">
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
          {{ data.flowChartItem_name }}
        </div>
        <span v-html="data.tables_description" />
        <div v-if="type == 'bid'">
          <div class="title button" @click="addComment()">
            <span v-if="role_name === 'translator'">RU: </span>
            <span v-html="data.flowChartItem_name" />
          </div>
          <div
            v-if="role_name === 'translator'"
            class="title button"
            @click="editTable(data)"
          >
            <span>EN: </span>
            <span v-html="data.flowChartItem_name_en" />
          </div>
        </div>
      </el-col>
      <el-col :span="1">
        <flowchart-message :comments.sync="commentsById" />
      </el-col>
    </el-row>

    <flowchart-change-dialog
      :open.sync="isCommentOpen"
      :data.sync="commentData"
      @saveData="saveComment"
    />
    <table-dialog
      :open.sync="isTableOpen"
      :data.sync="tableData"
      @saveData="saveTable"
    />
  </div>
</template>

<script>
import request from '@/utils/request'
import { mapGetters } from 'vuex'
import FlowchartChangeDialog from '@/components/Dialog/FlowchartChangeDialog'
import TableDialog from '@/components/Dialog/TableDialog'
import flowchartMessage from '@/components/Flowchart/flowchartMessage'

export default {
  components: {
    FlowchartChangeDialog,
    TableDialog,
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
    lang: {
      type: String,
      default: 'ru'
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
      isTableOpen: false,
      tableData: {},

      isCommentOpen: false,
      commentData: {},
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
      // return this.comments
      return this.comments.filter((item) => item.object_id === id)
    }
  },
  methods: {
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
    async saveComment($type) {
      if ($type === 'update') {
        Object.assign(this.activeRow, this.commentData)
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

    saveTable() {
      Object.assign(this.activeRow, this.tableData)
    },
    editTable(data) {
      this.activeRow = data
      Object.assign(this.tableData, data)
      this.isTableOpen = true
    }
  }
}
</script>
<style>
.button:hover {
  background-color: orange;
  cursor: pointer;
}
.flowchartTable {
  margin-top: 20px;
}
.table table {
  border: 1px double #b3b3b3;
  border-collapse: collapse;
  border-spacing: 0;
  height: 100%;
  width: 100%;
}
.table td {
  border: 1px solid #bfbfbf;
  min-width: 2em;
  padding: 0.4em;
}
</style>
