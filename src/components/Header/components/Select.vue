<template>
  <div class="select_filter">
    <div v-if="showSelectSection !== false" style="margin-right: 12px">
      <div>
        <label class="radio-label label_filter">Фильтр по разделу</label>
      </div>
      <div>
        <el-select
          v-model="sectionFilter"
          style="width: 250px"
          class="filter-item"
          clearable
          @change="changeOptions"
        >
          <el-option
            v-for="(item, key, index) in sortOptions"
            :key="index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <div style="margin-right: 12px">
      <div>
        <label class="radio-label label_filter">Фильтр по статусам</label>
      </div>
      <div>
        <el-select
          v-model="statusFilter"
          style="width: 250px"
          class="filter-item"
          :multiple="isMultiple"
          collapse-tags
          collapse-tags-tooltip
          clearable
          placeholder="Выберите статус"
          @change="selectChangeStatus"
        >
          <el-option
            v-for="(item, key, index) in sortOptionsStatus"
            :key="index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sortOptions: {
      required: true,
      default: () => [],
      type: Array
    },
    defaultValue: {
      default: () => '',
      type: String
    },
    isMultiple: {
      default: true,
      type: Boolean
    },
    showSelectSection: {
      default: true,
      type: Boolean
    }
  },
  data() {
    return {
      sectionFilter: 'parts1',
      statusFilter: '',
      sortOptionsStatus: []
    }
  },
  computed: {
    filename: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  mounted() {
    this.getOptions()
    this.changeOptions(this.defaultValue)
  },
  methods: {
    getOptions() {
      this.sortOptions.forEach((item) => {})
    },
    changeOptions(index, row) {
      var newArray = this.sortOptions.filter(function (el) {
        return el.value === index
      })
      this.sortOptionsStatus = newArray[0].status

      this.statusFilter = ''
      this.$emit('onSelectChange', newArray[0].value)
    },
    selectChangeStatus(index, row) {
      this.$emit('onSelectChangeStatus', this.statusFilter)
    }
  }
}
</script>
<style>
.select_filter {
  display: flex;
  align-items: flex-end;
}
.el-select-dropdown span {
  font-size: 12px;
}
</style>
