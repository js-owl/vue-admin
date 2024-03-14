<template>
  <div class="search_form" style="display:inline-block;">
    <div><label class="radio-label label_filter">Поиск </label></div>
    <el-input
      v-model="searchValue"
      width="345"
      :placeholder="placeholder"
      @keyup.enter.native="$emit('onEnter')"
    >
      <template #append>
        <el-button icon="el-icon-search" @click="$emit('onEnter')" />
        <el-button icon="el-icon-close" @click="clearSearchInput" />
      </template>
    </el-input>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  computed: {
    searchValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    clearSearchInput() {
      this.searchValue = ''
      this.$emit('onEnter')
    }
  }
}
</script>
