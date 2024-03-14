<template>
  <div class="box">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <p class="title">Иллюстрация к операции</p>
        </div>
      </template>
      <!-- <el-tooltip
        class="box-item"
        effect="light"
        placement="top-start"
        popper-class="uaz__tooltip uaz__tooltip-left"
      > -->
      <div class="df jcfe mb10">
        <el-button
          v-show="role_name != 'translator'"
          size="medium"
          type="primary"
          @click="changeIllustration"
        >
          {{ 'Изменить' }}
        </el-button>
      </div>
      <!-- </el-tooltip> -->
      <el-image style="display: block" :src="path" fit="scale-down" />
    </el-card>
  </div>
</template>

<script>
import request from '@/utils/request'
import { mapGetters } from 'vuex'

export default {
  props: { operationId: { type: Number, default: 0 } },
  data() {
    return {
      storage: process.env.VUE_APP_BACKEND_HOST + '/storage/',
      operation_img_server: '',
      path: ''
    }
  },
  computed: {
    ...mapGetters(['role_name', 'operation_img_store'])
  },
  mounted() {
    if (this.operation_img_store) {
      this.path = this.storage + this.operation_img_store
    } else {
      if (this.operationId) {
        this.getOperationImg(this.operationId)
      } else {
        this.path = 'background.jpg'
      }
    }
  },

  methods: {
    async getOperationImg(id) {
      const res = await request({
        url: '/operations/' + id,
        method: 'get'
      })
      this.operation_img_server = res.operation_image
      if (this.operation_img_server) {
        this.path = this.storage + this.operation_img_server
      } else {
        this.path = 'background.jpg'
      }
    },
    changeIllustration() {
      const flowchartId = this.$route.query?.createflowchart_id
      const entityId = this.$route.query?.flowchart_id
      const item_id = this.$route.query?.item_id
      if (flowchartId) {
        this.$router.push(
          `/toast?createflowchart_id=${flowchartId}&id=${this.operationId}`
        )
      } else if (entityId) {
        this.$router.push(
          `/toast?flowchart_id=${entityId}&id=${this.operationId}&item_id=${item_id}`
        )
      } else {
        this.$router.push(`/toast?id=${this.operationId}`)
      }
      this.$emit('changeIllustration')
    }
  }
}
</script>

<style scoped></style>
