<template>
  <input type="text" @input="onInput" />
</template>

<script>
export default {
  name: 'ChildComponent',
  methods: {
    onInput(event) {
      this.$emit('inputChanged', event.target.value)
    }
  }
}
</script>
