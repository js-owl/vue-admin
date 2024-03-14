<template>
  <dialog-f
    title="Редактор символов"
    :show-dialog="open"
    width="70%"
    @update:showDialog="closeDialog"
    @closeDialog="closeDialog"
    @saveData="saveModalData()"
  >
    <el-form
      ref="symbolForm"
      :rules="rules"
      :model="data"
      label-position="left"
      label-width="160px"
    >
      <el-row :gutter="20">
        <el-col :span="18">
          <el-form-item
            label-width="300px"
            label="Название символа"
            prop="symbol_name"
          >
            <el-input
              v-model="data.symbol_name"
              autocomplete="off"
              :disabled="role_name == 'translator'"
            />
          </el-form-item>
          <el-form-item
            label-width="300px"
            label="Название символа (EN)"
            prop="symbol_name_en"
          >
            <el-input v-model="data.symbol_name_en" autocomplete="off" />
          </el-form-item>
          <el-form-item
            label-width="300px"
            label="Название символа (ES)"
            prop="symbol_name_es"
          >
            <el-input v-model="data.symbol_name_es" autocomplete="off" />
          </el-form-item>
          <el-form-item label-width="300px" label="Вид символа:">
            <el-select v-model="data.symbolType_id" style="width: 100%">
              <el-option
                v-for="item in typeSymbolOptions"
                :key="item.symbolType_id"
                :label="item.symbolType_id + ' - ' + item.symbolType_name"
                :value="item.symbolType_id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <upload-image :value="data.symbol_image" @changeImage="changeImage" />
        </el-col>
      </el-row>
    </el-form>
    <el-button
      v-show="!showFormAddView"
      type="primary"
      @click="showFormAddView = !showFormAddView"
    >
      Добавить вид
    </el-button>
    <el-form v-show="showFormAddView" label-position="left" label-width="160px">
      <el-row :gutter="20">
        <el-col :span="18">
          <el-form-item
            label-width="300px"
            label="Наименование нового вида символов:"
          >
            <el-input v-model="symbolType.symbolType_name" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addSymbolType">
            Добавить
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </dialog-f>
</template>

<script>
import { mapGetters } from 'vuex'
import DialogF from '@/components/Dialog/DialogF'
import request from '@/utils/request'
import UploadImage from '@/components/Upload/UploadImage'

export default {
  name: 'SymbolDialog',
  components: { DialogF, UploadImage },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default() {
        return this.formData
      }
    }
  },
  emits: ['update:open', 'update:data', 'saveData'],
  data() {
    return {
      symbolType: {},
      showFormAddView: false,
      typeSymbolOptions: [],
      rules: {
        symbol_name: [
          { required: true, message: 'Заполните поле', trigger: 'blur' }
        ]
      },
      formData: {
        symbol_name: '',
        symbol_name_en: '',
        symbol_name_es: '',
        symbol_image: '',
        symbolType_id: ''
      }
    }
  },
  computed: {
    ...mapGetters(['role_name'])
  },
  mounted() {
    this.getTypeSymbol()
  },

  methods: {
    async addSymbolType() {
      const res = await request({
        url: '/symbol_types',
        method: 'post',
        data: this.symbolType
      })
      if (res) {
        this.$notify({
          title: 'Успешно!',
          message: 'Данные успешно добавлены',
          type: 'success',
          duration: 5000
        })
        this.getTypeSymbol()
        this.data.symbolType_id = res.symbolType_id
      }
      this.showFormAddView = !this.showFormAddView
    },
    closeDialog() {
      this.$emit('update:open', false)
      if (this.$refs['symbolForm']) {
        this.$refs['symbolForm'].clearValidate()
      }
    },
    changeImage(value) {
      this.data.symbol_image = value
    },
    async getTypeSymbol() {
      console.log('good')
      const res = await request({
        url: '/symbol_types',
        method: 'get'
      })
      this.typeSymbolOptions = res
    },
    async saveModalData() {
      this.$refs['symbolForm'].validate(async (valid) => {
        if (valid) {
          if (this.data.symbol_id) {
            const res = await request({
              url: '/symbols/' + this.data.symbol_id,
              method: 'put',
              data: this.data
            })
            if (res) {
              this.$notify({
                title: 'Успешно!',
                message: 'Данные успешно сохранены',
                type: 'success',
                duration: 5000
              })
              this.data.symbolType_name = res.symboltype.symbolType_name
              this.$emit('saveData', 'update')
              this.$emit('update:data', this.data)
              this.$emit('update:open', false)
            }
          } else {
            const res = await request({
              url: '/symbols',
              method: 'post',
              data: this.data
            })
            if (res) {
              this.$notify({
                title: 'Успешно!',
                message: 'Данные успешно добавлены',
                type: 'success',
                duration: 5000
              })
              this.$emit('saveData', 'create')
            }
          }
          this.closeDialog()
        }
      })
    }
  }
}
</script>
