<template>
  <div class="flowchart-name">
    <el-row :gutter="20">
      <el-col :span="23">
        <div v-if="type == 'preview'">
          <span>
            {{ data.flowChart_name }}
            ({{ data.flowChart_code }})
          </span>
        </div>
        <div v-if="type == 'bid'">
          <p class="title button" @click="addComment()">
            <span v-if="role_name === 'translator'"> RU: </span>
            <span>
              {{ data.flowChart_name }}
              ({{ data.flowChart_code }})
            </span>
          </p>
          <p v-if="role_name === 'translator'" class="title">
            <span> EN: </span>
            <span>
              {{ data.flowChart_name_en }}
              ({{ data.flowChart_code }})
            </span>
            <el-button
              size="mini"
              class="el-button-icon"
              @click="editName(data)"
            >
              <i class="el-icon-edit" />
            </el-button>
          </p>
        </div>
      </el-col>
      <el-col :span="1">
        <flowchart-message :comments.sync="commentsById" />
      </el-col>
    </el-row>
    <flowchart-change-dialog
      :data.sync="commentData"
      :open.sync="isCommentOpen"
      @saveData="saveComments"
    />
    <flowchart-name-dialog
      :data.sync="nameData"
      :open.sync="isNameOpen"
      @saveData="saveName"
    />
  </div>
</template>

<script>
import request from '@/utils/request'
import { mapGetters } from 'vuex'
import FlowchartChangeDialog from '@/components/Dialog/FlowchartChangeDialog'
import FlowchartNameDialog from '@/components/Dialog/FlowchartNameDialog'
import flowchartMessage from '@/components/Flowchart/flowchartMessage'
export default {
  components: {
    FlowchartChangeDialog,
    FlowchartNameDialog,
    flowchartMessage
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    comments: {
      type: Array,
      default: () => {
        return []
      }
    },
    type: {
      type: String,
      default: 'preview'
    }
  },
  data() {
    return {
      isCommentOpen: false,
      commentData: {
        comment_time: '',
        fio: '',
        comment_description: ''
      },
      isNameOpen: false,
      nameData: {
        flowChartItem_name: '',
        flowChartItem_name_en: '',
        flowChartItem_name_es: ''
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
      return this.comments.filter(
        (item) => item.comment_target === 'flowChart_name'
      )
    }
  },
  methods: {
    addComment() {
      this.activeRow = null
      this.commentData = {
        fio: this.fio,
        comment_description: '',
        request_id: this.$route.params.id,
        comment_target: 'flowChart_name'
      }
      this.isCommentOpen = true
    },
    async saveComments($type) {
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
    editName(data) {
      this.activeRow = data
      Object.assign(this.nameData, data)
      this.isNameOpen = true
    },
    saveName() {
      Object.assign(this.activeRow, this.nameData)
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
