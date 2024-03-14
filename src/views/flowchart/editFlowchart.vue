<template>
  <div class="app-container flowchart_edit sticky_edit">
    <panel-button
      :show-button="showButtons"
      :loading="isLoading"
      @clickBtnClosed="clickBtnClosed"
      @clickBtnAgreedORRD="clickBtnAgreedORRD"
      @clickBtnSaveAndContinue="clickBtnSaveAndContinue"
      @clickBtnSaveDraft="clickBtnSaveDraft"
    />
    <!-- РЕДАКТОР ТЕХ. КАРТ -->
    <el-row>
      <div class="editOperation_edit_card">
        <div class="box">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <p class="title">РЕДАКТОР ТЕХ. КАРТ</p>
                <span>
                  Владелец: {{ formData.owner.user_lname }}
                  {{ formData.owner.user_fname }}
                  {{ formData.owner.user_mname }}
                </span>
              </div>
            </template>

            <el-form
              ref="flowchartEditForm"
              class="box_form form_flowchart_editForm"
              :rules="rules"
              :model="formData"
              label-position="top"
            >
              <el-row>
                <el-col :span="7">
                  <!-- Номер тех. карты -->
                  <el-form-item label="Номер тех. карты" prop="flowChart_code">
                    <el-input
                      v-model="formData.flowChart_code"
                      autocomplete="off"
                      minlength="5"
                      maxlength="5"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <!-- Название тех. карты -->
                  <el-form-item
                    label="Название тех. карты"
                    prop="flowChart_name"
                  >
                    <el-input
                      v-model="formData.flowChart_name"
                      autocomplete="off"
                      minlength="5"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <!-- Относится к -->
                  <el-form-item label="Относится к " prop="isPart">
                    <el-select
                      v-model="formData.isPart"
                      placeholder="Выберите тип"
                    >
                      <el-option
                        v-for="item in isPartSelect"
                        :key="item.code"
                        :label="item.text"
                        :value="item.isPart"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <!-- Кнопка + -->
            <!-- <el-row style="margin-top: 20px">
              <el-button type="primary">
                <i class="el-icon-plus" />
              </el-button>
            </el-row> -->
            <!-- Фильтры -->
            <el-row :gutter="20" width="150px" style="margin-top: 30px">
              <el-col :span="24">
                <select-modification
                  :selected-modification.sync="modificationSelected"
                  :is-checkbox-show="false"
                />
              </el-col>
            </el-row>
            <!-- Добавить в структуру -->
            <el-row style="margin-top: 10px">
              <el-col :span="24">
                <h4>Добавить в структуру</h4>
                <h5 v-show="flowchartSelected">
                  Группа: {{ flowchartSelected }}
                </h5>
                <flowchart-structure v-model="flowchartSelected" />
              </el-col>
            </el-row>
            <!-- Изменить -->
            <el-row
              style="margin-top: 30px"
              class="flowChart_form_attachment_parts"
            >
              <el-col :span="10">
                <!-- Привязка к запчастям -->
                <h4>Привязка к запчастям</h4>
                <el-table
                  ref="item"
                  :data="partsSelected"
                  fit
                  highlight-current-row
                  style="margin-bottom: 10px"
                >
                  <el-table-column label="Название">
                    <template #default="scope">
                      {{ scope.row.part_name }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="right"
                    width="60"
                    class-name="mini-padding fixed-width"
                  >
                    <template #default="scope">
                      <el-popconfirm
                        confirm-button-text="Да"
                        cancel-button-text="Нет, спасибо"
                        title="Подтверждаете удаление?"
                        @onConfirm="deletePart(scope.$index, scope.row)"
                      >
                        <template #reference>
                          <el-tooltip
                            class="box-item"
                            effect="light"
                            placement="top-start"
                            content="Удалить"
                            popper-class="uaz__tooltip uaz__tooltip-left"
                          >
                            <el-button
                              size="mini"
                              class="el-button-icon danger"
                            >
                              <i class="el-icon-delete" />
                            </el-button>
                          </el-tooltip>
                        </template>
                      </el-popconfirm>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- Изменить -->
                <el-button
                  style="margin-bottom: 20px"
                  type="primary"
                  @click="isFlowchartStructureOpen = true"
                >
                  Изменить
                </el-button>
              </el-col>
              <el-col class="flowchart_edit_button">
                <!-- Скачать PDF -->
                <el-button type="primary"> Скачать PDF </el-button>
                <!-- Предварительный просмотр -->
                <el-button type="primary" v-if="id" @click="handlePreview">
                  Предварительный просмотр
                </el-button>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </div>
    </el-row>
    <!-- СТРУКТУРА ТЕХКАРТЫ -->
    <el-row v-if="id">
      <div class="editOperation_edit_card">
        <div class="box">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <p class="title">СТРУКТУРА ТЕХКАРТЫ</p>
                <!-- Кнопка + -->
                <!-- <el-button type="primary" @click="createRow()"> -->
                <el-button type="primary" @click="addItem()">
                  <i class="el-icon-plus" />
                </el-button>
              </div>
            </template>
            <el-tree
              :allow-drag="allowDrag"
              :allow-drop="allowDrop"
              :data="structureFlowchart"
              :props="defaultProps"
              draggable
              node-key="flowChartItem_id"
              @node-drop="handleDrop"
            >
              <template #default="{ node, data }">
                <span class="custom-tree-node structure_flowchart_table">
                  <span class="label_structure_flowchart">
                    {{ node.label }}
                  </span>
                  <!-- Кнопки редактирования -->
                  <span style="display: flex">
                    <!-- Иллюстрация -->
                    <el-tooltip
                      v-if="data.flowChartItemType_id == '1'"
                      class="box-item"
                      effect="light"
                      placement="top-start"
                      content="Посмотреть изображение"
                      popper-class="uaz__tooltip uaz__tooltip-left"
                    >
                      <el-button
                        size="mini"
                        class="el-button-icon"
                        @click="showImage(node, data)"
                      >
                        <i class="el-icon-picture" />
                      </el-button>
                    </el-tooltip>
                    <!-- Настройки иллюстраций -->
                    <el-tooltip
                      v-if="data.flowChartItemType_id == '1'"
                      class="box-item flowchart_select_add"
                      effect="light"
                      placement="top-start"
                      content="Настройки иллюстраций"
                      popper-class="uaz__tooltip uaz__tooltip-left"
                    >
                      <el-select
                        v-model="data.isPrevImage"
                        placeholder="Иллюстрация"
                        style="width: 150px; height: 25px"
                        @change="changeImageVisibility(data)"
                      >
                        <el-option
                          v-for="item in imageOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                        <!-- <el-option label="Отображать" value="2" />
                        <el-option label="Не отображать" value="0" />
                        <el-option
                          label="Использовать из предыдущей"
                          value="1"
                        /> -->
                      </el-select>
                    </el-tooltip>
                    <!-- Редактировать сущность -->
                    <el-popconfirm
                      confirm-button-text="Да"
                      cancel-button-text="Нет, спасибо"
                      title="При редактировании справочника значения поменяются во всех техкартах. Вы уверены?"
                      @onConfirm="editEntity(node, data)"
                    >
                      <template #reference>
                        <el-tooltip
                          v-if="
                            !(
                              data.flowChartItemType_id == '5' ||
                              data.flowChartItemType_id == '3' ||
                              data.flowChartItemType_id == '2'
                            )
                          "
                          class="box-item"
                          effect="light"
                          placement="top-start"
                          content="Редактировать сущность"
                          popper-class="uaz__tooltip uaz__tooltip-left"
                        >
                          <el-button size="mini" class="el-button-icon">
                            <i class="el-icon-edit" />
                          </el-button>
                        </el-tooltip>
                      </template>
                    </el-popconfirm>

                    <!-- Кнопка + для ряда -->
                    <el-tooltip
                      class="box-item flowchart_select_add"
                      effect="light"
                      placement="top-start"
                      content="Добавить элемент"
                      popper-class="uaz__tooltip uaz__tooltip-left"
                    >
                      <el-dropdown @command="addRowItem">
                        <el-button size="mini"> + </el-button>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item
                              :command="{ action: 'top', data: data }"
                            >
                              Добавить вверх
                            </el-dropdown-item>
                            <el-dropdown-item
                              :command="{ action: 'bottom', data: data }"
                            >
                              Добавить вниз
                            </el-dropdown-item>
                            <el-dropdown-item
                              v-if="data.flowChartItemType_id == 5"
                              :command="{ action: 'in', data: data }"
                            >
                              Добавить внутрь
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                      <!-- Первоначальный вариант с el-select. При выборе опции 'Добавить вверх' текст '+' заменялся 'Добавить вверх' -->
                      <!-- <el-select
                        v-model="addDirection"
                        placeholder="+"
                        style="width: 55px; height: 25px"
                        @change="addRowItem(data)"
                      >
                        <el-option label="Добавить вверх" value="top" />
                        <el-option label="Добавить вниз" value="bottom" />
                        <el-option
                          v-if="data.flowChartItemType_id == 5"
                          label="Добавить внутрь"
                          value="in"
                        />
                      </el-select> -->
                    </el-tooltip>
                    <!-- Редактировать элемент -->
                    <el-tooltip
                      class="box-item"
                      effect="light"
                      placement="top-start"
                      content="Редактировать элемент"
                      popper-class="uaz__tooltip uaz__tooltip-left"
                    >
                      <!-- <el-button
                        size="mini"
                        class="el-button-icon"
                        @click="editRow(scope.$index, scope.row)"
                      > -->
                      <el-button
                        size="mini"
                        class="el-button-icon"
                        @click="editItem(node, data)"
                      >
                        <i class="el-icon-edit-outline" />
                      </el-button>
                    </el-tooltip>
                    <!-- Удалить элемент -->
                    <el-popconfirm
                      confirm-button-text="Да"
                      cancel-button-text="Нет, спасибо"
                      title="Подтверждаете удаление?"
                      @onConfirm="deleteRow(node, data)"
                    >
                      <template #reference>
                        <el-tooltip
                          class="box-item"
                          effect="light"
                          placement="top-start"
                          content="Удалить элемент"
                          popper-class="uaz__tooltip uaz__tooltip-left"
                        >
                          <el-button size="mini" class="el-button-icon danger">
                            <i class="el-icon-delete" />
                          </el-button>
                        </el-tooltip>
                      </template>
                    </el-popconfirm>
                    <!-- <a style="margin-left: 8px" @click="remove(node, data)">
                    Delete
                  </a> -->
                  </span>
                </span>
              </template>
            </el-tree>
          </el-card>
        </div>
      </div>
    </el-row>
    <flowchart-structure-dialog
      v-if="isFlowchartStructureOpen"
      v-model="partsSelected"
      :open.sync="isFlowchartStructureOpen"
      :row-delete="rowDelete"
    />
    <!-- Предварительный просмотр -->
    <flowchart-preview-dialog
      v-if="isPreviewOpen"
      :open.sync="isPreviewOpen"
      :flowchart-id="flowchartId"
    />
    <!-- Кнопка + -->
    <flowchart-dialog
      :open.sync="isModalOpen"
      :data.sync="modalData"
      @saveData="saveModalData"
    />
    <!-- Редактировать сущность -->
    <notification-dialog
      v-if="isNotificationOpen"
      :open.sync="isNotificationOpen"
      :data.sync="notificationModalData"
      @saveData="saveNotificationData"
    />
    <table-dialog
      :open.sync="isTableOpen"
      :data.sync="tableData"
      @saveData="saveTableData"
    />
    <image-dialog :open.sync="isImageOpen" :data.sync="imageData" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import request from '@/utils/request'
import workflow from '@/utils/workflow'
import SelectModification from '@/components/Modification/SelectModification'
import flowchartStructure from '@/components/Flowchart/flowchartStructure'
import flowchartStructureDialog from '@/components/Dialog/FlowchartStructureDialog'
import flowchartDialog from '@/components/Dialog/FlowchartDialog'
import imageDialog from '@/components/Dialog/ImageDialog'
import { Notification } from 'element-ui'
import NotificationDialog from '@/components/Dialog/NotificationDialog'
import flowchartPreviewDialog from '@/components/Dialog/FlowchartPreviewDialog'
import TableDialog from '@/components/Dialog/TableDialog'
import PanelButton from '@/components/PanelButton/PanelButton'

export default {
  components: {
    SelectModification,
    flowchartStructure,
    flowchartPreviewDialog,
    flowchartStructureDialog,
    flowchartDialog,
    imageDialog,
    NotificationDialog,
    TableDialog,
    PanelButton
  },
  data() {
    return {
      showButtons: [],
      localEdit: false,
      imageOptions: [
        { value: 2, label: 'Отображать' },
        { value: 0, label: 'Не отображать' },
        { value: 1, label: 'Из предыдущей' }
      ],
      id: Number(this.$route.params?.id),
      rules: {
        flowChart_code: [
          { required: true, message: 'Заполните поле', trigger: 'blur' },
          {
            required: true,
            min: 5,
            max: 5,
            message: 'Номер должен состоять из 5 символов',
            trigger: 'blur'
          },
          {
            trigger: 'blur',
            validator(rule, value, callback) {
              if (/^\d+$/.test(value)) {
                callback()
              } else {
                callback(new Error('Номер должен состоять из цифр'))
              }
            }
          }
        ],
        flowChart_name: [
          { required: true, message: 'Заполните поле', trigger: 'blur' },
          {
            required: true,
            min: 5,
            message: 'Минимальное количество символов: 5',
            trigger: 'blur'
          }
        ]
      },
      formData: {
        flowChart_id: '',
        flowChart_code: '',
        owner: {
          user_lname: '',
          user_fname: '',
          user_mname: ''
        }
      },
      currentFilter: {},
      isPartSelect: [
        { code: 1, text: 'Модификация', isPart: false },
        { code: 2, text: 'Запчасть', isPart: true }
      ],
      modificationSelected: [],
      flowchartSelected: '',
      structureFlowchart: [],
      defaultProps: {
        label: 'flowChartItem_name',
        children: 'nodes'
      },
      // treeLevelIdxs используется в saveModalData для определения места вставки нового узла
      treeLevelIdxs: [],
      listLoading: true,
      // кнопка Изменить
      isFlowchartStructureOpen: false,
      partsSelected: [],
      rowDelete: {},
      // кнопка Предварительный просмотр
      isPreviewOpen: false,
      // Добавить элемент
      isModalOpen: false,
      modalData: [],
      // Редактировать сущность
      activeNode: null,
      typeId: 0,
      isNotificationOpen: false,
      notificationModalData: {
        isActive: 1,
        isWarning: 0,
        notification_icon: 'warning',
        notification_text: ''
      },
      flowchartId: 0,
      isTableOpen: false,
      tableData: {
        tables_name: '',
        tables_description: ''
      },
      isImageOpen: false,
      imageData: '',
      dropPosition: '',
      flowchart_id: '',
      isLoading: false
    }
  },

  async mounted() {
    this.clearOperationAction()
    this.clearOperationImg()
    if (this.id) {
      this.getInfo(this.id)
    }
    this.flowchartId = this.id
    if (this.$route.query.localedit) {
      this.showButtons = workflow.getButton('flowchart', 'localedit')
    } else {
      this.showButtons = workflow.getButton('flowchart', 'draft')
    }
    this.modalData = []
    if (this.$route.query?.fromOperation) {
      const item_id = this.$route.query?.item_id
      const o = await this.getFlowchartFull(item_id)
      const tmp = Object.assign({}, o)
      this.modalData.push(tmp)
      this.isModalOpen = true
    }
    if (this.$route.query?.fromEntity) {
      const item_id = this.$route.query?.item_id
      const o = await this.getFlowchartFull(item_id)
      this.$router.push(`/flowchart/edit/${this.id}`)
    }
    if (this.$route.query?.createOperation) {
      const tmp = {
        flowChartItem_id: null,
        flowChartItem_name: '',
        flowChartItemType_id: '1'
      }
      this.modalData.push(tmp)
      this.isModalOpen = true
    }
    if (this.$route.query?.createFlowchart) {
      const tmp = {
        flowChartItem_id: null,
        flowChartItem_name: '',
        flowChartItemType_id: '2'
      }
      this.modalData.push(tmp)
      this.isModalOpen = true
    }
  },
  methods: {
    ...mapActions('operation', ['clearOperationAction', 'clearOperationImg']),
    async clickBtnAgreedORRD() {
      this.isLoading = true
      await this.submitForm()
      this.isLoading = false
      this.goBack()
    },
    async clickBtnSaveAndContinue() {
      this.isLoading = true
      const newFlowchartId = await this.submitForm()
      this.isLoading = false
      if (newFlowchartId) this.$router.push(`/flowchart/edit/${newFlowchartId}`)
    },
    async clickBtnSaveDraft() {
      this.isLoading = true
      const newFlowchartId = await this.submitForm()
      this.isLoading = false
      if (newFlowchartId) this.goBack()
    },
    clickBtnClosed() {
      this.goBack()
    },
    goBack() {
      const fid = this.$route.query?.createflowchart_id
      if (fid) {
        this.$router.push(
          `/flowchart/edit/${fid}?createFlowchart=${this.flowchart_id}`
        )
      } else {
        this.$router.push(`/flowchart/`)
      }
    },
    async getInfo() {
      const res = await request({
        url: '/flowchart/get/' + this.id,
        method: 'get',
        params: { toHierarchy: true }
      })
      this.formData = res.data
      this.modificationSelected = this.formData.modifications
      this.partsSelected = this.formData.parts
      this.structureFlowchart = this.formData.items
      this.listLoading = false
    },
    searchList() {},
    allowDrop(draggingNode, dropNode, dropType) {
      const node = draggingNode.data
      const dropNod = dropNode.data
      // Второй уровень вложенности только у Заголовков
      if (dropNod.flowChartItemType_id !== 5 && dropType === 'inner') {
        return false
      }
      // Нельзя размещать Заголовок в другом Заголовке
      if (node.flowChartItemType_id === 5 && dropNod.treeLevel === 2) {
        return false
      }
      if (node.flowChartItemType_id === 5 && dropType === 'inner') return false
      return true
    },
    allowDrag(draggingNode) {
      return true
    },
    async handleDrop(draggingNode, dropNode, dropType, ev) {
      const node = draggingNode.data
      const dropNod = dropNode.data
      if (dropNod.flowChartItemType_id !== 5 && dropType === 'inner') {
        Notification({
          message: 'Второй уровень вложенности только у Заголовков',
          type: 'warning',
          duration: 1000
        })
        console.log(
          'Второй уровень вложенности только у Заголовков',
          dropNod.flowChartItemType_id
        )
        return false
      }
      // if (dropNod.treeLevel === 2) {
      //   console.log('Максимум два уровня вложенности', dropNod.treeLevel)
      //   return false
      // }
      // if (
      //   dropNod.flowChartItemType_id === 5 &&
      //   node.flowChartItemType_id === 5 &&
      //   dropType === 'inner'
      // ) {
      //   console.log(
      //     'Нельзя размещать Заголовок в другом Заголовке',
      //     dropNod.flowChartItemType_id
      //   )
      //   return false
      // }

      const params = {}
      // передаем на бэк 1 параметр, если узел ставится впереди всех элементов
      params.flowChartItem_id = node.flowChartItem_id
      // this.treeLevelIdxs = this.getPosIdxs(node, this.structureFlowchart)

      if (dropNod.treeLevel === 1) {
        if (dropType === 'after') {
          params.flowChartItem_top_id = dropNod ? dropNod.flowChartItem_id : 0
        } else if (dropType === 'before') {
          // найти предыдущий элемент массива 1 уровня
          const ar = this.structureFlowchart.map((v) => v.flowChartItem_id)
          const index = ar.indexOf(node.flowChartItem_id)
          const prevItem = this.structureFlowchart[index - 1]
          if (prevItem) {
            params.flowChartItem_top_id = prevItem.flowChartItem_id
          }
        } else if (dropType === 'inner') {
          // params.flowChartItem_top_id
          params.flowChartItem_parent_id = dropNod
            ? dropNod.flowChartItem_id
            : 0
        }
      } else if (dropNod.treeLevel === 2) {
        params.flowChartItem_parent_id = dropNod ? dropNod.parent_id : 0
        if (dropType === 'after') {
          params.flowChartItem_top_id = dropNod ? dropNod.flowChartItem_id : 0
        } else if (dropType === 'before') {
          // найти родителя массива 2 уровня
          const parentNode = this.structureFlowchart.find(
            (v) => v.flowChartItem_id === dropNod.parent_id
          )
          // найти предыдущий элемент массива 2 уровня
          const ar = parentNode?.nodes.map((v) => v.flowChartItem_id)
          const index = ar.indexOf(node.flowChartItem_id)
          const prevItem = parentNode.nodes[index - 1]
          if (prevItem) {
            params.flowChartItem_top_id = prevItem.flowChartItem_id
          }
        } else {
          console.log('Else dropType')
        }
      }
      this.submitMove(params)
      // Перестроить структуру техкарты на фронте
      if (node.treeLevel === 1 && dropNod.treeLevel === 2) {
        node.treeLevel = 2
        node.parent_id = dropNod.flowChartItem_id
        node.nodes = []
      }
      if (node.treeLevel === 2 && dropNod.treeLevel === 1) {
        node.treeLevel = 1
      }
      if (dropType === 'inner') {
        node.treeLevel = 2
        node.parent_id = dropNod.flowChartItem_id
        node.nodes = []
      }

      // this.treeLevelIdxs = this.getPosIdxs(node, this.structureFlowchart)
      // this.structureFlowchart = this.buildTreeMove(
      //   this.treeLevelIdxs,
      //   dropType,
      //   node,
      //   dropNod,
      //   this.structureFlowchart
      // )
    },
    async submitMove(params) {
      const res = await request({
        url: '/flowchartitem/move',
        method: 'put',
        data: params
      })
      if (!res) {
        console.log('PUT request error')
      }
    },
    addItem() {
      this.modalData = []
      this.dropPosition = ''
      const tmp = { flowChartItem_id: null }
      this.modalData.push(tmp)
      this.activeNode = null
      this.isModalOpen = true
    },
    addRowItem(command) {
      this.dropPosition = command.action
      const curNode = command.data
      if (!curNode.treeLevel) {
        console.error(' treeLevel ==', curNode.treeLevel)
        return
      }
      this.modalData = []
      const tmp = {}
      tmp.flowChartItem_id = null
      tmp.treeLevel = curNode.treeLevel
      tmp.flowChart_id = curNode.flowChart_id
      tmp.flowChartItem_parent = curNode.flowChartItem_id
      tmp.position = this.dropPosition
      this.modalData.push(tmp)
      this.isModalOpen = true
      this.treeLevelIdxs = this.getPosIdxs(curNode, this.structureFlowchart)
    },
    getPosIdxs(node, tree) {
      // posIdxs хранит индексы узлов 1 и 2 уровней
      const posIdxs = []
      // Элемент первого уровня вложен в первый уровень
      if (node.treeLevel === 1) {
        let parent_idx = tree.findIndex(
          (v) => node.flowChartItem_id === v.flowChartItem_id
        )
        let child_idx = -1
        // Элемент первого уровня вложен во второй уровень
        if (parent_idx === -1) {
          let parent_id
          tree.map((p) =>
            p.nodes.map((n) => {
              if (n.flowChartItem_id === node.flowChartItem_id) {
                parent_id = p.flowChartItem_id
              }
            })
          )
          parent_idx = tree.findIndex((v) => v.flowChartItem_id === parent_id)
          // найти родителя массива 2 уровня
          const parentNode = tree[parent_idx]
          // найти элемент массива 2 уровня
          const ar = parentNode.nodes.map((v) => v.flowChartItem_id)
          child_idx = ar.indexOf(node.flowChartItem_id)
          // ==============
        }
        posIdxs.push(parent_idx)
        posIdxs.push(child_idx)
      } else if (node.treeLevel === 2) {
        const parent_idx = tree.findIndex(
          (v) => node.parent_id === v.flowChartItem_id
        )
        // найти родителя массива 2 уровня
        const parentNode = tree[parent_idx]
        // найти элемент массива 2 уровня
        const ar = parentNode.nodes.map((v) => v.flowChartItem_id)
        const child_idx = ar.indexOf(node.flowChartItem_id)
        // ==============
        posIdxs.push(parent_idx)
        posIdxs.push(child_idx)
      }
      return posIdxs
    },
    async editItem(node, data) {
      this.modalData = []
      const tempData = Object.assign({}, data)
      tempData.notification_text = tempData.flowChartItem_name
      if (tempData.flowChartItemType_id === 3) {
        const o = await this.getFlowchart(tempData.flowChartItem_ref)
        tempData.flowChart_name = o.name
        tempData.flowChart_ref = o.id
      }

      this.modalData.push(tempData)
      this.isModalOpen = true
      this.activeNode = data
    },
    async editEntity(node, data) {
      this.typeId = node.data.flowChartItemType_id
      const itemId = node.data.flowChartItem_id
      if (this.typeId === 4 || this.typeId === 7) {
        this.activeNode = data
        const tmp = await this.getNotification(data.notification_ref)
        Object.assign(this.notificationModalData, tmp)
        this.isNotificationOpen = true
      } else if (this.typeId === 1) {
        this.$router.push(
          `/operations/edit/${data.operation_ref}?flowchart_id=${node.data.flowChart_id}&item_id=${itemId}`
        )
        // } else if (this.typeId === 2) {
        //   this.$router.push('/flowchart/edit/' + data.flowChart_id)
      } else if (this.typeId === 6) {
        this.activeNode = data
        const tmp = await this.getTable(data.tables_ref)
        Object.assign(this.tableData, tmp)
        this.isTableOpen = true
      }
    },
    saveModalData(modeOperation, ar) {
      ar.forEach((item) => {
        const params = {}
        params.flowChartItem_name = item.flowChartItem_name
        params.flowChartItemType_id = item.flowChartItemType_id
        params.treeLevel = item.treeLevel
        params.flowChart_id = item.flowChart_id
        if (
          item.flowChartItemType_id === '5' ||
          item.flowChartItemType_id === '3' ||
          item.flowChartItemType_id === '2'
        ) {
          params.flowChartItem_parent = item.flowChartItem_parent
          params.position = item.position
        }
        if (
          item.flowChartItemType_id === '4' ||
          item.flowChartItemType_id === '7'
        ) {
          params.notification_id = item.notification_id
          params.notification_icon = item.notification_icon
          params.isActive = item.isActive
          params.position = this.dropPosition
        }
        if (item.flowChartItemType_id === '1') {
          params.flowChartItem_parent = item.flowChartItem_parent
          params.position = item.position
          params.isPrevImage = item.isPrevImage
          params.position = this.dropPosition
        }
        if (item.flowChartItemType_id === '6') {
          params.flowChartItem_parent = item.flowChartItem_parent
          params.position = item.position
          params.tables_name = item.tables_name
        }
      })
      if (modeOperation === 'update') {
        // Если перед редактированием добавили  операцию - запрашиваем данные с сервера
        if (this.$route.query?.fromOperation) {
          this.getInfo(this.id)
        } else {
          Object.assign(this.activeNode, ar[0])
        }
      }
      if (modeOperation === 'create') {
        Object.assign(this.modalData, ar)
        // this.getInfo(this.id)
        this.structureFlowchart = this.buildTreeAdd(
          this.treeLevelIdxs,
          this.dropPosition,
          this.modalData,
          this.structureFlowchart
        )
        console.log(
          '🚀 ~ file: editFlowchart.vue:895 ~ saveModalData ~ structureFlowchart:',
          this.structureFlowchart
        )
      }
    },
    // pos_idxs = [parent_idx, child_idx]; pos_type=top,bottom,in
    buildTreeAdd(pos_idxs, pos_type, added_ar, tree) {
      if (pos_idxs[1] === -1) {
        // 1ый уровень вложенности
        if (pos_type === 'top') {
          added_ar.map((v, idx) => {
            tree.splice(pos_idxs[0] + idx, 0, v)
          })
        } else if (pos_type === 'bottom') {
          added_ar.map((v, idx) => {
            tree.splice(pos_idxs[0] + idx + 1, 0, v)
          })
        } else if (pos_type === 'in') {
          const parent_idx = pos_idxs[0]
          tree[parent_idx].nodes = [...tree[parent_idx].nodes, ...added_ar]
        } else {
          tree = [...tree, ...added_ar]
        }
      } else {
        // 2ой уровень вложенности
        const parent_idx = pos_idxs[0]
        if (pos_type === 'top') {
          added_ar.map((v, idx) => {
            tree[parent_idx].nodes.splice(pos_idxs[1] + idx, 0, v)
          })
        } else if (pos_type === 'bottom') {
          added_ar.map((v, idx) => {
            tree[parent_idx].nodes.splice(pos_idxs[1] + idx + 1, 0, v)
          })
        } else {
          tree = [...tree, ...added_ar]
        }
      }
      return tree
    },
    buildTreeMove(pos_idxs, pos_type, node, tree) {
      const result = tree
      if (pos_idxs[1] === -1) {
        // 1ый уровень вложенности
        if (pos_type === 'before') {
          result.filter((n) => n.flowChartItem_id === node.flowChartItem_id)
          result.splice(pos_idxs[0], 0, node)
        } else if (pos_type === 'after') {
          result.filter((n) => n.flowChartItem_id === node.flowChartItem_id)
          result.splice(pos_idxs[0], 0, node)
        } else {
          // result.push(node)
        }
      } else {
        // 2ой уровень вложенности
        const parent_idx = pos_idxs[0]
        if (pos_type === 'before') {
          result[parent_idx].nodes.splice(pos_idxs[1], 0, node)
        } else if (pos_type === 'after') {
          result[parent_idx].nodes.splice(pos_idxs[1] + 1, 0, node)
        } else if (pos_type === 'inner') {
          result.filter((n) => n.flowChartItem_id !== node.flowChartItem_id)
          const parent_idx = pos_idxs[0]
          result[parent_idx].nodes.push(node)
        } else {
          result.push(node)
        }
      }
      return result
    },
    async submitForm() {
      if (this.modificationSelected.length + this.partsSelected.length === 0) {
        this.$notify({
          title: 'Предупреждение!',
          message: 'Выберите модификации или запчасти',
          type: 'warning',
          duration: 2000
        })
        return
      }
      try {
        const formValidate = this.$refs['flowchartEditForm'].validate()
        const isValid = await formValidate
        if (isValid) {
          this.formData.modifications = this.modificationSelected
          this.formData.parts = this.partsSelected
          if (this.formData.flowChart_id) {
            const res = await request({
              url: '/flowchart/' + this.formData.flowChart_id,
              method: 'put',
              data: this.formData
            })
            if (!res) {
              console.log('PUT request error')
            }
          } else {
            const res = await request({
              url: '/flowchart/',
              method: 'post',
              data: this.formData
            })
            if (!res) {
              console.log('POST request error')
            } else {
              this.flowchart_id = res.flowChart_id
              this.$notify({
                title: 'Успешно!',
                message: 'Данные успешно добавлены',
                type: 'success',
                duration: 5000
              })
              return this.flowchart_id
            }
          }
        } else {
          console.log('flowchartEditForm not valid')
        }
      } catch (err) {
        console.log(err)
      }
    },
    async getOperation(id) {
      const res = await request({
        url: '/operations/' + id,
        method: 'get'
      })
      return res
    },
    async getNotification(id) {
      const notification = await request({
        url: '/notifications/' + id,
        method: 'get'
      })
      return notification
    },
    async getTable(id) {
      const table = await request({
        url: '/tables/' + id,
        method: 'get'
      })
      return table
    },
    async getFlowchart(id) {
      const res = await request({
        url: '/flowchartitem/' + id,
        method: 'get'
      })
      return {
        name: res.flowchart.flowChart_name,
        id: res.flowchart.flowChart_id
      }
    },
    async getFlowchartFull(id) {
      const res = await request({
        url: '/flowchartitem/' + id,
        method: 'get'
      })
      return res
    },
    saveNotificationData($type) {
      Object.assign(this.activeNode, this.notificationModalData)
      this.activeNode.flowChartItem_name = this.activeNode.notification_text
      // удалить дубликаты
      this.$nextTick(() => {
        this.structureFlowchart = [...new Set(this.structureFlowchart)]
      })
    },
    saveTableData($type) {
      Object.assign(this.activeNode, this.tableData)
      this.activeNode.flowChartItem_name = this.activeNode.tables_name
      this.$nextTick(() => {
        this.structureFlowchart = [...new Set(this.structureFlowchart)]
      })
    },
    test() {
      alert('111')
    },
    async deletePart(idx, row) {
      this.partsSelected = this.partsSelected.filter(
        (v) => v.part_id !== row.part_id
      )
    },
    async deleteRow(index, row) {
      const res = await request({
        url: '/flowchartitem/' + row.flowChartItem_id,
        method: 'delete'
      })
      if (res) {
        this.$notify({
          title: 'Успешно!',
          message: 'Данные успешно удалены',
          type: 'success',
          duration: 5000
        })
        if (row.treeLevel === 1) {
          this.structureFlowchart = this.structureFlowchart.filter(
            (v) => v !== row
          )
        } else if (row.treeLevel === 2) {
          let parent_id
          this.structureFlowchart.map((v) =>
            v.nodes.map((n) => {
              if (n.flowChartItem_id === row.flowChartItem_id) {
                parent_id = v.flowChartItem_id
              }
            })
          )
          const parent_idx = this.structureFlowchart.findIndex(
            (v) => v.flowChartItem_id === parent_id
          )
          this.structureFlowchart[parent_idx].nodes = this.structureFlowchart[
            parent_idx
          ].nodes.filter((v) => v.flowChartItem_id !== row.flowChartItem_id)
        } else {
          console.error(' treeLevel ==', row.treeLevel)
        }
      }
    },

    async showImage(node, data) {
      if (data.operation_image) {
        this.imageData = data.operation_image
      } else {
        const o = await this.getOperation(data.operation_ref)
        this.imageData = o.operation_image
      }
      this.isImageOpen = true
    },
    async changeImageVisibility(curNode) {
      const res = await request({
        url: '/flowchartitem/' + curNode.flowChartItem_id,
        method: 'put',
        data: {
          isPrevImage: curNode.isPrevImage
        }
      })
      if (!res) {
        console.log('PUT request error')
      }
    },
    async handlePreview() {
      await this.submitForm()
      this.isPreviewOpen = true
    }
  }
}
</script>
<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
}
.el-form-item {
  margin: 0 20px 0 0;
  height: 72px;
}
.custom-tree-node {
  margin: 10px;
  /* padding: 10px; */
  width: 1000px;
  border: 1px black solid;
  cursor: move;
}
.structure_flowchart_table {
  display: flex;
  justify-content: space-between;
  width: 100%;
  border: 0;
  margin: 0px;
  padding: 2px 0;
}
.structure_flowchart_table .el-button {
  margin-left: 2px;
}
.label_structure_flowchart {
  white-space: normal;
}
.bottom_panel {
  border-top: 1px solid #e6ebf5;
  position: fixed;
  bottom: 0px;
  width: 100%;
  padding: 5px 0;
  z-index: 9;
  height: 51px;
  background: #ffffff;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
.fixed_affix {
  position: fixed;
  right: 0;
  padding: 0 15px;
  z-index: 10;
  height: 40px;
  display: flex;
}
.flowchart_edit_button {
  display: flex;
  border-top: 1px solid #e6ebf5;
  justify-content: flex-end;
}
.flowchart_edit_button button {
  margin: 10px;
}
</style>
