<template>
  <div class="app-container operations_edit_card">
    <el-row>
      <edit-operation />
    </el-row>
  </div>
</template>

<script>
import editOperation from '@/views/operations/editOperation'

export default {
  name: 'OperationEdit',
  components: { editOperation }
}
</script>

<style>
  .operations_edit_card > .el-row {
    max-width: 100%;
  }
</style>
