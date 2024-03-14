<template>
  <el-input v-model="inputValue" type="text" @input="updateInput" />
</template>

<script>
export default {
  props: {
    inputValue: {
      type: String,
      default: ''
    }
  },
  emits: ['updateInput'],
  data() {
    return {

    }
  },
  methods: {
    updateInput() {
      this.$emit('updateInput', this.inputValue)
    }
  }
}
</script>
