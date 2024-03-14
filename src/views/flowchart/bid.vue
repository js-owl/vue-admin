<template>
  <div>
    <flowchart-preview
      v-if="flowChart_id"
      type="bid"
      :flowchart-id="flowChart_id"
      :comments="comments"
    />
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import FlowchartPreview from '@/components/Flowchart/flowchartPreview'
export default {
  components: {
    FlowchartPreview
  },
  data() {
    return {
      id: this.$route.params.id
    }
  },
  computed: {
    ...mapGetters(['flowChart_id', 'comments'])
  },
  mounted() {
    this.getRequestInfo(this.id)
    this.getRequestComments(this.id)
  },
  methods: {
    ...mapActions('request', ['getRequestInfo', 'getRequestComments'])
  }
}
</script>
