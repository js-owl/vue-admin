<template>
  <div class="container">
    <dialog-f
      title="Выберите используемые инструменты, специнструменты"
      :show-dialog="open"
      width="70%"
      @update:showDialog="closeDialog"
      @closeDialog="closeDialog"
      @saveData="closeDialog"
    >
      <el-tabs type="border-card">
        <el-tab-pane label="Оборудование и инструменты">
          <tool-item v-model="equipmentData" url="/tools/equipment/" />
        </el-tab-pane>
        <el-tab-pane label="Общие инструменты">
          <tool-item v-model="generalData" url="/tools/general/" />
        </el-tab-pane>
        <el-tab-pane label="Специнструмент">
          <tool-item v-model="specialData" url="/tools/special/" />
        </el-tab-pane>
        <el-tab-pane label="Материалы">
          <tool-item v-model="materialData" url="/tools/material/" />
        </el-tab-pane>
      </el-tabs>
    </dialog-f>
  </div>
</template>

<script>
import DialogF from '@/components/Dialog/DialogF'
import toolItem from '@/views/operations/toolItem'

export default {
  name: 'ToolSelectDialog',
  components: { DialogF, toolItem },
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    open: { type: Boolean, default: false }
  },
  emits: ['update:open', 'update:data', 'saveData'],
  data() {
    return {
      equipmentData: [],
      generalData: [],
      specialData: [],
      materialData: []
    }
  },
  watch: {
    value(v) {
      this.fillData()
      this.$emit('input', v)
    }
  },
  methods: {
    closeDialog() {
      this.$emit('input', [
        ...this.equipmentData,
        ...this.generalData,
        ...this.specialData,
        ...this.materialData
      ])
      this.$emit('update:open', false)
    },
    fillData() {
      this.equipmentData = [
        ...this.value.filter((item) => item.toolType_id === 2)
      ]
      this.generalData = [
        ...this.value.filter((item) => item.toolType_id === 4)
      ]
      this.specialData = [
        ...this.value.filter((item) => item.toolType_id === 1)
      ]
      this.materialData = [
        ...this.value.filter((item) => item.toolType_id === 3)
      ]
    }
  }
}
</script>
