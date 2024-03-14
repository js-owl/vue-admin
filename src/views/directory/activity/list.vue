<template>
  <div class="app-container">
    <activity-list :show-company="true" :show-btn-export-excel="true" />
  </div>
</template>

<script>
import ActivityList from '@/views/directory/activity/components/ActivityList'
export default {
  name: 'ActivityListView',
  components: { ActivityList }
}
</script>

<style>
.app-container .el-dialog__body {
  height: 600px; /*фиксированная высота*/
}
</style>
