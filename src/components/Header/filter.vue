<template>
  <div>
    <div style="display: flex; align-items: flex-end; font-size: 12px">
      <Vselect
        v-if="showSelectSectionStatus !== false"
        v-model="valueSelect"
        :sort-options="response"
        :show-select-section="showSelectSection"
        :is-multiple="isMultiple"
        default-value="parts1"
        @onSelectChange="selectChange"
        @onSelectChangeStatus="selectChangeStatus"
      />
      <PlatformDropdown v-if="showFilter !== false" v-model="platforms" />
    </div>
    <div class="search_filter">
      <SearchInput
        v-if="showSearch !== false"
        v-model="value.filter"
        class="search_input"
        :placeholder="searchPlaceholder"
        style="width: 100%"
        @onEnter="$emit('SearchOnFilter')"
      />
      <div v-if="showExport !== false" class="dealer_list_select">
        <div><label class="radio-label label_filter">Экспорт</label></div>
        <export-dealer
          v-model="value.isExport"
          @input="$emit('SearchOnFilter')"
        />
      </div>
      <el-tooltip
        class="box-item"
        effect="light"
        placement="top-start"
        content="Загрузить спецификацию"
        popper-class="uaz__tooltip uaz__tooltip-left"
      >
        <el-button
          v-if="showButton !== false"
          :loading="downloadLoading"
          type="primary"
          class="el-button-icon"
        >
          <i class="el-icon-download" />СП
        </el-button>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="light"
        placement="top-start"
        content="Загрузить структуру"
        popper-class="uaz__tooltip uaz__tooltip-left"
      >
        <el-button
          v-if="showButton !== false"
          :loading="downloadLoading"
          type="primary"
          class="el-button-icon"
        >
          <i class="el-icon-download" />СТР
        </el-button>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        effect="light"
        placement="top-start"
        content="Выгрузить в Excel"
        popper-class="uaz__tooltip uaz__tooltip-left"
      >
        <el-button
          v-if="showButtonXls !== false"
          type="primary"
          class="el-button-icon"
          @click="$emit('onHandleBtnXsl')"
        >
          <i class="el-icon-download" style="padding-right: 5px" />XSL
        </el-button>
      </el-tooltip>
      <div v-if="showLang !== false" style="margin: 0 10px">
        <div><label class="radio-label label_filter">Выбор языка</label></div>
        <el-select
          v-model="language"
          style="width: 200px"
          class="filter-item"
          @change="selectChangeLanguage"
        >
          <el-option
            v-for="item in sortLanguageOptions"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
      </div>
    </div>
  </div>
</template>

<script>
import SearchInput from './components/SearchInput'
import PlatformDropdown from './components/PlatformDropdown'
import Vselect from './components/Select'
import exportDealer from '@/views/dealer/exportDealer'
export default {
  name: 'SelectTableFilter',
  components: { SearchInput, PlatformDropdown, Vselect, exportDealer },
  props: {
    searchPlaceholder: {
      type: String,
      default: 'Название/Номер/Код'
    },
    value: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showSelectSectionStatus: {
      default: false,
      type: Boolean
    },
    isMultiple: {
      default: true,
      type: Boolean
    },
    showSelectSection: {
      default: true,
      type: Boolean
    },
    showFilter: {
      default: false,
      type: Boolean
    },
    showSearch: {
      default: false,
      type: Boolean
    },
    showButtonXls: {
      default: false,
      type: Boolean
    },
    showExport: {
      default: false,
      type: Boolean
    },
    showButton: {
      default: false,
      type: Boolean
    },
    showLang: {
      default: false,
      type: Boolean
    },
    filterShowSelectSection: {
      type: String,
      default: ''
    },
    filterShowSelectStatus: {
      default: false,
      type: Boolean
    },
    filterShowLang: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      downloadLoading: false,
      searchValue: '',
      platforms: [],
      valueSelect: '',
      selectFilterClick: '',
      selectFilterClickStatus: '',
      language: '',
      response: [
        {
          name: 'Товарный портфель',
          value: 'parts1',
          status: [
            { name: 'К исполнению', value: 'null' },
            { name: 'Ожидает добавления в прайс', value: 'wait' },
            { name: 'Обработано', value: 'executed' },
            { name: 'Отклонено', value: 'declined' }
          ]
        },
        {
          name: 'Руководство по ремонту',
          value: 'parts2',
          status: [
            { name: 'Входящие', value: 'inbox' },
            { name: 'Черновик', value: 'draft' },
            { name: 'Ожидает согласования', value: 'wait' },
            { name: 'Отправлена', value: 'send' },
            { name: 'Корректировка', value: 'correction' },
            { name: 'На согласовании в ОРРД', value: 'waiturrd' }
          ]
        },
        {
          name: 'Руководство по ремонту - заявки на перевод',
          value: 'parts3',
          status: [
            { name: 'В работе', value: 'work' },
            { name: 'Черновик', value: 'draft' },
            { name: 'Ожидает согласования', value: 'wait' },
            { name: 'Отправлена', value: 'send' },
            { name: 'Корректировка', value: 'correction' }
          ]
        },
        {
          name: 'Электросхемы',
          value: 'parts4',
          status: [
            { name: 'В работе', value: 'work' },
            { name: 'Черновик', value: 'draft' },
            { name: 'Ожидает согласования', value: 'wait' },
            { name: 'Отправлена', value: 'send' },
            { name: 'Корректировка', value: 'correction' }
          ]
        },
        {
          name: 'Диагностика',
          value: 'parts5',
          status: [
            { name: 'В работе', value: 'work' },
            { name: 'Черновик', value: 'draft' },
            { name: 'Ожидает согласования', value: 'wait' },
            { name: 'Отправлена', value: 'send' },
            { name: 'Корректировка', value: 'correction' }
          ]
        }
      ],
      sortLanguageOptions: [
        { label: 'Русский', key: 'Ru' },
        { label: 'English', key: 'En' },
        { label: 'Español', key: 'ES' }
      ]
    }
  },
  created() {},
  methods: {
    selectChange(e) {
      this.selectFilterClick = e
      // console.log(this.selectFilterClick, '66666')
      this.$emit('onFilterChange', this.selectFilterClick)
    },
    selectChangeStatus(e) {
      this.selectFilterClickStatus = e
      this.$emit('onFilterChangeStatus', this.selectFilterClickStatus)
    },
    selectChangeLanguage(index, row) {
      this.$emit('onFilterChangeLanguage', this.language)
    }
  }
}
</script>
<style>
.radio-label {
  font-size: 12px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
  font-size: 14px;
}
.el-button-icon:hover,
.el-button-icon:focus {
  color: #fff !important;
  background-color: #003d2d !important;
}
.el-radio__input.is-checked + .el-radio__label {
  color: #003d2d;
}
.search_filter {
  display: flex;
  align-items: flex-end;
  margin: 10px 0;
  font-size: 12px;
  gap: 10px;
}
.search_input {
  margin: 0 0 0 0;
}
</style>
