<template>
  <div class="custom-tree-container" style="margin:10px;">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <div>
            <p>ДЕРЕВО</p>
            <div class="card-header-checkbox"><el-checkbox v-model="disabled" /> Возможность переноса</div><!--:disabled="disabled"  - активен/не активен -->
          </div>
          <div>
            <el-button class="button" text>Загрузить списком</el-button>
            <div><a>Выбрать модификации</a></div>
          </div>
        </div>
      </template>

      <div class="card-left">
        <el-tree
          :data="list"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          draggable
          @node-drop="handleDrop"
        >
          <!--@node-drag-start="handleDragStart"
      @node-drag-enter="handleDragEnter"
      @node-drag-leave="handleDragLeave"
      @node-drag-over="handleDragOver"
      @node-drag-end="handleDragEnd"
      @node-drop="handleDrop"
      v-if="allowDropDrag"-->
          <template #default="{ node, data }">
            <span class="custom-tree-node" :class="{ 'move': node.level == '4' }">
              <span>
                <a v-if="node.level == '3'" class="prefix" :class="{ 'is-leaf': node.level == '4' }" @click="createRow(data)"> <i class="el-icon-plus" /> </a><!--Добавить-->
                <a v-if="node.level == '4'" class="prefix" :class="{ 'is-leaf': node.isLeaf }" @click="remove(node, data)"> <i class="el-icon-delete" /> </a><!--Удалить-->
                <a v-if="node.level == '4'" class="prefix" :class="{ 'is-leaf': node.isLeaf }" @click="showModalEditElement(node, data)"> <i class="el-icon-edit" /> </a><!--Редактировать-->
              </span>
              <span>{{ data.partGroup_name }}</span><!--{{ node.label }}-->
            </span>
          </template>
        </el-tree>
      </div>
      <div class="card-right">
        <span v-if="tableData.length-1>0" class="pull-right">количество: {{ tableData.length }}</span>
        <template>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column fixed prop="date" label="Код" />
            <el-table-column prop="name" label="Название" />
            <el-table-column fixed="right" label="" width="120">
              <template #default>
                <el-button link type="primary" size="small">Перенести</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
    </el-card>
    <el-card class="box-card">
      <div>
        111111
      </div>
    </el-card>
    <!-- <el-card class="box-card">
        <el-form>
          <el-row :gutter="20">
            <el-col :span="24">
            <el-form-item label="Название">
              <el-input
                v-model="rowData.nameIncadea"
                autocomplete="off"/>
            </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="Английский вариант">
              <el-input
                v-model="rowData.englishVariant"
                autocomplete="off"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="Иллюстрации">
              <el-input
                v-model="rowData.label"
                autocomplete="off"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" width="150px">
            <el-col :span="24">
              <select-incadea-modification v-if="dialogFormVisible" :selected-modification.sync="selectedModification" />
            </el-col>
          </el-row>
        </el-form>
   </el-card>-->

    ====={{ activeRow }}====
    <div class="app-container">
      <dialog-f
        :show-dialog.sync="dialogFormVisible"
        width="70%"
        title="Создание иллюстрации"
        @closeDialog="dialogFormVisible=false"
        @saveData="saveModalData()"
      >
        <el-form>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="Название в Incadea">
                <el-input
                  v-model="rowData.nameIncadea"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="Английский вариант">
                <el-input
                  v-model="rowData.englishVariant"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="Номер иллюстрации">
                <el-input
                  v-model="rowData.label"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-checkbox class="dialog-checkbox" label="Отображать в дилерской" name="type" />
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="Поиск">
                <el-input
                  v-model="rowData.search"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" width="150px">
            <el-col :span="24">
              <select-incadea-modification v-if="dialogFormVisible" :selected-modification.sync="selectedModification" />
            </el-col>
          </el-row>
        </el-form>
      </dialog-f>
    </div>
  </div>

</template>

