<template>
  <div class="app-container user_list_card">
    <user-list show-search :show-export="showExport" />
  </div>
</template>

<script>
import UserList from '@/components/UserList' // Secondary package based on el-pagination
export default {
  name: 'UserListView',
  components: { UserList },
  props: {
    showExport: {
      default: true,
      type: Boolean
    }
  }
}
</script>

<style>

</style>
