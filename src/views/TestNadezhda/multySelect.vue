<template>
  <el-row>
    <el-select v-model="localValue" :disabled="disabled" v-bind="$attrs" @change="validate">
      <template v-for="item in options">
        <el-option
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </template>
    </el-select>
    <el-select v-model="value2" :disabled="disabled" v-bind="$attrs" @change="validate">
      <template v-for="item in options">
        <el-option
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </template>
    </el-select>
  </el-row>

</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    rules: {
      type: Object,
      default: () => {}
    },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [{
        value: 'Option1',
        label: 'Option1'
      }, {
        value: 'Option2',
        label: 'Option2'
      }, {
        value: 'Option3',
        label: 'Option3'
      }, {
        value: 'Option4',
        label: 'Option4'
      }, {
        value: 'Option5',
        label: 'Option5'
      }],
      value1: [],
      value2: []
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
    validate(val) {
      let isValid = true
      if (val !== undefined && this.rules) {
        for (const key in this.rules) {
          if (!this.rules[key]) {
            isValid = false
            break
          }
        }
      }
      this.$emit('validate', isValid)
    }
  }
}
</script>