<script>
// import type { DragEvents } from 'element-plus/es/components/tree/src/model/useDragNode'
// import type { DropType } from 'element-plus/es/components/tree/src/tree.type'
import request from '@/utils/request'
import DialogF from '@/components/Dialog/DialogF'
import SelectIncadeaModification from '@/components/Modification/SelectIncadeaModification'
export default {
  name: 'Flowchartsstructure',
  components: { DialogF, SelectIncadeaModification },
  props: {
    tree: {
      type: Object,
      default: () => {
        return {
          id: String,
          label: String,
          children: []
        }
      }
    }
  },
  data() {
    const selectedModification = []
    return {
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
        nameIncadea: '',
        englishVariant: '',
        label: '',
        search: ''
      },
      activeRow: null,
      tempData: {},
      // tree: [],
      disabled: false,
      dataSource: [
        { id: 1, label: '01- Детали двигателя', children: [{ id: 150, label: '01-01- Детали двигателя', children: [{ id: 11111, label: '01-01-005- Блок цилиндров в сборе', children: [{ id: 111401, label: '101 - Блок цилиндров двигателя' }, { id: 111302, label: '103 - Блок цилиндров двигателя' }, { id: 111203, label: '201 - Блок цилиндров двигателя' }, { id: 111904, label: '202 - Блок цилиндров двигателя' }, { id: 113805, label: '501 - Блок цилиндров двигателя' }] }, { id: 11112, label: '01-01-010- ГБЦ в сборе', children: [{ id: 111111, label: '101 - Головка блока цилиндров двигателя' }, { id: 111112, label: '102 - Головка блока цилиндров двигателя' }, { id: 111113, label: '201 - Головка блока цилиндров двигателя' }, { id: 111114, label: '202 - Головка блока цилиндров двигателя' }, { id: 111115, label: '501 - Головка блока цилиндров двигателя' }] }] }, { id: 111, label: '01-02- Система питания', children: [{ id: 11121, label: 'Средний 3(9)' }, { id: 11122, label: 'Средний 3(10)', children: [{ id: 111121, label: 'Последний 4(11)' }, { id: 13422, label: 'Последний 4(12)' }] }, { id: 11522, label: 'Средний 3(10)', children: [{ id: 111121, label: 'Последний 4(11)' }, { id: 116122, label: 'Последний 4(12)' }] }] }, { id: 180, label: '01-03- Система выхлопная', children: [{ id: 11111, label: 'Средний 3(9)' }, { id: 11112, label: 'Средний 3(10)', children: [{ id: 111111, label: 'Последний 4(11)' }, { id: 111112, label: 'Последний 4(12)' }] }] }, { id: 172, label: '01-04- Компоненты двигателя электрические', children: [{ id: 11111, label: 'Средний 3(9)' }, { id: 11112, label: 'Средний 3(10)', children: [{ id: 111111, label: 'Последний 4(11)' }, { id: 111112, label: 'Последний 4(12)' }] }] }, { id: 160, label: '01-05- Турбина', children: [{ id: 11111, label: 'Средний 3(9)' }, { id: 11112, label: 'Средний 3(10)', children: [{ id: 111111, label: 'Последний 4(11)' }, { id: 111112, label: 'Последний 4(12)' }] }] }, { id: 170, label: '01-06- Двигатели', children: [{ id: 11111, label: 'Средний 3(9)' }, { id: 11112, label: 'Средний 3(10)', children: [{ id: 111111, label: 'Последний 4(11)' }, { id: 111112, label: 'Последний 4(12)' }] }] }, { id: 182, label: '01-07- Оборудование газобалонное', children: [{ id: 11111, label: 'Средний 3(9)' }, { id: 11112, label: 'Средний 3(10)', children: [{ id: 111111, label: 'Последний 4(11)' }, { id: 111112, label: 'Последний 4(12)' }] }] }] },
        { id: 2, label: '02- Система отопления, вентиляции и кондиционирования кузова' },
        { id: 3, label: '03- Трансмиссия' },
        { id: 4, label: '04- Система подвески и рулевое управление' },
        { id: 5, label: '05- Интерьер и Экстерьер' },
        { id: 6, label: '06- Тормозная система' },
        { id: 7, label: '07- Масла и автохимия' },
        { id: 8, label: '08- Кузов' },
        { id: 9, label: '09- Электрика и освещение' },
        { id: 10, label: '010- Автохимия' },
        { id: 11, label: '010- Аксессуары' },
        { id: 12, label: '011- Расходные материалы' },
        { id: 13, label: '012- Специнструмент' },
        { id: 14, label: '013- Полиграфия' },
        { id: 15, label: '020- Система охлаждения и отопления' }
      ],
      tableData: [
        { date: '000000035305229', name: 'ПРОБКА К1/4"' },
        { date: '000000087088400', name: 'Пробка КГ 1/8"' },
        { date: '000000087440229', name: 'ВИНТ' },
        { date: '000000473402500', name: 'ПОКРЫТИЕ АНТИКОРРОЗИОННОЕ ПРИМБОДИ 1Л' },
        { date: '000459318013200', name: 'Болт М12X1,25-6gX70 ОСТ 37.001.101-93' },
        { date: '000459376110600', name: 'Болт М6-6gX25' }
      ]
      // groups: [],
    }
  },
  created() {
    this.getNode()
  },
  /* mounted() {
    this.getGroups();
  },*/
  methods: {
    /* getGroups: function () {
      Request.get("partgroup/index/?productModification_id=")
        .then((response) => {
          this.groups = response.data.data
        })
        .catch(function (error) {})
    },*/
    append(data) {
      let id = 1000
      const newChild = { id: id++, label: this.activeRow.label + '-' + this.activeRow.nameIncadea, nameIncadea: this.activeRow.nameIncadea, englishVariant: this.activeRow.englishVariant, idLabel: this.activeRow.label, children: [] }
      if (!data.children) {
        data.children = []
      }
      data.children.push(newChild)
      // this.dataSource.value = [...this.dataSource.value]
    },
    remove(node, data) {
      // const id = 1000;
      console.log(node, '111111111111')
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex((d) => d.id === data.id)
      children.splice(index, 1)
      this.dataSource.value = [...this.dataSource.value]
    },

    dd(data) {
      console.log(data)
    },
    async getNode() {
      const res = await request({
        url: 'partgroup/index/',
        method: 'get',
        params: {
          // page: this.listQuery.page,
          // sortByOriginalName: 'ASC'
        }
      })
      const res2 = await request({
        url: 'partgroup/illustration/',
        method: 'get',
        params: {
          productModification_id: 16
        }
      })
      this.list = res.data
      this.list2 = res2.data
      // this.total = res.total
      // this.listQuery.page = res.current_page
      // this.listQuery.limit = res.per_page
      // this.listLoading = false
      console.log(res, '000')
      console.log(res2, '111')
    },
    createRow(data) {
      this.rowData = {
        nameIncadea: '',
        englishVariant: '',
        label: ''
      }
      this.showModalEditElement(data, this.rowData)
    },
    showModalEditElement(data, row, FormMode = 'update') {
      this.dialogFormMode = FormMode
      this.activeRow = row
      Object.assign(this.rowData, row)
      this.getInfoGM(this.rowData.modificationGroup_id)
      this.dialogFormVisible = !this.dialogFormVisible
      this.tempData = data
      this.rowData = this.activeRow
      this.rowData = {
        nameIncadea: this.activeRow.label.split('-')[1],
        englishVariant: this.activeRow.englishVariant,
        label: this.activeRow.label.split('-')[0]
      }
      console.log(this.data, '-0000data')
      console.log(this.activeRow.label.split('-'), '77777777')
      console.log(this.activeRow, '1234567')
      console.log(this.rowData, '9999999')
    },
    async getInfoGM(id) {
      this.selectedModification = []
      if (id && this.dialogFormMode !== 'copy') {
        const res = await request({
          url: 'partgroup/index/' + id,
          method: 'get'
        })
        this.selectedModification = res.modifications
      }
    },
    async saveModalData() {
      if (this.activeRow) {
        this.$notify({
          title: 'Успешно!',
          message: 'Данные успешно сохранены',
          type: 'success',
          duration: 5000
        })
        Object.assign(this.activeRow, this.rowData)
        this.append(this.tempData)
      } else {
        this.rowData.modifications = this.selectedModification
        this.$notify({
          title: 'Успешно!',
          message: 'Данные успешно добавлены',
          type: 'success',
          duration: 5000
        })
        this.getNode()
      }
      this.dialogFormVisible = false
    },
    allowDrop(draggingNode, dropNode, type) { // 3 уровень
      // console.log(draggingNode,'555555')
      // console.log(dropNode,'655656565')
      // console.log(type,'0-type')

      /* if(dropNode.level == '4'){// && this.disabled == true
		return true
	  } else {
		return false
	  }
	  if(this.disabled == true){
		return true
	  } else {
		return false
	  } */
      /*
	  if(type == 'prev'){
		  return false
	  } else {
		return true
	  }
	  if(type == 'inner'){
		  return false
	  } else {
		return true
	  }
	  if(type == 'next'){
		  return false
	  } else {
		return true
	  }*/
      // prev, inner, next
      if (dropNode.level === '4') {
        return type === 'prev'
      } else {
        return false
      }

      /* if (dropNode.data.label === '01-01-005- Блок цилиндров в сборе') {
		return type !== 'inner'
	  } else {
		return true
	  }*/
    },
    allowDrag(draggingNode) {
      if (draggingNode.level === '4') { // 4 уровень
        return true
      } else {
        return false
      }
      // return !draggingNode.data.label.includes('101 - Блок цилиндров двигателя')
    },
    /* handleDragStart (node, ev) {},
	handleDragEnter (draggingNode, dropNode, ev) {},
	handleDragLeave (draggingNode, dropNode, ev) {},
	handleDragOver (draggingNode, dropNode, ev) {},
	handleDragEnd (draggingNode, dropNode, dropType, ev) {},
	handleDrop (draggingNode, dropNode, dropType, ev) {},
	*/
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log(draggingNode, 'draggingNode11111111111111111')
      console.log(dropNode, 'dropNode11111111111111111')
      console.log(dropType, 'dropType11111111111111111')
      console.log(ev, 'ev11111111111111111')
      if (dropType === 'before') {
        this.$notify({
          title: 'Успешно!',
          message: 'Данные успешно сохранены',
          type: 'success',
          duration: 5000
        })
      } else {
        this.$notify({
          title: 'Ошибка!',
          message: 'Иллюстрации должны быть на 4 уровне вложенности',
          type: 'danger',
          duration: 5000
        })
      }
    }
  }
}
</script>
<style>
.prefix {
  color: #003d2d;
  margin-right: 10px;
}
.prefix.is-leaf {
  color: #7ea09a;
}
.prefix .el-icon-plus {
  font-weight: bold;
  font-size: 16px;
}

