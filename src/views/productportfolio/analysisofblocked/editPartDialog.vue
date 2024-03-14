<template>
  <div>
    <dialog-f
      title="Информация о детали"
      :show-dialog="open"
      width="50%"
      @update:showDialog="closeDialog"
      @closeDialog="closeDialog"
      @saveData="saveModalData()"
    >
      <div v-loading="submitLoading">
        <el-row class="elis-row">
          <label style="padding: 0 12px 0 0">Код детали: </label
          >{{ value.part_code }}
        </el-row>
        <el-row class="elis-row">
          <label style="padding: 0 12px 0 0"> Наименование детали: </label
          >{{ value.part_name }}
        </el-row>
        <div v-loading="listLoading">
          <el-table
            ref="partTable"
            class="elis-row"
            :data="imgList"
            border
            fit
            highlight-current-row
            style="width: 100%"
            row-key="partGroup_id"
          >
            <el-table-column prop="notification_text" label="Номер" width="150">
              <template #default="scope">
                {{ scope.row.partGroup_code }}
              </template>
            </el-table-column>
            <el-table-column label="Наименование иллюстрации">
              <template #default="scope">
                {{ scope.row.partGroup_name }}
              </template>
            </el-table-column>
            <el-table-column prop="notification_text" label="Позиция">
              <template #default="scope">
                {{ scope.row.position }}
              </template>
            </el-table-column>
          </el-table>

          <el-form ref="refFormStatus" :model="formData" :rules="rules">
            <el-form-item
              label="Статус: "
              prop="status"
              class="elis-row elis-row-select"
            >
              <el-select
                v-model="formData.status"
                default-first-option
                style="width: 240px"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="Комментарий: " prop="comment" class="elis-row">
              <el-input
                v-model="formData.comment"
                type="textarea"
                :rows="6"
                :maxlength="250"
                :show-word-limit="true"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </dialog-f>
  </div>
</template>

<script>
import request from '@/utils/request'
import DialogF from '@/components/Dialog/DialogF'

export default {
  name: 'AnalysisOfBlockecPart',
  components: { DialogF },
  props: {
    value: {
      type: Object,
      default: null
    },
    open: { type: Boolean, default: false }
  },
  emits: ['update:open', 'update:data', 'saveData', 'update:status'],
  data() {
    var validateStatus = (rull, value, callback) => {
      if (value === null || value === 'null') {
        if (this.currentStatus === null || this.currentStatus === 'null') {
          return callback(new Error('Необхомо изменить статус'))
        }
      }
      return callback()
    }
    return {
      dialogFormVisible: false,
      formData: {
        status: 'null',
        comment: ''
      },
      rules: {
        status: [
          {
            validator: validateStatus,
            message: 'Необхомо изменить статус',
            trigger: 'change'
          },
          {
            required: true,
            message: 'Необхомо изменить статус',
            trigger: 'change'
          }
        ],
        comment: [
          { required: true, message: 'Заполните поле', trigger: 'blur' }
        ]
      },
      options: [
        {
          value: 'null',
          label: 'К исполнению'
        },
        {
          value: 'wait',
          label: 'Ожидает добавления в прайс'
        },
        {
          value: 'executed',
          label: 'Обработано'
        },
        {
          value: 'declined',
          label: 'Отклонено'
        }
      ],
      imgList: [],
      currentStatus: 'null',
      currentComment: '',
      listLoading: false,
      submitLoading: false
    }
  },
  mounted() {
    if (this.value.part_id !== undefined) {
      this.getInfo()
    }
  },
  methods: {
    async getInfo() {
      this.listLoading = true
      const params = {}
      const res = await request({
        url: '/partanalysisblocked/getInfoOfPartID/' + this.value.part_id,
        method: 'get',
        params
      })
      this.formData.status = res.status || 'null'
      this.formData.comment = res.comment
      this.currentStatus = res.status
      this.currentComment = res.comment
      this.imgList = res.ill
      this.listLoading = false
    },
    saveModalData() {
      if (
        this.currentStatus !== this.formData.status ||
        this.currentComment !== this.formData.comment
      ) {
        this.$refs['refFormStatus'].validate(async (valid) => {
          this.submitLoading = true
          if (valid) {
            const params = {
              status: this.formData.status,
              comment: this.formData.comment,
              part_id: this.value.part_id
            }
            const res = await request({
              url: '/partanalysisblocked/' + this.value.part_id,
              method: 'put',
              params
            })
            if (res) {
              this.$notify({
                title: 'Успешно!',
                message: 'Данные успешно сохранены',
                type: 'success',
                duration: 5000
              })
              this.$emit('saveData', 'update')
              this.$emit('update:data', this.data)
              this.$emit('update:status', this.formData.status)
              this.$emit('update:open', false)
            }

            // this.closeDialog()
          }

          console.log('error submit!!')
          this.submitLoading = false
        })
      } else {
        this.$notify({
          type: 'warning',
          title: 'Нет данных для сохранения'
        })
      }
    },
    closeDialog() {
      this.$emit('update:open', false)
    }
  }
}
</script>

<style>
.elis-row {
  margin-bottom: 10px;
}

.elis-row-select {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.text-bold {
  font-weight: 700;
}
</style>
