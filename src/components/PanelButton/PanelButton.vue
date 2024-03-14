<template>
  <sticky :z-index="10" class-name="sub-navbar">
    <el-row v-loading="loading">
      <el-button
        v-for="item in showButton"
        :key="item.emit"
        :class="['btn el-button-icon', transformColor(item.color)]"
        size="mini"
        type="primary"
        @click="callBtnEmit(item.emit)"
      >
        <span v-if="!item.isUpload">
          {{ item.label }}
        </span>
        <el-upload
          v-if="item.isUpload"
          :headers="HeadersForUpload"
          :action="baseURL + '/files/upload'"
          :show-file-list="false"
          :on-success="(res) => handleSuccess(res, item.emit)"
        >
          <span>
            {{ item.label }}
          </span>
        </el-upload>
      </el-button>
    </el-row>
  </sticky>
</template>

<script>
import Sticky from '@/components/Sticky'
import { getToken } from '@/utils/auth'
export default {
  components: {
    Sticky
  },
  props: {
    showButton: {
      type: Array,
      default() {
        return []
      }
    },
    loading: { type: Boolean, default: false }
  },
  data() {
    return {
      HeadersForUpload: {},
      baseURL: process.env.VUE_APP_BACKEND_HOST + '/api'
    }
  },
  mounted() {
    this.HeadersForUpload = { Authorization: 'Bearer  ' + getToken() }
  },
  methods: {
    callBtnEmit(emitName) {
      this.$emit(emitName, '')
    },
    transformColor(color) {
      switch (color) {
        case 'orange':
          return 'btn-warning'
        case 'grey':
          return 'btn-default'
        case 'blue':
          return 'btn-primary'
        default:
          return color
      }
    },
    handleSuccess(res, emitName) {
      this.$emit(emitName, res)
    }
  }
}
</script>
<style></style>
