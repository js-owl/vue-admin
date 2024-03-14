<template>
  <div class="flowchart-mod">
    <el-row :gutter="20">
      <el-col :span="23">
        <div class="title button" @click="addComment()">
          <el-col :span="6">
            <div class="fpc-modification__name" />
            Относится к:
          </el-col>
          <el-col v-if="modifications.length > 0" :span="18">
            <div
              v-for="m in modifications"
              :key="
                m.productModification_id ? m.productModification_id : m.part_id
              "
              class="fpc-modification__mods"
            >
              {{
                m.productModification_name
                  ? m.productModification_name
                  : `${m.part_code} - ${m.part_name}`
              }}
            </div>
          </el-col>
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
    modifications: {
      type: Array,
      default: () => {
        return []
      }
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
      isCommentOpen: false,
      commentData: {
        fio: '',
        comment_time: '',
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
    ...mapGetters(['fio']),
    commentsById() {
      return this.comments.filter(
        (item) => item.comment_target === 'flowChart_parts'
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
        comment_target: 'flowChart_parts'
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
    }
  }
}
</script>
<style scoped>
.button:hover {
  background-color: orange;
  cursor: pointer;
}

.flowchart-mod {
  margin: 5px 0;
}
</style>
