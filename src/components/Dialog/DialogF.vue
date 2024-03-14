<template>
  <el-dialog
    :visible="showDialog"
    :title="title"
    :width="width"
    :max-width="maxWidth"
    append-to-body
    @open="$emit('open', $event)"
    @update:visible="$emit('update:showDialog', $event)"
  >
    <slot name="default" />
    <template #footer>
      <span v-if="!hideButton" class="dialog-footer">
        <el-button
          :disabled="disable"
          class="el_button_save_modal"
          type="primary"
          @click="saveModalData()"
        >
          Сохранить
        </el-button>
        <el-button class="el_button_close_modal" @click="closeModal">
          Отмена
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'DialogF',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: ''
    },
    maxWidth: {
      type: String,
      default: ''
    },
    hideButton: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    },
    disable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async saveModalData() {
      this.$emit('saveData')
    },
    closeModal() {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
/*кнопки Сохранить и Отмена*/
.el_button_save_modal {
  /*кнопка Сохранить */
  background-color: #003d2d;
  border-color: white;
  /*text-transform: uppercase;*/
}
.el_button_save_modal:focus,
.el_button_close_modal:focus {
  border-color: #606266;
}
.el_button_close_modal {
  /*кнопка Отмена */
  background-color: #cfdbd9;
  border-color: #cfdbd9;
  /*text-transform: uppercase;*/
}
.el_button_close_modal:hover,
.el_button_close_modal:focus {
  color: #606266;
}
</style>
