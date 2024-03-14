<template>
  <dialog-f
    title="Запись на ТО"
    :show-dialog="open"
    @update:showDialog="closeDialog"
    @closeDialog="closeDialog"
    @saveData="saveModalData()"
  >
    <el-form
      ref="scheduleForm"
      :model="data"
      label-position="left"
      label-width="120px"
    >
      {{ data.booking_id }}
      <el-form-item label="Время начала" prop="slotStart">
        <el-input
          v-model="data.slotStart"
          autocomplete="off"
          minlength="3"
          disabled
        />
      </el-form-item>
      <el-form-item label="Дата" prop="date">
        <el-input
          v-model="data.date"
          autocomplete="off"
          minlength="3"
          disabled
        />
      </el-form-item>
      <el-form-item label="VIN" prop=" vin">
        <el-input v-model="data.vin" autocomplete="off" minlength="3" />
      </el-form-item>
      <el-form-item label="Госномер" prop="gosnomer">
        <el-input v-model="data.gosnomer" autocomplete="off" minlength="3" />
      </el-form-item>
      <el-form-item label="Фамилия" prop="lname">
        <el-input v-model="data.lname" autocomplete="off" minlength="3" />
      </el-form-item>
      <el-form-item label="Имя" prop="fname">
        <el-input v-model="data.fname" autocomplete="off" minlength="3" />
      </el-form-item>
      <el-form-item label="Отчество" prop="mname">
        <el-input v-model="data.mname" autocomplete="off" minlength="3" />
      </el-form-item>
      <el-form-item label="Почта" prop="email">
        <el-input v-model="data.email" autocomplete="off" minlength="3" />
      </el-form-item>
      <el-form-item label="Телефон" prop="phone">
        <el-input v-model="data.phone" autocomplete="off" minlength="3" />
      </el-form-item>
      <el-form-item label="Комментарий" prop="comment">
        <el-input
          v-model="data.comment"
          autocomplete="off"
          minlength="3"
          type="textarea"
        />
      </el-form-item>
    </el-form>
  </dialog-f>
</template>

<script>
import DialogF from '@/components/Dialog/DialogF'
import request from '@/utils/request'

export default {
  name: 'SheduleDialog',
  components: { DialogF },
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
      formData: {
        vin: 'XTT316300L1025239',
        gosnomer: 'Н600РО73',
        lname: 'Угарин',
        fname: 'Максим',
        mname: 'Викторович',
        email: 'mv.ugarin@prof-itgroup.ru',
        phone: '89176393343'
      }
    }
  },
  computed: {},
  methods: {
    closeDialog() {
      if (this.$refs['scheduleForm']) {
        this.$refs['scheduleForm'].clearValidate()
      }
      this.$emit('update:open', false)
    },
    async saveModalData() {
      this.data.status = 'busy'
      console.log(this.data)
      const res = await request({
        url: '/booking/' + this.data.booking_id,
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
    }
  }
}
</script>
