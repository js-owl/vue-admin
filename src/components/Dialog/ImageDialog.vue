<template>
  <dialog-f
    title=""
    :show-dialog="open"
    :hideButton="true"
    @update:showDialog="closeDialog"
    @closeDialog="closeDialog"
  >
    <el-image style="display: block" :src="storage + data" fit="scale-down">
      <div slot="error" class="image-slot">Нет изображения</div>
    </el-image>
  </dialog-f>
</template>

<script>
/* eslint-disable */
import DialogF from '@/components/Dialog/DialogF'

export default {
  name: 'ImageDialog',
  components: {
    DialogF
  },
  props: {
    data: {
      type: String,
      default: ''
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:open'],
  data() {
    return {
      storage: process.env.VUE_APP_BACKEND_HOST + '/storage/'
    }
  },
  methods: {
    closeDialog() {
      this.$emit('update:open', false)
    }
  }
}
</script>
<style>
.image-slot {
  text-align: center;
  font-size: 14px;
}
</style>
