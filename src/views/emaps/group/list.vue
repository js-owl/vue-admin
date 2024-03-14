<template>
  <div class="app-container flowchart_edit sticky_edit">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="editOperation_edit_card">
          <div class="box">
            <el-card class="box-card">
              <template #header>
                <div class="card-header">
                  <p class="title">ИЗМЕНИТЬ СПИСОК ГРУПП ЭЛЕКТРОСХЕМ</p>
                  <el-button type="primary" @click="addRootItem()">
                    Добавить в корень
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
                    <span class="emaps-label">
                      {{ node.label }}
                    </span>
                    <!-- Кнопки редактирования -->
                    <span style="display: flex">
                      <!-- Редактировать элемент -->
                      <el-tooltip
                        class="box-item"
                        effect="light"
                        placement="top-start"
                        content="Редактировать элемент"
                        popper-class="uaz__tooltip uaz__tooltip-left"
                      >
                        <el-button
                          size="mini"
                          class="el-button-icon"
                          @click="editItem(node, data)"
                        >
                          <i class="el-icon-edit-outline" />
                        </el-button>
                      </el-tooltip>
                      <!-- Добавить элемент -->
                      <el-tooltip
                        class="box-item"
                        effect="light"
                        placement="top-start"
                        content="Редактировать элемент"
                        popper-class="uaz__tooltip uaz__tooltip-left"
                      >
                        <el-button
                          size="mini"
                          class="el-button-icon"
                          @click="addItem(node, data)"
                        >
                          +
                        </el-button>
                      </el-tooltip>
                      <!-- Удалить элемент -->
                      <el-popconfirm
                        confirm-button-text="Да"
                        cancel-button-text="Нет, спасибо"
                        title="Подтверждаете удаление?"
                        @onConfirm="deleteItem(node, data)"
                      >
                        <template #reference>
                          <el-tooltip
                            class="box-item"
                            effect="light"
                            placement="top-start"
                            content="Удалить элемент"
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
                    </span>
                  </span>
                </template>
              </el-tree>
            </el-card>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="editOperation_edit_card">
          <div class="box">
            <el-card class="box-card">
              <template #header>
                <div class="card-header">
                  <p class="title">ЭЛЕКТРИЧЕСКИЕ ПРИНЦИПИАЛЬНЫЕ СХЕМЫ</p>
                </div>
              </template>
              <div class="emaps-body">Элементы не найдены</div>
            </el-card>
            <el-card class="box-card">
              <template #header>
                <div class="card-header">
                  <p class="title">РАСПОЛОЖЕНИЕ КОМПОНЕНТОВ</p>
                </div>
              </template>
              <div class="emaps-body">Элементы не найдены</div>
            </el-card>
            <el-card class="box-card">
              <template #header>
                <div class="card-header">
                  <p class="title">СХЕМЫ РАЗЪЕМОВ</p>
                </div>
              </template>
              <div class="emaps-body">Элементы не найдены</div>
            </el-card>
          </div>
        </div>
      </el-col>
    </el-row>
    <emaps-group-dialog
      v-if="isModalOpen"
      :open.sync="isModalOpen"
      :data.sync="modalData"
    />
  </div>
</template>

<script>
import request from '@/utils/request'
import EmapsGroupDialog from '@/components/Dialog/EmapsGroupDialog'

export default {
  components: { EmapsGroupDialog },
  data() {
    return {
      defaultProps: {
        label: 'flowChartItem_name',
        children: 'nodes'
      },
      structureFlowchart: [],
      // Редактировать элемент
      isModalOpen: false,
      modalData: {}
    }
  },

  async mounted() {
    this.getInfo()
  },
  methods: {
    async getInfo() {
      const res = await request({
        url: '/flowchart/get/5879',
        method: 'get',
        params: { toHierarchy: true }
      })
      this.formData = res.data
      this.structureFlowchart = this.formData.items
    },
    allowDrag() {},
    allowDrop() {},
    handleDrop() {},
    addRootItem() {},
    editItem(node, data) {
      Object.assign(this.modalData, data)
      console.log('🚀 ~ editItem ~ this.modalData:', this.modalData)
      this.isModalOpen = true
    },
    addItem() {},
    deleteItem() {}
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
.emaps-label {
  white-space: normal;
}
.emaps-body {
  padding: 0 0 100px;
}
</style>