.edit-input {
  padding-right: 100px;
}
.table-edit-column {
  margin: 5px;
}

/*модальное окно*/
.app-container .el-dialog {
  margin-top: 3vh!important;/*приподняли*/
}
.app-container .el-dialog__header {/*шапка*/
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
  height: 600px;/*фиксированная высота*/
}

.el-form-item__label{
  margin-bottom: 0;
  /* width: 25%; */
}
.card-left, .card-right {
  width: 50%;
}
.card-left {
  float: left;
}
.card-right {
  float: right;
}
.col-sm-3 {
  width: 33,33%;
}
.move {
  cursor: move;
  color: red;
}
.sortable-ghost{
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
}
.el-card {
  margin: 10px 0;
}
.el-card__header {
  height: 80px;
  background-color: #cfdbd9;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}
.el-card__header p {
  text-transform: uppercase;
  color: #003d2d;
  text-transform: uppercase;
  margin-top: -8px;
  margin-bottom: 5px;
  font-size: 25px;
  font-weight: 300;
  text-shadow: 0 1px 1px rgb(0 0 0 / 20%);
}
.card-header-checkbox {
  color: #003d2d;
  font-size: 14px;
  font-family: "Consolas", "Microsoft YaHei", Arial, arial, sans-serif;
  max-width: 100%;
  margin-bottom: 5px;
  font-weight: 600;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-header button {
  background-color: #efb861;
  border: none;
  /*text-transform: uppercase;*/
  margin-right: 8px;
  box-shadow: none;
  color: #fff;
}
.card-header button:focus, .card-header button:active, .card-header button:hover {
  outline-offset: -2px;
  border: none;
  color: #fff;
  background-color: #e08e0b;
}
.card-header button:active {
  -webkit-box-shadow: inset 0 3px 5px rgb(0 0 0 / 13%);
  -moz-box-shadow: inset 0 3px 5px rgba(0,0,0,0.125);
  box-shadow: inset 0 3px 5px rgb(0 0 0 / 13%);
}
.pull-right {
  float: right;
}
.dialog-checkbox {
  margin-left: 25%;
  margin-bottom: 16px;
}
.dialog-checkbox .el-checkbox__label:hover {
  opacity: inherit;
}
</style>
