<template>
  <flowchart-preview type="bid" :flowchart-id="$route.params.id" />
</template>
<script>
import FlowchartPreview from '@/components/Flowchart/flowchartPreview'
export default {
  components: {
    FlowchartPreview
  },
  mounted() {
    console.log(
      '🚀 \x1b[33m ~ file: v_flowchartPreview.vue:11',
      this.$route.params.id
    )
  }
}
</script>
