<template>
  <div class="app-container">
    <panel-button
      v-if="true"
      class="panel-button sticky_edit"
      :show-button="showButtons"
      @addImage="addImage"
      @changeDimensions="isModalOpen = true"
      @clickBtnSave="saveModalData"
      @clickBtnCancel="goBack"
    />
    <el-card class="box-card">
      <el-row :gutter="10">
        <!-- Symbols menu -->
        <el-col :span="6" style="max-width: 223px">
          СИМВОЛЫ
          <el-table
            :data="list"
            fit
            highlight-current-row
            style="width: 100%"
            @current-change="handleSymbolsClick"
          >
            <el-table-column align="center">
              <template #default="scope">
                <el-tooltip
                  class="box-item"
                  effect="light"
                  placement="top-start"
                  content="Кликните для переноса в редактор"
                  popper-class="uaz__tooltip uaz__tooltip-left"
                >
                  <el-image
                    style="height: 150px"
                    :src="storage + scope.row.symbol_image"
                    fit="contain"
                  />
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <el-row style="max-width: 223px">
            <pagination
              v-show="total > 0"
              layout="prev, pager, next"
              :total="total"
              :page.sync="listQuery.page"
              :limit.sync="listQuery.limit"
              :pager-count="5"
              :small="true"
              style="float: left"
              @pagination="getSymbols"
          /></el-row>
        </el-col>
        <!-- ToastEditor -->
        <el-col :span="18">
          <el-row>
            <el-col :span="16">
              <p>
                ИЛЛЮСТРАЦИЯ К ОПЕРАЦИИ
                <!-- ({{ canvasSize.width }}x{{ canvasSize.height }}) -->
              </p>
            </el-col>
            <!-- <el-col :span="3" align="right">
            <el-button type="primary" size="mini" @click="isModalOpen = true">
              Изменить размер
            </el-button>
          </el-col> -->
            <!-- <el-col :span="3" align="right">
            <el-upload
              :headers="HeadersForUpload"
              :action="baseURL + '/files/upload'"
              :show-file-list="false"
              :on-success="addImage"
            >
              <el-button size="mini" type="primary">
                Добавить изображение
              </el-button>
            </el-upload>
          </el-col> -->
            <!-- <el-col :span="2" align="right">
            <el-button type="primary" size="mini" @click="saveModalData()">
              Сохранить
            </el-button>
          </el-col> -->
          </el-row>
          <div style="height: 1000px">
            <div id="tui-image-editor" />
          </div>
        </el-col>
      </el-row>
      <change-dimensions-dialog
        :open.sync="isModalOpen"
        :data="modalData"
        @saveData="changeDimensions"
      />
    </el-card>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import request from '@/utils/request'
import { mapGetters, mapActions } from 'vuex'
import PanelButton from '@/components/PanelButton/PanelButton'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import ChangeDimensionsDialog from '@/components/Dialog/ChangeDimensionsDialog'

