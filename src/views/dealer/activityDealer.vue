<template>
  <div class="container" style="display: inline-block">
    <div>
      <label class="radio-label label_filter">
        Тип
      </label>
    </div>
    <el-select
      v-model="vm.activity_type"
      class="select"
      multiple
      collapse-tags
      clearable
      placeholder="VIN/Артикул"
      style="width: 100%"
    >
      <el-option
        v-for="item in dealerActivity"
        :key="item.activity_type"
        :label="item.activity_name"
        :value="item.activity_type"
      />
    </el-select>
    <el-button type="primary" @click="downloadActivityReport">Скачать Excel</el-button>
  </div>
</template>

<script>
// multiple
import request from '@/utils/request'

export default {
  props: ['value'],
  data() {
    return {
      dealerActivity: [
        { activity_name: 'Авторизация', activity_type: 'auth' },
        // { activity_name: 'Открытие ЭС', activity_type: 'auth' },
        { activity_name: 'Выбор модификации в ЗЧ', activity_type: 'select_mod_parts' },
        { activity_name: 'Список ТК по модели и году', activity_type: 'select_year_flowcharts' },
        { activity_name: 'Поиск по ViN', activity_type: 'search_vin' },
        { activity_name: 'Поиск по тексту/артикулу', activity_type: 'search_text' },
        { activity_name: 'Просмотр карточки ЗЧ', activity_type: 'part_info' },
        { activity_name: 'Открытие ТК', activity_type: 'open_flowchart' },
        { activity_name: 'Выбор модификации в ЭС', activity_type: 'select_mod_emaps' },
        { activity_name: 'Выбор модификации в ДК', activity_type: 'select_mod_diagnostic' },
        { activity_name: 'Выбор модификации в НВ', activity_type: 'select_mod_standtme' },
        { activity_name: 'Открытие ЭС', activity_type: 'open_emap' },
        { activity_name: 'Поиск НВ', activity_type: 'search_standtime' },
        { activity_name: 'Печать страницы', activity_type: 'print_page' },
        { activity_name: 'Открытие корзины', activity_type: 'open_cart' },
        { activity_name: 'Просмотр СД', activity_type: 'show_test' },
        { activity_name: 'Отправка обратной связи', activity_type: 'send_support' }
      ]
    }
  },
  computed: {
    vm: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    async downloadActivityReport() {
      const res = await request({
        url: '/activity/xls',
        method: 'get',
        responseType: 'blob',
        params: this.vm
      })
      window.open(URL.createObjectURL(res))
    }
  }
}
</script>
<style scoped>
.container {
  margin: -8px 0 10px 0;
  width: 100%;
}
.radio-label {
  font-size: 12px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
  font-size: 14px;
}
</style>
