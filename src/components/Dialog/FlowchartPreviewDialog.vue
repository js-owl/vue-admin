<template>
  <dialog-f
    class="flowchart_preview_dialog"
    title="Предварительный просмотр"
    width="945"
    :show-dialog="open"
    :hide-button="true"
    @update:showDialog="closeDialog"
    @closeDialog="closeDialog"
    @saveData="saveModalData()"
  >
    <flowchart-preview :flowchart-id="flowchartId" />
  </dialog-f>
</template>

<script>
import DialogF from '@/components/Dialog/DialogF'
import FlowchartPreview from '@/components/Flowchart/flowchartPreview'

export default {
  name: 'FlowchartPreviewDialog',
  components: { DialogF, FlowchartPreview },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    flowchartId: {
      type: Number,
      default: 0
    }
  },
  emits: ['update:open', 'update:data', 'saveData'],
  data() {
    return {}
  },
  methods: {
    saveModalData() {},
    closeDialog() {
      this.$emit('update:open', false)
      this.$emit('closeDialog')
    }
  }
}
</script>

<style scoped></style>
