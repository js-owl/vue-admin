<template>
  <dialog-f
    title="Заявка на изменение тех.карты"
    :show-dialog="open"
    max-width="70%"
    @update:showDialog="closeDialog"
    @closeDialog="closeDialog"
    @saveData="saveModalData()"
  >
    <el-form
      ref="flowchartForm"
      :model="data"
      label-position="top"
      label-width="160px"
    >
      <el-row
        :gutter="20"
        style="
          margin: 0px;
          width: 100%;
          display: flex;
          justify-content: space-between;
        "
      >
        <el-col :span="16" style="padding: 0; margin: 0 20px 0 0">
          <el-form-item label="Инициатор">
            <el-input v-model="data.fio" :disabled="true" autosize />
          </el-form-item>
          <el-form-item label="Комментарий">
            <el-input
              v-model="data.comment_description"
              type="textarea"
              autosize
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8" style="width: 200px; padding: 0; margin: 0 0 0 auto">
          <el-form-item label="Изображение">
            <upload-image
              v-if="role_name != 'translator'"
              :value="data.comment_file"
              @changeImage="changeImage"
            />
            <!-- <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"з
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList"
            >
              <el-button size="small" type="primary">Выбирете файл</el-button>
            </el-upload> -->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </dialog-f>
</template>

<script>
import request from '@/utils/request'
import { mapGetters } from 'vuex'
import DialogF from '@/components/Dialog/DialogF'
import UploadImage from '@/components/Upload/UploadImage'

export default {
  name: 'FlowchartChangeDialog',
  components: { DialogF, UploadImage },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  emits: ['update:open', 'update:data', 'saveData'],
  data() {
    return {
      // fileList: [
      //   {
      //     name: 'food.jpeg',
      //     url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      //   },
      // ]
    }
  },
  computed: {
    ...mapGetters(['role_name'])
  },
  methods: {
    changeImage(value) {
      this.data.comment_file = value
    },
    closeDialog() {
      this.$emit('update:open', false)
    },
    async saveModalData() {
      if (this.data.comment_id) {
        const res = await request({
          url: '/comments/' + this.data.comment_id,
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
          this.$emit('saveData', 'update')
          this.$emit('update:data', this.data)
          this.$emit('update:open', false)
        }
      } else {
        const res = await request({
          url: '/comments',
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
          this.$emit('saveData', 'create', res)
        }
      }
      this.closeDialog()
    }
    // handlePreview() {
    //   console.log('handlePreview')
    // },
    // handleRemove() {
    //   console.log('handleRemove')
    // },
    // beforeRemove() {
    //   console.log('beforeRemove')
    // },
    // handleExceed() {
    //   console.log('handleExceed')
    // }
  }
}
</script>

<style scoped>
.notification__icon {
  width: 30px;
  height: 30px;
  font-size: 25px;
}
.el-select--medium {
  width: 100%;
}
.upload-container > .image-uploader {
  width: 212px;
}
</style>
