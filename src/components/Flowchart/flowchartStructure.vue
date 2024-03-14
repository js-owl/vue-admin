<template>
  <div class="flowchartStructure">
    <el-tree
      :data="structureData"
      :props="structureProps"
      @node-click="treeModelsNodeClick"
    >
      <template #default="{ node }">
        <span>
          {{ node.data.structureFlowChart_path }} -
          {{ node.data.structureFlowChart_name }}
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  props: {
    value: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      structureData: [],
      structureProps: {
        label: 'structureFlowChart_name',
        children: 'nodes'
      },
      structureSelected: ''
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    async getInfo() {
      const res = await request({
        url: '/structureflowchart/all',
        method: 'get'
      })
      this.structureData = res
    },
    treeModelsNodeClick(data) {
      const text = `${data.structureFlowChart_path} ${data.structureFlowChart_name}`
      this.$emit('input', text)
    }
  }
}
</script>
