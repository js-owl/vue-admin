<template>
  <el-popover
    v-if="comments.length > 0"
    placement="right-start"
    width="300"
    trigger="click"
    popper-class="comment-container"
  >
    <el-table :data="comments" class="comment-table" :show-header="false">
      <el-table-column>
        <template #default="props">
          <div class="comment">
            <el-row>
              <el-col :span="13">
                <p class="comment__fio">{{ props.row.fio }}</p>
              </el-col>
              <el-col :span="11">
                <p class="comment__time">
                  {{ $localeDate(props.row.comment_time) }}
                </p>
              </el-col>
            </el-row>
            <el-row v-if="props.row.comment_file" :gutter="20">
              <el-col :span="8">
                <img
                  style="max-width: 100%; height: auto; cursor: pointer"
                  :src="storage + props.row.comment_file"
                  @click="showImage(props.row.comment_file)"
                />
              </el-col>
              <el-col :span="16">
                <p class="comment__text">
                  {{ props.row.comment_description }}
                </p>
              </el-col>
            </el-row>
            <el-row v-else>
              <el-col :span="24">
                <p class="comment__text">
                  {{ props.row.comment_description }}
                </p>
              </el-col>
            </el-row>
            <div class="comment-button-container">
              <div v-if="user_id === props.row.user_id">
                <p
                  v-if="
                    lastCommentIdUser == props.row.comment_id &&
                      lastCommentIdUser == lastCommentId
                  "
                  class="comment__button"
                >
                  <el-button
                    type="text"
                    size="mini"
                    class="button-in-comment"
                    @click="editComment(props.$index, props.row)"
                  >
                    Редактировать
                  </el-button>
                  <el-button
                    type="text"
                    size="mini"
                    class="button-in-comment"
                    @click="deleteComment(props.$index, props.row)"
                  >
                    Удалить
                  </el-button>
                </p>
              </div>
              <el-button
                v-if="lastCommentId == props.row.comment_id"
                type="text"
                class="comment__reply"
                @click="addComment(props.$index, props.row)"
              />
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-button v-if="true" slot="reference" type="text" class="comment__icon">
      &#160;
    </el-button>
    <flowchart-change-dialog
      :data.sync="tempData"
      :open.sync="isModalOpen"
      @saveData="saveComments"
    />
    <image-dialog :open.sync="isImageOpen" :data.sync="imageData" />
  </el-popover>
</template>

<script>
import request from '@/utils/request'
import { mapGetters } from 'vuex'
import FlowchartChangeDialog from '@/components/Dialog/FlowchartChangeDialog'
import imageDialog from '@/components/Dialog/ImageDialog'

export default {
  components: {
    FlowchartChangeDialog,
    imageDialog
  },
  props: {
    comments: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      storage: process.env.VUE_APP_BACKEND_HOST + '/storage/',
      isModalOpen: false,
      tempData: {
        comment_time: '',
        fio: '',
        comment_description: ''
      },
      isImageOpen: false,
      imageData: '',
      activeRow: {},
      obj_id: ''
      // comments: [
      //   {
      //     comment_time: this.$localeDate(Date.now()),
      //     fio: 'администратор',
      //     comment_description:
      //       'fdsgfgfd hsdfhsdfhdfhd ashfhfdhdhfd hfhdshsfdhfdhdsfhsdhdhdhd hfdshdfhdhdhds'
      //   }
      // ],
    }
  },
  computed: {
    ...mapGetters(['user_id']),
    lastCommentId() {
      const ar = this.comments
      return ar[ar.length - 1].comment_id
    },

    lastCommentIdUser() {
      const ar = this.comments.filter((item) => item.user_id === this.user_id)
      return ar[ar.length - 1].comment_id
    }
  },
  methods: {
    addComment(idx, row) {
      this.activeRow = null
      this.tempData = {
        fio: row.fio,
        request_id: row.request_id,
        object_id: row.object_id,
        comment_description: '',
        user_id: row.user_id,
        comment_target: row.comment_target
      }
      this.obj_id = row.object_id
      this.isModalOpen = true
    },
    async editComment(idx, row) {
      this.activeRow = row
      Object.assign(this.tempData, row)
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
        this.comments = res.data.filter(
          (item) => item.object_id === this.obj_id
        )
      }
    },
    async deleteComment(index, row) {
      const res = await request({
        url: '/comments/' + row.comment_id,
        method: 'delete'
      })
      if (res) {
        this.$notify({
          title: 'Успешно!',
          message: 'Данные успешно удалены',
          type: 'success',
          duration: 5000
        })
        this.comments = this.comments.filter(
          (v) => v.comment_id !== row.comment_id
        )
      }
    },
    showImage(v) {
      this.imageData = v
      this.isImageOpen = true
    }
  }
}
</script>

<style scoped>
.el-table__header {
  display: none;
}

.comment-button-container {
  display: flex;
  justify-content: space-between;
}
</style>
