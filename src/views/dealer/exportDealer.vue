<template>
  <el-select v-model="vm" placeholder="Выберите значение" clearable>
    <el-option :key="false" label="Нет" :value="false" />
    <el-option :key="true" label="Да" :value="true" />
  </el-select>
</template>

<script>
// import request from '@/utils/request'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    vm: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
