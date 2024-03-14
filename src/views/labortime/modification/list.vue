<template>
  <div class="app-container">
    <div class="platform-dropdown-button">
      <PlatformDropdown v-model="platforms" />
      <!--<el-checkbox v-model="showOnlyEmptyCode" class="filter-item" style="margin-left:15px;" @change="getList()">Отображать только неопределенные модификации</el-checkbox><el-checkbox v-model="showOnlyNotChecked" class="filter-item" style="margin-left:15px;" @change="getList()">Отображать только непроверенные</el-checkbox>-->
      <el-button size="small" icon="el-icon-refresh" type="primary">
        Проверено
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column width="36">
        <template #header>
          <el-checkbox
            v-model="checkAllStatus"
            :indeterminate="isIndeterminate"
            @change="checkAll"
          />
        </template>
        <template #default="scope">
          <!--el-checkbox v-model="scope.row.check" @change="chkMod(scope.row.productModificationLT_id)"/-->
          <el-checkbox v-model="scope.row.check" />
        </template>
      </el-table-column>
      <el-table-column label="Модель" width="100">
        <template #default="scope">
          {{ scope.row.model }}
        </template>
      </el-table-column>
      <el-table-column label="ГМ в INCADEA" width="210">
        <template #default="scope">
          {{ scope.row.modificationGroup_name }}
        </template>
      </el-table-column>
      <el-table-column label="Наименование модификации">
        <template #default="scope">
          {{ scope.row.productModificationLT_name }}
        </template>
      </el-table-column>
      <el-table-column label="Наименование 15 символов">
        <!-- width="300"-->
        <template #default="scope">
          <template v-if="scope.row.edit">
            <el-input
              v-model="scope.row.productModificationLT_code"
              class="edit-input edit-input-name"
              size="small"
              @keyup.13.native="confirmEdit(scope.row)"
            />
            <el-button
              size="small"
              icon="el-icon-refresh-left"
              type="warning"
              @click="cancelEdit(scope.row)"
            />
          </template>
          <template v-else>
            {{ scope.row.productModificationLT_code }}
          </template>
        </template>
      </el-table-column>
      <el-table-column
        align="right"
        width="90"
        class-name="small-padding fixed-width button-tooltip"
      >
        <template #default="scope">
          <el-button
            v-if="scope.row.edit"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(scope.row)"
          >
            Ok
          </el-button>
          <el-tooltip
            v-else
            class="box-item"
            effect="light"
            placement="top-start"
            content="Редактировать"
            popper-class="uaz__tooltip uaz__tooltip-left"
          >
            <el-button
              size="mini"
              class="el-button-icon"
              @click="scope.row.edit = !scope.row.edit"
            >
              <i class="el-icon-edit" />
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
import { PlatformDropdown } from './Dropdown'
import request from '@/utils/request'
export default {
  name: 'ModificationList',
  components: { Pagination, PlatformDropdown },
  data() {
    return {
      list: null,
      total: 0,
      storage: process.env.VUE_APP_BACKEND_HOST + '/storage/',
      listLoading: true, //
      listQuery: {
        page: 1,
        limit: 20
      },
      showOnlyEmptyC: false,
      showOnlyNotCD: false,
      showOnlyNotLinked: true,
      dialogFormVisible: false,
      checkAllStatus: false,
      checkedMods: [],
      isIndeterminate: false,
      rowData: {
        modificationIncadeaCode: '',
        model: '',
        productModificationLT_name: '',
        productModificationLT_code: '',
        modificationGroup_name: ''
      },
      activeRow: null,
      platforms: ['showOnlyEmptyC', 'showOnlyNotCD', 'showOnlyNotLinked']
    }
  },
  watch: {
    platforms(val) {
      this.getList(val)
    }
  },
  created() {
    this.getList()
  },
  methods: {
    dd(data) {
      console.log(data)
    },
    checkAll(val) {
      this.this.list = this.list.map((v) => {
        v.check = val
        return v
      })
      if (val) {
        this.checkAllStatus = true
      } else {
        this.checkAllStatus = false
      }
      this.isIndeterminate = true
    },
    cancelEdit(row) {
      row.title = row.originalTitle
      row.edit = false
      this.$message({
        message: 'Значение восстановлено на оригинальное значение',
        // message: 'The title has been restored to the original value',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      if (
        !row.productModificationLT_code ||
        row.productModificationLT_code.length !== 15
      ) {
        this.$message({
          message: 'Наименование модификации должно состоять из 15 цифр',
          type: 'error'
        })
        return
      }
      if (this.updateData(row)) {
        row.edit = false
        row.originalproductModificationLT_code = row.productModificationLT_code
      }
    },
    async getList(val) {
      this.listLoading = true
      let showOnlyEmptyCode
      let showOnlyNotChecked
      let notLinked
      if (val) {
        showOnlyEmptyCode = val.indexOf('showOnlyEmptyCode') !== -1
        showOnlyNotChecked = val.indexOf('showOnlyNotChecked') !== -1
        notLinked = val.indexOf('showOnlyNotLinked') !== -1
      } else {
        showOnlyEmptyCode = false
        showOnlyNotChecked = false
        notLinked = true
      }
      const res = await request({
        url: '/productmodificationLT',
        method: 'get',
        params: {
          page: this.listQuery.page,
          isIgnore: false,
          showOnlyEmptyCode: showOnlyEmptyCode,
          showOnlyNotChecked: showOnlyNotChecked,
          showOnlyNotLinked: notLinked
        }
      })
      const items = res.data
      this.list = items.map((v) => {
        this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        v.originalproductModificationLT_code = v.productModificationLT_code //  will be used when user click the cancel botton
        return v
      })
      this.total = res.total
      this.listQuery.page = res.current_page
      this.listQuery.limit = res.per_page
      this.listLoading = false
    },

    async deleteRow(index, row) {
      const res = await request({
        url: '/productmodificationLT/' + row.productModificationLT_id,
        method: 'put',
        data: {
          isShow: false
        }
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
    async updateData(row) {
      const res = await request({
        url: '/productmodificationLT/' + row.productModificationLT_id,
        method: 'put',
        data: {
          check: true,
          productModificationLT_code: row.productModificationLT_code
        }
      })
      if (res) {
        this.$message({
          message: 'Наименование изменено',
          type: 'success'
        })
        return true
      } else {
        return false
      }
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
.app-container .el-dialog__body {
  height: 600px; /*фиксированная высота*/
}
.el-table__header,
.el-table__body {
  width: 100% !important; /*Модификация-100% таблица*/
}
/*Селект Фильтр и кнопка Проверено - справа*/
.platform-dropdown-button {
  /*max-width: 1280px;
  text-align: right;*/
  float: right;
  display: flex;
  margin-bottom: 5px;
}
</style>
