<template>
  <el-dropdown :hide-on-click="false" :show-timeout="100" trigger="click" class="platform_modification">
    <el-button plain>
      Фильтр<span v-if="platforms.length-1>0">({{ platforms.length-2 }})</span>
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <el-dropdown-menu slot="dropdown" class="no-border">
      <el-checkbox-group v-model="platforms" style="padding: 5px 15px;">
        <el-checkbox v-for="item in platformsOptions" :key="item.key" :label="item.key">
          {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
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
        { key: 'showOnlyEmptyCode', name: 'Только неопределенные модификации' },
        { key: 'showOnlyNotChecked', name: 'Только непроверенные' },
        { key: 'showOnlyNotLinked', name: 'Только непривязанные' }
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
<style>
.el-dropdown {
  display: flex;
}
.platform_modification .el-dropdown-selfdefine {
  margin: 1px 5px;/*Селект Фильтр-отступы */
  border-radius: 2px;
  padding: 7px 20px;
}
</style>
