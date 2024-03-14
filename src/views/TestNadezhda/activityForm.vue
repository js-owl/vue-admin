<template>
  <el-input type="textarea" @input="onInput" />
</template>

<script>
export default {
  methods: {
    onInput(event) {
      this.$emit('inputChanged', event.target.value)
    }
  }
}
</script>
