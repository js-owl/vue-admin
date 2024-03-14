<template>
  <div>
    <el-input v-model="value" />
    <p v-if="hasError">{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    },
    errorMessage: {
      type: String,
      default: ''
    }
  },
  computed: {
    hasError() {
      return !!this.errorMessage.length
    }
  }
}
</script>
