<template>
  <div>
    <div class="box">
      <el-card class="box-card break_word">
        <template #header>
          <div class="card-header">
            <p class="title">Используемые инструменты, специнструменты</p>
          </div>
        </template>
        <div class="df jcfe mb10">
          <el-button
            v-if="role_name != 'translator'"
            size="medium"
            type="primary"
            @click="isOpen = true"
          >
            {{ selectedTools.length ? 'Изменить' : 'Добавить' }}
          </el-button>
        </div>
        <el-table
          :data="selectedTools"
          border
          fit
          highlight-current-row
          style="width: 100%"
          row-key="tool_id"
        >
          <el-table-column label="В таблице операций" width="170">
            <template>
              <el-checkbox />
            </template>
          </el-table-column>
          <el-table-column label="Тип" width="250">
            <template #default="scope">
              {{ transformTypeID(scope.row.toolType_id) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="tool_name"
            label="Название"
            width="width: 100%"
          />
          <el-table-column
            class-name="action-center"
            fixed="right"
            label="Действие"
            width="104"
            align="center"
          >
            <template #default="scope">
              <el-tooltip
                v-if="role_name != 'translator'"
                class="box-item"
                effect="light"
                placement="top-start"
                content="Удалить"
                popper-class="uaz__tooltip uaz__tooltip-left"
              >
                <el-button
                  link
                  size="mini"
                  class="el-button-icon danger"
                  @click.prevent="deleteRow(scope.$index, scope.row)"
                >
                  <i class="el-icon-delete" />
                </el-button>
              </el-tooltip>
              <el-tooltip
                v-if="role_name == 'translator'"
                class="box-item"
                effect="light"
                placement="top-start"
                content="Редактировать"
                popper-class="uaz__tooltip uaz__tooltip-left"
              >
                <el-button
                  link
                  size="mini"
                  class="el-button-icon"
                  @click.prevent="showModalEditElement(scope.$index, scope.row)"
                >
                  <i class="el-icon-edit" />
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <tool-select-dialog v-model="selectedTools" :open.sync="isOpen" />
    <equipment-add-dialog
      :open.sync="dialogFormVisible"
      :data.sync="tempData"
      @saveData="saveModalData"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import toolSelectDialog from '@/views/operations/toolSelectDialog'
import EquipmentAddDialog from '@/components/Dialog/EquipmentAddDialog'

export default {
  components: { toolSelectDialog, EquipmentAddDialog },
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      isOpen: false,
      activeRow: null,
      dialogFormVisible: false,
      tempData: {
        tool_name: '',
        tool_name_en: '',
        tool_name_es: '',
        tool_image: '',
        toolType_id: 2
      }
    }
  },
  computed: {
    ...mapGetters(['role_name']),
    selectedTools: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    transformTypeID(id) {
      switch (id) {
        case 1:
          return 'Специнструмент'
        case 2:
          return 'Оборудование и инструменты'
        case 3:
          return 'Материал'
        case 4:
          return 'Общий инструмент'
      }
    },
    showModalEditElement(index, row) {
      this.activeRow = row
      Object.assign(this.tempData, row)
      this.dialogFormVisible = !this.dialogFormVisible
    },
    saveModalData($type) {
      if ($type === 'update') {
        Object.assign(this.activeRow, this.tempData)
      }
    },
    deleteRow(idx, row) {
      this.selectedTools = this.selectedTools.filter((x) => x !== row)
    }
  }
}
</script>
