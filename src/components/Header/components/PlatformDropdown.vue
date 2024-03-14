<template>
  <el-dropdown :hide-on-click="false" :show-timeout="100" trigger="click">
    <el-button plain>Фильтр<i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <el-dropdown-menu slot="dropdown" class="no-border">
      <el-radio-group v-model="platforms" style="padding: 5px 15px;">
        <el-radio v-for="item in platformsOptions" :key="item.key" :label="item.key">
          {{ item.name }}
        </el-radio>
      </el-radio-group>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  props: {
    value: {
      required: true,
      default: () => [],
      type: Array
    }
  },
  data() {
    return {
      platformsOptions: [
        { key: 'showOnlyEmptyCode', name: ' Мои заявки ' },
        { key: 'showOnlyNotChecked', name: ' Все заявки ' }
      ]
    }
  },
  computed: {
    platforms: {
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