var whiteTheme = require('/public/toast/white-theme.js')
window.imageEditor = null // global object to access from methods
export default {
  components: {
    PanelButton,
    Pagination,
    ChangeDimensionsDialog
  },
  data() {
    return {
      showButtons: [
        { label: 'Добавить изображение', emit: 'addImage', isUpload: true },
        { label: 'Изменить размер', color: 'orange', emit: 'changeDimensions' },
        { label: 'Сохранить', emit: 'clickBtnSave' },
        { label: 'Отменить', color: 'grey', emit: 'clickBtnCancel' }
      ],
      rect: {
        version: '5.3.0',
        objects: [
          {
            type: 'rect',
            version: '5.3.0',
            originX: 'left',
            originY: 'top',
            left: 100,
            top: 100,
            width: 50,
            height: 50,
            fill: 'red',
            stroke: null,
            strokeWidth: 1
          }
        ]
        // background: 'cyan'
      },

      // getSymbols
      listQuery: {
        page: 1,
        limit: 6
      },
      list: [],
      total: 0,
      listLoading: true,
      currentRow: '',
      baseURL: process.env.VUE_APP_BACKEND_HOST + '/api',
      storage: process.env.VUE_APP_BACKEND_HOST + '/storage/',
      json: '',
      id: 0,
      path: '',
      operation_img_server: '',
      flowchartId: 0,
      HeadersForUpload: {},
      isModalOpen: false,
      modalData: { width: '', height: '' },
      canvasSize: {},
      jsonImg: {},
      operation_image: '',
      ext: '',
      curOperation: {}
    }
  },
  computed: {
    ...mapGetters(['operation_img_json', 'operation_img_json_obj'])
  },

  async mounted() {
    this.initPaste()
    this.HeadersForUpload = { Authorization: 'Bearer  ' + getToken() }
    if (imageEditor) {
      await imageEditor.destroy()
    }

    this.getSymbols()
    this.id = this.$route.query?.id
    this.flowchartId = this.$route.query?.createflowchart_id
    // Рассматриваются 3 основных варианта:
    // 1. Создание новой операции
    if (this.id === 'NaN') {
      this.operationFile = this.operation_img_json
      window.imageEditor = new tui.ImageEditor('#tui-image-editor', {
        includeUI: {
          loadImage: {
            path: 'background.jpg',
            name: 'operation'
          },
          theme: whiteTheme,
          initMenu: 'filter',
          menuBarPosition: 'bottom'
        },
        cssMaxWidth: 1200,
        cssMaxHeight: 800
      })
      if (this.operation_img_json) {
        const path = this.storage + this.operation_img_json
        const f = await fetch(path)
        const j = await f.json()
        const canvas = await imageEditor._graphics._canvas
        canvas.loadFromJSON(j, canvas.renderAll.bind(canvas))
      }
      return
    }
    // 2. Уже есть файл json
    this.operationFile = await this.getJsonObject()
    if (this.operationFile) this.ext = this.getExtention(this.operationFile)
    if (this.operationFile && this.ext === 'json') {
      const path = this.storage + this.operationFile
      const pathImg = this.storage + this.operation_image
      const f = await fetch(path)
      const j = await f.json()

      window.imageEditor = new tui.ImageEditor('#tui-image-editor', {
        includeUI: {
          loadImage: {
            path: pathImg,
            name: 'operation'
          },
          theme: whiteTheme,
          initMenu: 'filter',
          menuBarPosition: 'bottom'
        },
        cssMaxWidth: 1200,
        cssMaxHeight: 800
      })
      const canvas = await imageEditor._graphics._canvas
      canvas.loadFromJSON(j, canvas.renderAll.bind(canvas))
      return
    }
    // 3. Есть старые картинки xml
    window.imageEditor = new tui.ImageEditor('#tui-image-editor', {
      includeUI: {
        loadImage: {
          path: 'background.jpg',
          name: 'operation'
        },
        theme: whiteTheme,
        initMenu: 'filter',
        menuBarPosition: 'bottom'
      },
      cssMaxWidth: 1200,
      cssMaxHeight: 800
    })
    if (this.operation_image) {
      const imagepath = this.storage + this.operation_image
      const img = new Image()
      img.src = imagepath
      img.onload = function () {
        setTimeout(() => {
          imageEditor
            .loadImageFromURL(imagepath, 'imageName')
            .then((r) => console.log('2b', r))
        }, 500)
      }
      return
    }
    // if (this.operation_image) {
    //   const imagepath = this.storage + this.operation_image
    //   setTimeout(() => {
    //     imageEditor.addImageObject(imagepath)
    //   }, 500)
    // }
  },
  methods: {
    ...mapActions('operation', ['saveOperationTmp', 'saveOperationJson']),

    async getJsonObject() {
      if (this.id === 'NaN') {
        this.path = 'background.jpg'
      } else {
        const res = await request({
          url: '/operations/' + this.id,
          method: 'get'
        })
        if (res) {
          Object.assign(this.curOperation, res)
          this.operation_image = res.operation_image
          if (res.operation_file) {
            return res.operation_file
          }
        }
      }
    },
    async getSymbols() {
      const res = await request({
        url: '/symbols',
        method: 'get',
        params: {
          page: this.listQuery.page,
          limit: this.listQuery.limit
        }
      })
      this.list = res.data
      this.total = res.total
      this.listQuery.page = res.current_page
      this.listQuery.limit = res.per_page
      this.listLoading = false
    },
    handleSymbolsClick(val) {
      this.currentRow = val
      const imagepath = this.storage + this.currentRow.symbol_image
      imageEditor.addImageObject(imagepath)
      // this.json = imageEditor.saveJSON()
      this.json = imageEditor.toDataURL()
    },
    addImage(res) {
      if (res.data) {
        const imagepath = this.storage + res.data
        imageEditor.addImageObject(imagepath)
      }
    },
    async saveModalData() {
      const jsonImg = imageEditor.saveJSON()
      const resJson = await this.saveOperationJson(jsonImg)
      this.curOperation.operation_file = resJson

      const b64Img = imageEditor.toDataURL()
      const res = await this.saveOperationTmp(b64Img)
      this.curOperation.operation_image = res
      if (this.id !== 'NaN') {
        if (resJson) {
          const res = await request({
            url: '/operations/' + this.id,
            method: 'put',
            data: this.curOperation
          })
        }
      }

      if (resJson) {
        this.$notify({
          title: 'Успешно!',
          message: 'Данные успешно сохранены',
          type: 'success',
          duration: 5000
        })
        this.goBack()
      }
    },
    async changeDimensions(o) {
      const canvas = imageEditor._graphics._canvas
      const b64 = JSON.stringify(canvas)
      await imageEditor.crop({
        left: 0,
        top: 0,
        width: o.width,
        height: o.height
      })
      canvas.loadFromJSON(b64, canvas.renderAll.bind(canvas))
      this.canvasSize = imageEditor.getCanvasSize()
    },
    getJsonImg() {
      const canvas = imageEditor._graphics._canvas
      const o = this.operation_img_json_obj
      canvas.loadFromJSON(o, canvas.renderAll.bind(canvas))
    },
    goBack() {
      if (this.id === 'NaN') {
        if (this.flowchartId) {
          this.$router.push(
            `/operations/edit/?createflowchart_id=${this.flowchartId}`
          )
        } else {
          this.$router.push('/operations/edit/')
        }
      } else {
        const fid = this.$route.query?.flowchart_id
        const item_id = this.$route.query?.item_id
        if (fid) {
          this.$router.push(
            `/operations/edit/?flowchart_id=${fid}&item_id=${item_id}`
          )
        } else {
          this.$router.push('/operations/edit/' + this.id)
        }
      }
    },
    initPaste() {
      document.onpaste = function (event) {
        var items = (event.clipboardData || event.originalEvent.clipboardData)
          .items
        for (const index in items) {
          var item = items[index]
          if (item.kind === 'file') {
            var blob = item.getAsFile()
            var reader = new FileReader()
            reader.onload = function (event) {
              imageEditor.addImageObject(event.target.result)
            } // data url!
            reader.readAsDataURL(blob)
          }
        }
      }
    },
    getExtention(file_name) {
      return file_name.split('.').reverse()[0]
    }
  }
}
</script>
<style>
.tui-image-editor {
  background-color: white;
  border: 1px solid #aaa;
}

.panel-button {
  border-bottom: 3px solid #003d2d;
}
.el-row > .pagination-container {
  padding: 32px 0 !important;
}
</style>
