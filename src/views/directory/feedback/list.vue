<template>
  <div class="app-container">
    <feed-back :edit-mode="false" />
  </div>
</template>

<script>
import FeedBack from '@/components/FeedBack'

export default {
  name: 'FeedbackListView',
  components: { FeedBack }
}
</script>

<style>
.app-container .el-dialog__body {
  height: 600px; /*фиксированная высота*/
}
</style>
