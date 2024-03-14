<template>
  <div class="app-container break_word">
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="editOperation_edit_card">
          <div class="box" style="margin-bottom: 20px">
            <el-card class="box-card" style="margin-bottom: 20px">
              <template #header>
                <div class="card-header">
                  <p class="title">Просмотр электросхемы</p>
                </div>
              </template>
              <el-form
                ref="dealerEditForm"
                class="box_form"
                :model="currentEmap"
                label-width="250px"
              >
                <!-- Группа электросхемы -->
                <el-form-item label="Группа электросхемы">
                  <div class="emap_text">{{ currentEmap.elGroup_name }}</div>
                </el-form-item>
                <!-- Вид электросхемы -->
                <el-form-item label="Вид электросхемы">
                  <div class="emap_text">
                    {{ currentEmap.electricGroupType_id }}
                  </div>
                </el-form-item>
                <!-- Название электросхемы -->
                <el-form-item label="Название электросхемы">
                  <div class="emap_text">
                    {{ currentEmap.electricGroup_name }}
                  </div>
                </el-form-item>
                <!-- Относится к -->
                <el-form-item label="Относится к">
                  <div class="emap_text">
                    <div v-if="mods && mods.length > 0">
                      <div v-if="!isModificationsOpen">
                        <!-- TODO console error in permission.js -->
                        {{ mods[0].productModification_name }}

                        <br />
                        <div
                          v-if="mods.length > 1"
                          style="cursor: pointer"
                          @click="isModificationsOpen = !isModificationsOpen"
                        >
                          ...
                        </div>
                      </div>
                      <div v-if="isModificationsOpen">
                        <div v-for="m in mods" :key="m.productModification_id">
                          {{ m.productModification_name }}
                        </div>
                        <el-button
                          size="mini"
                          type="text"
                          @click="isModificationsOpen = !isModificationsOpen"
                        >
                          Скрыть
                        </el-button>
                      </div>
                    </div>
                  </div>
                </el-form-item>
              </el-form>
            </el-card>
          </div>
        </div>
      </el-col>
    </el-row>
    <EmapsIllustrationZoom :svgid="id" />
    <!-- <emaps-preview-dialog :open="true" :data="{}" /> -->
  </div>
</template>
<script>
import request from '@/utils/request'
import EmapsIllustrationZoom from '@/views/emaps/EmapsIllustrationZoom.vue'
import EmapsPreviewDialog from '@/components/Dialog/EmapsPreviewDialog'
export default {
  components: { EmapsIllustrationZoom, EmapsPreviewDialog },
  data() {
    return {
      id: Number(this.$route.params?.id),
      storage: process.env.VUE_APP_BACKEND_HOST + '/storage/',
      currentEmap: {}, // res.data
      svgPath: '', // this.storage + this.currentEmap.electricGroup_image
      svg: '', // <?xml version="1.0" ...
      mods: [], // res.data.modifications
      mainNotes: [], // res.data.notes.main
      listLoading: false,
      isModificationsOpen: false
    }
  },
  mounted() {
    if (this.id) {
      this.getInfo(this.id)
    }
  },
  methods: {
    async getInfo(id) {
      this.isLoading = false
      const res = await request({
        url: '/electricgroup/get/' + id,
        method: 'get'
      })
      if (!res) {
        console.log('GET request error')
        return
      }
      this.currentEmap = res.data
      this.svgPath = this.storage + this.currentEmap.electricGroup_image
      console.log('preview.vue 113 ~ getInfo ~ this.svgPath:', this.svgPath)

      this.mods = res.data.modifications ? res.data.modifications : false
      this.mainNotes = res.data.notes.main

      const svgRaw = await fetch(this.svgPath)
      this.svg = await svgRaw.text()
    }
  }
}
</script>
<style>
svg:not(:root) {
  overflow: hidden;
  width: 1600px;
  height: 1600px;
  fill: grey;
}

#svg {
  width: 500px;
}
.emap_text {
  color: #606266;
  /* font-weight: 700; */
}
</style>
