<template>
  <div class="flowchart-equipments">
    <el-row :gutter="20">
      <el-col :span="23">
        <div v-if="type == 'preview'" class="fpc-equipment__item">
          Оборудование и инструменты:
        </div>
        <div
          v-if="type == 'bid'"
          class="fpc-equipment__item button"
          @click="addComment()"
        >
          Оборудование и инструменты:
        </div>
        <el-table
          :data="equipments"
          border
          highlight-current-row
          :show-header="false"
          class="fpc-equipment__table"
        >
          <el-table-column width="190">
            <template #default="scope">
              <div v-if="scope.row.tool_image">
                <el-image
                  style="padding: 20px 0"
                  :src="storage + scope.row.tool_image"
                  fit="scale-down"
                />
              </div>
              <div v-else>
                <img
                  style="max-width: 100%; height: auto"
                  src="placeholder.PNG"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column>
            <template #default="scope">
              <div class="fpc-equipment__tool_name">
                <span v-if="role_name === 'translator'"> RU: </span>
                {{ scope.row.tool_name }}<br />{{ scope.row.tool_code }}
                <br /><br />
                <span v-if="role_name === 'translator'">
                  EN:{{ scope.row.tool_name_en }}<br />
                  {{ scope.row.tool_code }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="editable_state" width="70">
            <template #default="scope">
              <el-button
                size="mini"
                class="el-button-icon"
                @click="editEquip(scope.row)"
              >
                <i class="el-icon-edit" />
              </el-button>
            </template>
          </el-table-column>
        </el-table>
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
    <equipment-add-dialog
      :open.sync="isEquipOpen"
      :data.sync="equipData"
      @saveData="saveEquip"
    />
  </div>
</template>

<script>
import request from '@/utils/request'
import { mapGetters } from 'vuex'
import FlowchartChangeDialog from '@/components/Dialog/FlowchartChangeDialog'
import EquipmentAddDialog from '@/components/Dialog/EquipmentAddDialog'
import flowchartMessage from '@/components/Flowchart/flowchartMessage'
export default {
  components: {
    FlowchartChangeDialog,
    EquipmentAddDialog,
    flowchartMessage
  },
  props: {
    equipments: {
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
    },
    type: {
      type: String,
      default: 'preview'
    }
  },
  data() {
    return {
      storage: process.env.VUE_APP_BACKEND_HOST + '/storage/',
      isCommentOpen: false,
      commentData: {
        comment_time: '',
        fio: '',
        comment_description: '',
        object_target: ''
      },
      isEquipOpen: false,
      equipData: {
        tool_name: '',
        tool_name_en: '',
        tool_name_es: '',
        tool_image: '',
        toolType_id: 2
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
    ...mapGetters(['role_name', 'fio', 'editable_state']),
    commentsById() {
      return this.comments.filter(
        (item) => item.comment_target === 'equipmentToolTitle'
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
        comment_target: 'equipmentToolTitle'
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
    editEquip(row) {
      this.activeRow = row
      Object.assign(this.equipData, row)
      this.isEquipOpen = true
    },
    saveEquip() {
      Object.assign(this.activeRow, this.equipData)
    }
  }
}
</script>
<style scoped>
.button:hover {
  background-color: orange;
  cursor: pointer;
}

.flowchart-equipments {
  margin: 5px 0;
}
</style>
