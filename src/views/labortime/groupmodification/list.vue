<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :row-class-name="tableRowClassName"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="ID" width="50">
        <template #default="scope">
          {{ scope.row.modificationGroup_id }}
        </template>
      </el-table-column>
      <el-table-column label="Название в INCADEA">
        <template #default="scope">
          {{ scope.row.modificationGroup_name }}
        </template>
      </el-table-column>
      <el-table-column label="Название">
        <template #default="scope">
          {{ scope.row.modificationGroup_original_name }}
        </template>
      </el-table-column>
      <el-table-column
        align="right"
        width="170"
        class-name="small-padding fixed-width button-tooltip"
      >
        <template #header>
          <el-button size="mini" class="add-element" type="primary" @click="createRow">
            Добавить
          </el-button>
        </template>
        <template #default="scope">
          <router-link
            :to="
              '/labortime/groupmodification/edit/' +
                scope.row.modificationGroup_id
            "
          >
            <el-tooltip
              class="box-item"
              effect="light"
              placement="top-start"
              content="Открыть"
              popper-class="uaz__tooltip uaz__tooltip-left"
            >
              <el-button size="mini" class="el-button-icon">
                <i class="el-icon-folder-opened" />
              </el-button>
            </el-tooltip>
          </router-link>

          <el-tooltip
            class="box-item"
            effect="light"
            placement="top-start"
            content="Редактировать"
            popper-class="uaz__tooltip uaz__tooltip-left"
          >
            <el-button
              size="mini"
              class="el-button-icon"
              @click="showModalEditElement(scope.$index, scope.row)"
            >
              <i class="el-icon-edit" />
            </el-button>
          </el-tooltip>

          <el-tooltip
            class="box-item"
            effect="light"
            placement="top-start"
            content="Скопировать"
            popper-class="uaz__tooltip uaz__tooltip-left"
          >
            <el-button
              size="mini"
              class="el-button-icon"
              @click="showModalEditElement(scope.$index, scope.row, 'copy')"
            >
              <i class="el-icon-document-copy" />
            </el-button>
          </el-tooltip>

          <el-popconfirm
            confirm-button-text="Да"
            cancel-button-text="Нет, спасибо"
            title="Подтверждаете удаление?"
            @onConfirm="deleteRow(scope.$index, scope.row)"
          >
            <template #reference>
              <el-tooltip
                class="box-item"
                effect="light"
                placement="top-start"
                content="Удалить"
                popper-class="uaz__tooltip uaz__tooltip-left"
              >
                <el-button size="mini" class="el-button-icon danger">
                  <i class="el-icon-delete" />
                </el-button>
              </el-tooltip>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <dialog-f
      :show-dialog.sync="dialogFormVisible"
      width="70%"
      title="Редактор группы модификаций "
      @closeDialog="dialogFormVisible = false"
      @saveData="saveModalData()"
    >
      <el-form>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="Название в Incadea">
              <el-input
                v-model="rowData.modificationGroup_name"
                :disabled="
                  rowData.modificationGroup_id > 0 && dialogFormMode !== 'copy'
                    ? true
                    : false
                "
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="Название">
              <el-input
                v-model="rowData.modificationGroup_original_name"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" width="150px">
          <el-col :span="24">
            <select-incadea-modification
              v-if="dialogFormVisible"
              :selected-modification.sync="selectedModification"
            />
          </el-col>
        </el-row>
      </el-form>
    </dialog-f>
    <pagination
      v-show="total > 0"
      layout="prev, pager, next"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import request from '@/utils/request'
import DialogF from '@/components/Dialog/DialogF'
import SelectIncadeaModification from '@/components/Modification/SelectIncadeaModification'
export default {
  name: 'ModificationGroupsList',
  components: { Pagination, DialogF, SelectIncadeaModification },
  data() {
    const selectedModification = []
    const tableRowClassName = ({ row, rowIndex }) => {
      if (row.lt_count === 0) {
        return 'warning-row'
      }
      return ''
    }
    return {
      tableRowClassName,
      selectedModification,
      list: null,
      total: 0,
      storage: process.env.VUE_APP_BACKEND_HOST + '/storage/',
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      dialogFormVisible: false,
      dialogFormMode: 'update',
      rowData: {
        modificationGroup_name: '',
        modificationGroup_original_name: ''
      },
      activeRow: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    dd(data) {
      console.log(data)
    },
    async getList() {
      const res = await request({
        url: '/modification-groups',
        method: 'get',
        params: {
          page: this.listQuery.page,
          sortByOriginalName: 'ASC'
        }
      })
      this.list = res.data
      this.total = res.total
      this.listQuery.page = res.current_page
      this.listQuery.limit = res.per_page
      this.listLoading = false
      console.log(res)
    },
    createRow() {
      this.rowData = {
        modificationGroup_name: '',
        modificationGroup_original_name: '',
        modificationGroup_id: null
      }
      this.showModalEditElement(null, null)
    },
    showModalEditElement(index, row, FormMode = 'update') {
      this.dialogFormMode = FormMode
      this.activeRow = row
      Object.assign(this.rowData, row)
      this.getInfoGM(this.rowData.modificationGroup_id)
      this.dialogFormVisible = !this.dialogFormVisible
    },
    async getInfoGM(id) {
      this.selectedModification = []
      if (id && this.dialogFormMode !== 'copy') {
        const res = await request({
          url: '/modification-groups/' + id,
          method: 'get'
        })
        this.selectedModification = res.modifications
      }
    },
    async deleteRow(index, row) {
      const res = await request({
        url: '/modification-groups/' + row.modificationGroup_id,
        method: 'delete'
      })
      if (res) {
        this.$notify({
          title: 'Успешно!',
          message: 'Данные успешно удалены',
          type: 'success',
          duration: 5000
        })
        this.list.splice(index, 1)
      }
    },
    async saveModalData() {
      if (this.activeRow) {
        const res = await request({
          url: '/modification-groups/' + this.rowData.modificationGroup_id,
          method: 'put',
          data: {
            modificationGroup_name: this.rowData.modificationGroup_name,
            modificationGroup_original_name:
              this.rowData.modificationGroup_original_name,
            modifications: this.selectedModification
          }
        })
        if (res) {
          console.log(res)
          this.$notify({
            title: 'Успешно!',
            message: 'Данные успешно сохранены',
            type: 'success',
            duration: 5000
          })
          Object.assign(this.activeRow, this.rowData)
        }
      } else {
        this.rowData.modifications = this.selectedModification
        const res = await request({
          url: '/modification-groups',
          method: 'post',
          data: this.rowData
        })
        if (res && !res.status) {
          console.log(res)
          this.$notify({
            title: 'Успешно!',
            message: 'Данные успешно добавлены',
            type: 'success',
            duration: 5000
          })
          this.getList()
        } else {
          if (res.data.errors) {
            this.$notify({
              title: 'Ошибка!',
              message: 'Неуникальное наименование',
              type: 'error',
              duration: 5000
            })
          }
        }
      }
      this.dialogFormVisible = false
    }
  }
}
</script>

<style>
.edit-input {
  padding-right: 100px;
}
.table-edit-column {
  margin: 5px;
}

/*модальное окно*/
.app-container .el-dialog {
  margin-top: 3vh !important; /*приподняли*/
}
.app-container .el-dialog__header {
  /*шапка*/
  height: 60px;
  background-color: #cfdbd9;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  text-transform: uppercase;
  color: #003d2d;
}
.el-table .warning-row {
  color: #e57070;
}
.app-container .el-dialog__body {
  height: 600px; /*фиксированная высота*/
}
</style>
