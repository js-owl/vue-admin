<template>
  <el-input v-model="ruleForm.pass" type="password" autocomplete="off" @input="onInput" />
</template>

<script>
export default {
  name: 'PasswordItem',
  methods: {
    onInput(event) {
      this.$emit('inputChanged', event.target.value)
    }
  }
}
</script>
