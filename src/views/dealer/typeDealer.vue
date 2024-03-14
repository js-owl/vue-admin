<template>
  <el-select v-model="vm" placeholder="Выберите тип" clearable>
    <el-option
      v-for="item in dealertype"
      :key="item.dealerTypeName"
      :label="item.dealerTypeName"
      :value="item.dealerTypeName"
    />
  </el-select>
</template>

<script>
import request from '@/utils/request'
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
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
      dealertype: []
    }
  },
  methods: {
    async getDealerType() {
      const res = await request({
        url: '/dealertype/',
        method: 'get',
        params: {
          limit: 50
        }
      })
      this.dealertype = res.data
    }
  },
  mounted() {
    this.getDealerType()
  }
}
</script>
