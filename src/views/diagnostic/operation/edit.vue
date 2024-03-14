<template>
  <div class="app-container">
    <el-row>
      <div class="editOperation_edit_card">
        <div class="box" style="margin-bottom: 20px">
          <el-card class="box-card" style="margin-bottom: 20px">
            <template #header>
              <div class="card-header">
                <p class="title">Редактирование операции</p>
              </div>
            </template>
            <el-form
              ref="dealerEditForm"
              class="box_form"
              :model="diagnosticFormData"
              label-width="250px"
            >
              <el-form-item label="Опишите действие" prop="name">
                <el-input
                  v-model="diagnosticFormData.name"
                  placeholder="Проверить статус кода"
                  type="textarea"
                />
              </el-form-item>
              <el-form-item
                label="Описание"
                prop="description"
                class="display_grid"
              >
                <ckeditor
                  ref="ckeditorRef"
                  v-model="diagnosticFormData.description"
                  :editor="editor"
                  :config="editorConfig"
                />
              </el-form-item>
              <el-form-item label="Введите вопрос" prop="question">
                <el-input
                  v-model="diagnosticFormData.question"
                  placeholder="Код активен в данный момент?"
                  type="textarea"
                />
              </el-form-item>
              <!-- Тип ответа на вопрос -->
              <el-form-item
                label="Тип ответа на вопрос"
                prop="answer_type"
                class="recipient"
              >
                <el-select
                  v-model="diagnosticFormData.answer_type"
                  class="select"
                  clearable
                  placeholder="Выберите тип"
                  style="width: 30%"
                >
                  <el-option
                    v-for="item in answer_type"
                    :key="item.type_id"
                    :label="item.type_description"
                    :value="item.type_id"
                  />
                </el-select>
              </el-form-item>
              <!-- Структура -->
              <!-- <el-form-item
                label="Структура"
                prop="structure"
                class="recipient"
              >
                <b>{{ checkedStructure }}</b>
                <el-tree
                  :data="structure"
                  :props="defaultProps"
                  @node-click="treeModelsNodeClick"
                />
              </el-form-item>-->
              <el-row class="recipient">
                <el-col :span="24">
                  <label class="flowchart_structure">Структура</label>
                  <label v-show="checkedStructure">
                    Группа: {{ checkedStructure }}
                  </label>
                  <flowchart-structure
                    v-model="checkedStructure"
                    style="margin-left: 250px"
                  />
                </el-col>
              </el-row>
            </el-form>
          </el-card>
          <illustrate-operation />
          <!-- <el-row>
        <el-button type="primary" @click="submitForm">Сохранить</el-button>
      </el-row> -->
        </div>
      </div>
    </el-row>
  </div>
</template>
<script>
import request from '@/utils/request'
import CKEditor from '@ckeditor/ckeditor5-vue2'
import Editor from '../../../../ckeditor5/build/ckeditor'
import illustrateOperation from '@/views/operations/illustrateOperation'
import flowchartStructure from '@/components/Flowchart/flowchartStructure'

export default {
  name: 'DiagnosticEdit',
  components: {
    ckeditor: CKEditor.component,
    illustrateOperation,
    flowchartStructure
  },
  data() {
    return {
      id: Number(this.$route.params?.id),
      diagnosticFormData: {
        name: 'name',
        description: 'description',
        question: 'question'
      },
      editor: Editor, // ckEditor
      editorData: '<p>Content of the editor.</p>',
      editorConfig: {
        // The configuration of the editor.
      },
      answer_type: [
        { type_id: '1', type_description: 'Статический' },
        { type_id: '2', type_description: 'Динамический' }
      ],
      // structureflowchart
      structure: [
        {
          label: '0 - Общие сведения',
          children: [
            { label: '0 - Об этом руководстве' },
            { label: '1 - Меры безопасности' }
          ]
        },
        {
          label: '1 - Шасси',
          children: [
            {
              label: '11 - Подвеска',
              children: [
                { label: '1 - Передняя подвеска' },
                { label: '2 - Задняя подвеска' }
              ]
            },
            { label: '12 - Колеса и ступицы' }
          ]
        }
      ],
      checkedStructure: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  mounted() {
    // if (this.$route.params?.id) {
    //   this.getInfo(this.id)
    // }
  },
  methods: {
    async getInfo() {
      this.diagnosticFormData = await request({
        url: '/diagnostic_operations/' + this.id,
        method: 'get'
      })
    },
    treeModelsNodeClick(data) {
      this.checkedStructure = data.label
      console.log('this.checkedStructure', this.checkedStructure)
    },
    submitForm() {
      console.log('submitForm')
    }
  }
}
</script>
<style scoped>
.message_edit .display_grid {
  display: grid;
  justify-items: start;
}
.flowchart_structure {
  width: 250px;
  text-align: right;
  padding: 0 12px 0 0;
  font-size: 14px;
  vertical-align: middle;
  color: #606266;
  float: left;
}
</style>
