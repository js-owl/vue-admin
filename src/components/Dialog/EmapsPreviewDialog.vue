<template>
  <dialog-f
    title="ПРЕДВАРИТЕЛЬНЫЙ ПРОСМОТР"
    :show-dialog="open"
    @update:showDialog="closeDialog"
    @closeDialog="closeDialog"
    @saveData="saveModalData()"
  >
  </dialog-f>
</template>

<script>
import DialogF from '@/components/Dialog/DialogF'
import request from '@/utils/request'

export default {
  name: 'emaps-preview-dialog',
  components: { DialogF },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default() {
        return this.formData
      }
    }
  },
  emits: ['update:open', 'update:data', 'saveData'],
  data() {
    return {}
  },
  computed: {},
  mounted() {
    console.log('EPD.vue 58 ~ mounted')
  },
  methods: {
    closeDialog() {
      // if (this.$refs['notificationForm']) {
      //   this.$refs['notificationForm'].clearValidate()
      // }
      // this.$refs['notificationForm'].resetFields()
      this.$emit('update:open', false)
    },
    saveModalData() {
      // this.$refs['refEmapsGroup'].validate(async (valid) => {
      //   if (valid) {
      //     if (this.data.notification_id) {
      //       const res = await request({
      //         url: '/notifications/' + this.data.notification_id,
      //         method: 'put',
      //         data: this.data
      //       })
      //       if (res) {
      //         this.$notify({
      //           title: 'Успешно!',
      //           message: 'Данные успешно сохранены',
      //           type: 'success',
      //           duration: 5000
      //         })
      //         this.$emit('saveData', 'update')
      //         this.$emit('update:data', this.data)
      //         this.$emit('update:open', false)
      //       }
      //     } else {
      //       const res = await request({
      //         url: '/notifications',
      //         method: 'post',
      //         data: this.data
      //       })
      //       if (res) {
      //         this.$notify({
      //           title: 'Успешно!',
      //           message: 'Данные успешно добавлены',
      //           type: 'success',
      //           duration: 5000
      //         })
      //         this.$emit('saveData', 'create', res)
      //       }
      //     }
      //     this.closeDialog()
      //   }
      // })
    }
  }
}
</script>

<style scoped>
.notification__icon {
  width: 30px;
  height: 30px;
  font-size: 25px;
}
.el-select--medium {
  width: 100%;
}
</style>
