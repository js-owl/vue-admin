<template>
  <div class="editOperation_edit_card sticky_edit">
    <panel-button
      :show-button="showButtons"
      @clickBtnSave="saveOperation"
      @clickBtnСancel="goBack"
    />
    <!-- @clickBtnSaveСontinue="saveForm" -->
    <!-- Для роли переводчика-->
    <el-tabs v-if="role_name == 'translator'" type="border-card">
      <el-tab-pane label="Русский">
        <action-operation />
      </el-tab-pane>
      <el-tab-pane label="English">
        <div class="box">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <p class="title">Редактирование операции загрузки</p>
              </div>
            </template>
            <el-form
              ref="operationEditForm"
              class="box_form"
              :model="formData"
              label-width="280px"
            >
              <el-form-item label="Наименование операции (RU)">
                <el-input
                  v-model="operation_name"
                  type="textarea"
                  autosize
                  disabled
                />
              </el-form-item>
              <el-form-item label="Наименование операции (EN)">
                <el-input
                  v-model="formData.operation_name_en"
                  type="textarea"
                  autosize
                />
              </el-form-item>
              <!-- Дополнительная информация -->
              <el-form-item label="Дополнительная информация (RU)">
                <el-input
                  v-model="formData.operation_description"
                  type="textarea"
                  autosize
                  disabled
                />
              </el-form-item>
              <el-form-item
                label="Дополнительная информация (EN)"
                prop="operation_description_en"
              >
                <el-input
                  v-model="formData.operation_description_en"
                  type="textarea"
                  autosize
                />
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Espanol">
        <div class="box">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <p class="title">Редактирование операции загрузки</p>
              </div>
            </template>
            <el-form
              ref="operationEditFormES"
              class="box_form"
              :model="formData"
              label-width="280px"
            >
              <el-form-item label="Наименование операции (RU)">
                <el-input
                  v-model="operation_name"
                  type="textarea"
                  autosize
                  disabled
                />
              </el-form-item>
              <el-form-item label="Наименование операции (ES)">
                <el-input
                  v-model="formData.operation_name_es"
                  type="textarea"
                  autosize
                />
              </el-form-item>
              <!-- Дополнительная информация -->
              <el-form-item label="Дополнительная информация (RU)">
                <el-input
                  v-model="formData.operation_description"
                  type="textarea"
                  autosize
                  disabled
                />
              </el-form-item>
              <el-form-item
                label="Дополнительная информация (ES)"
                prop="operation_description_en"
              >
                <el-input
                  v-model="formData.operation_description_es"
                  type="textarea"
                  autosize
                />
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- Для остальных ролей -->
    <action-operation
      v-if="role_name !== 'translator'"
      ref="operationEditForm"
      v-model="formData"
    />

    <notify-operation v-model="formData.notification" />
    <tool-operation v-model="formData.tool" />
    <illustrate-operation :operation-id="id" @changeIllustration="changeItem" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import request from '@/utils/request'
// import { html2Text } from '@/utils'
import actionOperation from '@/views/operations/actionOperation'
import notifyOperation from '@/views/operations/notifyOperation'
import toolOperation from '@/views/operations/toolOperation'
import illustrateOperation from '@/views/operations/illustrateOperation'
import PanelButton from '@/components/PanelButton/PanelButton'

export default {
  components: {
    actionOperation,
    notifyOperation,
    toolOperation,
    illustrateOperation,
    PanelButton
  },
  data() {
    return {
      showButtons: [
        { label: 'Сохранить', emit: 'clickBtnSave' },
        { label: 'Отмена', color: 'grey', emit: 'clickBtnСancel' }
      ],
      //       {
      //   label: 'Сохранить и продолжить',
      //   color: 'orange',
      //   emit: 'clickBtnSaveСontinue'
      // },
      id: Number(this.$route.params?.id),
      formData: {
        action_id: '',
        action_name: '',
        action_ext: '',
        operation_description: '',
        operation_torque: '',
        operation_clearances: '',
        operation_time: 0,
        operation_id: '',
        notification: [],
        tool: [],
        operation_image: ''
      },
      isValid: false,
      operation_id: 0,
      isFormSaved: false
    }
  },
  computed: {
    ...mapGetters(['role_name', 'operation_img_store', 'operation_img_json']),
    operation_name() {
      return this.formData.action_name + ' ' + this.formData.action_ext
    }
  },
  mounted() {
    if (this.id) {
      this.getInfo(this.id)
    }
  },
  methods: {
    ...mapActions('operation', ['saveOperationAction']),
    async getInfo(id) {
      this.isLoading = false
      const res = await request({
        url: '/operations/' + id,
        method: 'get'
      })
      if (!res) {
        console.log('GET request error')
      }
    },
    test() {},
    async saveForm() {
      try {
        const formValidate =
          this.$refs['operationEditForm'].$refs.operationEditForm.validate()
        this.isValid = await formValidate
        if (this.isValid) {
          this.formData.operation_image = this.operation_img_store
          this.formData.operation_file = this.operation_img_json
          if (this.formData.operation_id) {
            const res = await request({
              url: '/operations/' + this.formData.operation_id,
              method: 'put',
              data: this.formData
            })
            if (!res) {
              console.log('PUT request error')
            } else {
              this.operation_id = res.operation_id
            }
          } else {
            const res = await request({
              url: '/operations/',
              method: 'post',
              data: this.formData
            })
            if (!res) {
              console.log('POST request error')
            } else {
              this.operation_id = res.operation_id
            }
          }
        } else {
          console.log('operationEditForm not valid')
        }
      } catch (err) {
        console.log(err)
      }
      this.isFormSaved = true
    },
    goBack() {
      const item_id = this.$route.query?.item_id
      if (this.$route.query?.request_id) {
        this.$router.push(`/flowchart/bidedit/${this.$route.query.request_id}`)
      } else if (this.$route.query?.flowchart_id) {
        this.$router.push(
          `/flowchart/edit/${this.$route.query.flowchart_id}?fromEntity=${this.operation_id}&item_id=${item_id}`
        )
      } else if (this.$route.query?.updateflowchart_id) {
        this.$router.push(
          `/flowchart/edit/${this.$route.query.updateflowchart_id}?fromOperation=${this.operation_id}&item_id=${item_id}`
        )
      } else if (this.$route.query?.createflowchart_id) {
        if (this.isFormSaved) {
          this.$router.push(
            `/flowchart/edit/${this.$route.query.createflowchart_id}?createOperation=${this.operation_id}`
          )
        } else {
          // Нажали кнопку Отмена
          this.$router.push(
            `/flowchart/edit/${this.$route.query.createflowchart_id}?createOperation=cancel`
          )
        }
      } else {
        this.$router.push(`/operations/`)
      }
    },
    async saveOperation() {
      await this.saveForm()
      if (this.isValid) this.goBack()
    },
    changeItem() {
      this.saveOperationAction(this.formData)
    }
  }
}
</script>
<style scoped></style>
