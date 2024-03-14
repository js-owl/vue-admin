<template>
  <div class="app-container sticky_edit">
    <panel-button
      :show-button="showButtons"
      :loading="isLoading"
      @clickBtnAgreedORRD="clickBtnAgreedORRD"
      @clickBtnSaveAndContinue="clickBtnSaveAndContinue"
      @clickBtnSaveDraft="clickBtnSaveDraft"
      @clickBtnClosed="clickBtnClosed"
    />
    <el-row>
      <div class="editOperation_edit_card">
        <div class="box">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <p class="title">Добавление локатора компонентов</p>
              </div>
            </template>
            <el-form
              ref="emapEdit"
              class="box_form"
              :model="currentEmap"
              label-width="250px"
            >
              <!-- Вид электросхемы -->
              <el-form-item label="Вид электросхемы">
                <div class="emap_text">Локатор компонентов</div>
              </el-form-item>
              <!-- Название электросхемы -->
              <el-form-item
                label="Название электросхемы"
                prop="electricGroup_name"
              >
                <el-input
                  v-model="currentEmap.electricGroup_name"
                  placeholder=""
                />
              </el-form-item>
              <!-- Группа электросхемы -->
              <el-form-item label="Группа электросхемы">
                <div v-if="groupSelected" class="emap_text">
                  {{ groupSelected }}
                </div>
                <div
                  class="link-dashed"
                  @click="isGroupClicked = !isGroupClicked"
                >
                  Изменить группу электросхем
                </div>
                <div v-if="isGroupClicked">
                  <emap-group v-model="groupSelected" />
                </div>
              </el-form-item>
            </el-form>
            <el-row :gutter="20" width="150px" style="margin-top: 30px">
              <el-col :span="24">
                <select-modification
                  :selected-modification.sync="modificationSelected"
                  :is-checkbox-show="false"
                />
              </el-col>
            </el-row>
            <el-row :gutter="20" width="150px" style="margin-top: 60px">
              <p style="margin-left: 20px">Изображение</p>
              <el-col :span="24">
                <el-upload
                  :headers="HeadersForUpload"
                  :action="baseURL + '/files/upload'"
                  :on-success="handleSuccess"
                >
                  <el-button size="small" type="primary">
                    Выберите файл
                  </el-button>
                </el-upload>
                <div id="mainViewContainer" style="width: 100%; height: 100%">
                  <div ref="space" v-html="svg" />
                </div>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </div>
    </el-row>
  </div>
</template>
<script>
import PanelButton from '@/components/PanelButton/PanelButton'
import emapGroup from '@/components/Emaps/emapGroup'
import SelectModification from '@/components/Modification/SelectModification'
import { getToken } from '@/utils/auth'
export default {
  components: { PanelButton, emapGroup, SelectModification },
  data() {
    return {
      showButtons: [
        { label: 'На согласовании ', emit: 'clickBtnAgreedORRD' },
        {
          label: 'Сохранить и продолжить',
          color: 'orange',
          emit: 'clickBtnSaveAndContinue'
        },
        {
          label: 'Сохранить как черновик',
          color: 'orange',
          emit: 'clickBtnSaveDraft'
        },
        { label: 'Закрыть', color: 'grey', emit: 'clickBtnClosed' }
      ],
      isLoading: false,
      currentEmap: {},
      isGroupClicked: false,
      groupSelected: '',
      modificationSelected: [],
      HeadersForUpload: {},
      baseURL: process.env.VUE_APP_BACKEND_HOST + '/api',
      storage: process.env.VUE_APP_BACKEND_HOST + '/storage/',
      svgPath: '',
      svg: ''
    }
  },
  mounted() {
    this.HeadersForUpload = { Authorization: 'Bearer  ' + getToken() }
  },
  methods: {
    async clickBtnAgreedORRD() {},
    async clickBtnSaveAndContinue() {},
    async clickBtnSaveDraft() {},
    async clickBtnClosed() {},
    async handleSuccess(file) {
      this.svgPath = this.storage + file.data
      console.log('handleSuccess', this.svgPath)
      const svgRaw = await fetch(this.svgPath)
      console.log('handleSuccess', svgRaw)
      this.svg = await svgRaw.text()
      console.log('handleSuccess', this.svg)
    }
  }
}
</script>
<style>
.emap_text {
  color: #606266;
  font-weight: 700;
}
.link-dashed,
.link-dashed:hover,
.link-dashed:active,
.link-dashed:focus {
  text-decoration: underline dotted;
  text-underline-offset: 5px;
  /* border-bottom: 1px dashed #606266; */
  cursor: pointer;
  color: #606266;
  font-size: 14px;
  font-weight: 700;
  display: inline-block;
}
</style>
