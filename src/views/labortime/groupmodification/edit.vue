<template>
  <div class="app-container container_fixed_next">
    <el-page-header class="fixed_next" :content="modificationGroupsInfo.modificationGroup_name" title="Назад" @back="$router.go(-1)" />
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column width="75px" align="center" label="Код НЧ">
        <template slot-scope="{row}">
          <span>{{ row.laborTime_code7num }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="Наименование">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.laborTime_name" class="edit-input edit-input-name" size="small" @keyup.13.native="confirmEdit(row)" />
            <el-button class="cancel-btn" size="small" icon="el-icon-refresh-left" type="warning" @click="cancelEdit(row)" />
          </template>
          <span v-else>{{ row.laborTime_name }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" label="Структура">
        <template slot-scope="">
          <span />
        </template>
      </el-table-column>

      <el-table-column class-name="labortime_center" width="100px" label="Значение">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.laborTime_time" class="edit-input edit-input-name" size="small" @keyup.13.native="confirmEdit(row)" />
            <el-button class="cancel-btn" size="small" icon="el-icon-refresh-left" type="warning" @click="cancelEdit(row)" />
          </template>
          <span v-else>{{ row.laborTime_time }}</span>
        </template>
      </el-table-column>

      <!--el-table-column width="190px" align="center" label="Последнее изменение">
        <template slot-scope="{row}">
          <span>{{ row.deleted_at | parseTime('{d}.{m}.{y} {h}:{i}') }}</span>
        </template>
      </el-table-column-->

      <el-table-column align="center" label="" width="110" class-name="small-padding fixed-width">
        <template #header>
          <el-button size="mini" type="primary" @click="createRow">Добавить</el-button>
        </template>
        <template slot-scope="{row}">
          <el-button v-if="row.edit" type="success" size="small" icon="el-icon-circle-check-outline" @click="confirmEdit(row)">Ok</el-button>
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
              @click="row.edit=!row.edit"
            >
              <i class="el-icon-edit" />
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <dialog-f
      :show-dialog.sync="dialogFormVisible"
      width="70%"
      title="Добавление нового норматива времени"
      @closeDialog="dialogFormVisible=false"
      @saveData="saveModalData()"
    >
      <el-form
        ref="laborTimeCreateForm"
        v-loading="loadingLT"
        :rules="rules"
        :model="rowData"
      >
        <el-form-item label="Код норматива времени (7 символов)" prop="laborTime_code7num">
          <el-input v-model="rowData.laborTime_code7num" autocomplete="off" @input="changeLaborTimeCode" />
        </el-form-item>
        <span v-if="rowData.laborTime_code7num.length === 7">
          <el-form-item label="Наименование норматива" prop="laborTime_name">
            <el-input v-model="rowData.laborTime_name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="Значение" prop="laborTime_time">
            <el-input v-model="rowData.laborTime_time" autocomplete="off" />
          </el-form-item>
        </span>

      </el-form>
    </dialog-f>
  </div>
</template>

<script>
import request from '@/utils/request'
import DialogF from '@/components/Dialog/DialogF'

export default {
  name: 'GroupModificationLaborTimeEdit',
  components: { DialogF },
  data() {
    return {
      modificationGroupsInfo: {},
      list: null,
      listLoading: true,
      dialogFormVisible: false,
      loadingLT: false,
      rules: {
        laborTime_code7num: [
          { required: true, message: 'Заполните поле', trigger: 'blur' },
          { min: 7, max: 7, message: 'Код норматива времени должен состоять из 7 символов', trigger: 'blur' }
        ],
        laborTime_name: [
          { required: true, message: 'Заполните поле', trigger: 'blur' }
        ],
        laborTime_time: [
          { required: true, message: 'Заполните поле', trigger: 'blur' },
          { pattern: /(^[0-9.]+$)/, message: 'Заполните поле', trigger: 'blur' }
        ]
      },
      rowData: {
        laborTime_code7num: '',
        laborTime_name: '',
        laborTime_time: 0
      },
      listQuery: {
        page: 1,
        limit: 10000
      }
    }
  },
  created() {
    this.getInfo()
    this.getList()
  },
  methods: {
    async changeLaborTimeCode() {
      console.log(1)
      if (this.rowData.laborTime_code7num && this.rowData.laborTime_code7num.length === 7) {
        this.loadingLT = true
        const res = await request({
          url: '/labor_times/getByCode/' + this.rowData.laborTime_code7num,
          method: 'get'
        })
        if (res.data) {
          this.rowData.laborTime_name = res.data.laborTime_name
        }
        this.loadingLT = false
      } else {
        this.rowData.laborTime_name = ''
        this.rowData.laborTime_time = 0
      }
    },
    saveModalData() {
      this.$refs['laborTimeCreateForm'].validate(async valid => {
        if (valid) {
          console.log(this.modificationGroupsInfo.modificationGroup_id)
          const res = await request({
            url: '/labor_times',
            method: 'post',
            data: {
              ...this.rowData,
              modificationGroup_id: this.modificationGroupsInfo.modificationGroup_id
            }
          })
          if (res) {
            this.$notify({
              title: 'Успешно!',
              message: 'Данные успешно добавлены',
              type: 'success',
              duration: 5000
            })
            this.getList()
          }

          this.dialogFormVisible = false
        }
      })
    },
    async getList() {
      this.listLoading = true
      const res = await request({
        url: '/labor_times',
        method: 'get',
        params: {
          page: this.listQuery.page,
          modificationGroup_id: this.$route.params.id,
          limit: this.listQuery.limit
        }
      })
      const items = res.data
      this.list = items.map(v => {
        this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        v.originallaborTime_name = v.laborTime_name //  will be used when user click the cancel botton
        v.originallaborTime_time = v.laborTime_time
        v.laborTime_code7num = v.laborTime_code.substr(0, 2) + v.laborTime_norm + v.laborTime_code.substr(2, 3)
        return v
      })
      this.total = res.total
      this.listQuery.page = res.from
      this.listQuery.limit = res.per_page
      this.listLoading = false
    },
    async getInfo() {
      const res = await request({
        url: '/modification-groups/' + this.$route.params.id,
        method: 'get'
      })
      this.modificationGroupsInfo = res
    },
    cancelEdit(row) {
      row.laborTime_name = row.originallaborTime_name //  will be used when user click the cancel botton
      row.laborTime_time = row.originallaborTime_time
      row.edit = false
      this.$message({
        message: 'Значение восстановлено на оригинальное значение',
        // message: 'The title has been restored to the original value',
        type: 'warning'
      })
    },
    async confirmEdit(row) {
      row.edit = false
      const res = await request({
        url: '/labor_times/' + row.laborTime_id,
        method: 'put',
        data: {
          laborTime_name: row.laborTime_name,
          laborTime_time: row.laborTime_time
        }
      })
      if (res) {
        row.originallaborTime_name = row.laborTime_name
        row.originallaborTime_time = row.laborTime_time
        this.$notify({
          title: 'Успешно!',
          message: 'Данные успешно сохранены',
          type: 'success',
          duration: 5000
        })
      } else {
        row.laborTime_name = row.originallaborTime_name
        row.laborTime_time = row.originallaborTime_time
      }
    },
    createRow() {
      this.dialogFormVisible = true
    }
  }
}
</script>

<style>
</style>
