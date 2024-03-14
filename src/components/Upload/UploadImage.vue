<template>
  <div class="upload-container">
    <el-upload
      ref="uploadElement"
      :multiple="false"
      :show-file-list="false"
      :on-success="handleImageSuccess"
      :headers="HeadersForUpload"
      class="image-uploader"
      drag
      :action="apiUploadUrl"
    >
      <div v-if="!imageUrl">
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          Выберите изображение
        </div>
      </div>
      <div v-else class="image-preview">
        <el-image
          style="width: 200px; height: 200px"
          :src="imageUrl"
          fit="scale-down"
        >
        </el-image>
        <div class="image-preview-action">
          <i class="el-icon-delete" />
        </div>
      </div>
    </el-upload>

  </div>
</template>

<script>
import { getToken } from '@/utils/auth'

export default {
  name: 'UploadImage',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  emits: ['changeImage'],
  data() {
    return {
      apiUploadUrl: process.env.VUE_APP_BACKEND_HOST + '/api/files/upload',
      tempUrl: '',
      HeadersForUpload: ''
    }
  },
  created() {
    this.HeadersForUpload = { 'Authorization': 'Bearer  ' + getToken() }
  },
  computed: {
    imageUrl() {
      if (this.value) {
        return process.env.VUE_APP_BACKEND_HOST + '/storage/' + this.value
      } else {
        return null
      }
    }
  },
  methods: {
    rmImage() {
      this.$refs.uploadElement.$refs['upload-inner'].handleClick()
    },
    handleImageSuccess(file) {
      this.tempUrl = process.env.VUE_APP_BACKEND_HOST + '/storage/' + file.data
      this.$emit('changeImage', file.data)
    },
    beforeUpload() {
    }
  }
}
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";
.upload-container {
  width: 100%;
  position: relative;
  @include clearfix;
  .image-uploader {
    width: 200px;
    float: left;
  }
  .image-preview {
    width: 200px;
    height: 200px;
    position: relative;
    float: left;
    .image-preview-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .image-preview-action {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, .5);
      transition: opacity .3s;
      cursor: pointer;
      text-align: center;
      line-height: 200px;
      .el-icon-delete {
        font-size: 36px;
      }
    }
    &:hover {
      .image-preview-action {
        opacity: 1;
      }
    }
  }
}
</style>
