<template>
  <dialog-f
    class="flowchart_editor"
    title="Запчасти"
    :show-dialog="open"
    @update:showDialog="closeDialog"
    @closeDialog="closeDialog"
    @saveData="saveModalData()"
  >
    <filterSelect
      v-model="currentFilter"
      show-search
      search-placeholder="Название/номер/код"
      @SearchOnFilter="getPartgroup"
    />
    <el-row>
      <el-col class="scroll_tree" :span="12">
        <el-tree
          ref="treeRef"
          :load="loadNode"
          lazy
          node-key="part_id"
          :props="props"
          @node-click="handleNodeClick"
        >
          <template #default="{ node, data }">
            <span class="flowchart_dialog_tree_text">
              {{ data.partGroup_name }}
              <el-checkbox
                v-show="node.level === 4"
                v-model="data.isChecked"
                :label="data.part_name"
                @change="handleChangeCheckbox"
              />
            </span>
          </template>
        </el-tree>
      </el-col>
      <el-col class="scroll" :span="12">
        <el-table
          ref="refPartsChecked"
          class="flowchart_modal_selected_items"
          :data="partsChecked"
          style="width: 100%"
          row-key="part_id"
        >
          <el-table-column
            :label="'Выбранные элементы (' + partsChecked.length + ')'"
          >
            <template #default="scope">
              {{ scope.row.part_code }} - {{ scope.row.part_name }}
            </template>
          </el-table-column>
          <el-table-column fixed="left" width="30">
            <template #default="scope">
              <el-tooltip
                class="box-item"
                effect="light"
                placement="top-start"
                content="Удалить"
                popper-class="uaz__tooltip uaz__tooltip-left"
              >
                <i
                  link
                  size="mini"
                  class="el-icon-close"
                  @click.prevent="deleteRow(scope.$index, scope.row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </dialog-f>
</template>

<script>
/* eslint-disable */
import DialogF from '@/components/Dialog/DialogF'
import request from '@/utils/request'
import filterSelect from '@/components/Header/filter'

export default {
  name: 'FlowchartDialog',
  components: {
    DialogF,
    filterSelect
  },
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    open: {
      type: Boolean,
      default: false
    },
    rowDelete: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  emits: ['update:open', 'input', 'saveData'],
  data() {
    return {
      nodeChecked: {},
      parts: [],
      partsChecked: [],
      props: {
        isLeaf: 'leaf'
      },
      currentFilter: {
        filter: ''
      }
    }
  },
  watch: {
    value(newValue) {
      this.deleteRow(0, this.rowDelete)
    }
  },
  mounted() {
    this.partsChecked = this.value
    this.getPartgroup()
  },
  methods: {
    async getPartgroup() {
      const params = {}
      if (this.currentFilter.filter) {
        params.filter = this.currentFilter.filter
      }
      const res = await request({
        url: '/partgroup/index',
        method: 'get',
        params
      })
      return res.data
    },
    async getPartgroupId(id) {
      const res = await request({
        url: '/partgroup/index/' + id,
        method: 'get'
      })
      return res.data
    },
    async getPartTmpGroupId(id) {
      const res = await request({
        url: '/part',
        method: 'get',
        params: { partTMPGroup_id: id }
      })
      this.parts = [...this.parts, ...res.data]
      return res.data
    },
    async loadNode(node, resolve) {
      if (node.level === 0) {
        const tmp = await this.getPartgroup()
        resolve(tmp)
      }
      if (node.level === 1 || node.level === 2) {
        const tmp = await this.getPartgroupId(node.data.partGroup_id)
        resolve(tmp)
      }
      if (node.level === 3) {
        const tmp = await this.getPartTmpGroupId(node.data.partGroup_id)
        // Убрать знак раскрывающегося меню
        tmp.forEach((v) => (v.leaf = true))
        resolve(tmp)
      }
      if (node.level > 3) return resolve([])
    },
    handleNodeClick(node) {
      this.nodeChecked = node
    },
    handleChangeCheckbox(isChecked) {
      const node = this.nodeChecked
      if (isChecked) {
        this.partsChecked.push(node)
      } else {
        this.partsChecked = this.partsChecked.filter((v) => {
          return v !== node
        })
      }
    },
    deleteRow(idx, row) {
      this.partsChecked = this.partsChecked.filter((v) => {
        return v !== row
      })
      this.parts.forEach((v) => {
        if (v === row) {
          v.isChecked = false
        }
      })
    },
    saveModalData() {
      this.$emit('input', this.partsChecked)
      this.$emit('update:open', false)
    },
    closeDialog() {
      this.$emit('update:open', false)
    }
  }
}
</script>

<style scoped>
.flowChart_modal_table_name {
  line-height: 20px;
}
.el-icon-close {
  color: #7ea09a;
  cursor: pointer;
  font-weight: bolder;
}
/* .el-icon-caret-right:before {
  color: red;
  content: 'a';
} */
</style>
