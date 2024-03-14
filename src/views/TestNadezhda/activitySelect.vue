<template>
  <el-select
    v-model="modelValue"
    placeholder="Activity zone"
    @change="handleSelectChange"
  >
    <el-option label="Zone one" value="shanghai" />
    <el-option label="Zone two" value="beijing" />
  </el-select>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      modelValue: ''
    }
  },
  computed: {
    localValue: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      }
    }
  },
  methods: {
    handleSelectChange(event) {
      const localValue = event
      console.log(localValue)
      this.$emit('selectedValue', localValue)
    }
  }
}
</script>
