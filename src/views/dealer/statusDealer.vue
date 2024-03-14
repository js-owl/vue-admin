<template>
  <el-select v-model="vm" placeholder="Выберите статус" clearable>
    <el-option
      v-for="item in dealerStatus"
      :key="item.dealerStatus_id"
      :label="item.dealerStatus_name"
      :value="item.dealerStatus_id"
    />
  </el-select>
</template>

<script>
import request from '@/utils/request'
export default {
  props: ['value'],
  computed: {
    vm: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  data() {
    return {
      dealerStatus: []
    }
  },
  methods: {
    async getStatus() {
      const res = await request({
        url: '/dealerstatus/',
        method: 'get',
        params: {
          limit: 50
        }
      })
      this.dealerStatus = res.data
    }
  },
  mounted() {
    this.getStatus()
  }
}
</script>
