<template>
  <div class="selectModification">
    <!-- Поиск -->
    <el-row style="margin-top: 30px">
      <el-col :span="24">
        <filterSelect
          v-model="currentFilter"
          show-search
          search-placeholder="Поиск"
          @SearchOnFilter="searchModification"
        />
      </el-col>
    </el-row>
    <div class="modification grid grid-template grid-gap">
      <!-- :class="{ 'block_none': условие }" -->
      <div class="block logo">
        <span class="title"><span>Фильтр по модельному ряду</span></span>
        <div class="content">
          <el-tree
            :data="models"
            :props="propsTreeModels"
            @node-click="treeModelsNodeClick"
          />
        </div>
      </div>
      <div class="block nav">
        <span class="title"><span>Выберите модификацию</span></span>
        <div class="content">
          <el-tree
            ref="treeModification"
            :data="modification"
            show-checkbox
            node-key="productModification_id"
            :default-checked-keys="selectedModificationIds"
            :props="propsTreeModification"
            :filter-node-method="filterModification"
            @check="chkModification"
            @node-click="handleNodeClick"
          />
        </div>
      </div>
      <div class="block sidenav">
        <span class="title"><span>Выбранные модификации</span></span>
        <div class="content">
          <el-tree
            ref="treeSelectedModification"
            :data="selectedModification"
            :props="propsTreeSelectedModification"
            node-key="productModification_id"
          >
            <template #default="{ node }">
              <span class="custom-tree-node">
                <span>{{ node.label }}</span>
                <span>
                  <a @click="unselectedModifications(node)">
                    <i class="el-icon-close" />
                  </a>
                </span>
              </span>
            </template>
          </el-tree>
        </div>
      </div>
      <div class="block2 advert">
        <span class="title">Фильтр по году</span>
        <div class="content">
          <el-tree :data="years" :props="propsYear" @node-click="filterYear" />
        </div>
      </div>
      <div class="block2 footer">
        <el-checkbox-group v-if="isCheckboxShow" v-model="optionalCheckbox">
          <el-checkbox label="a"> Только рекоммендуемые </el-checkbox>
          <el-checkbox label="b"> Только отсутствующие </el-checkbox>
          <el-checkbox label="c"> Выбрать все </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import filterSelect from '@/components/Header/filter'

export default {
  name: 'SelectModification',
  components: {
    filterSelect
  },
  props: {
    selectedModification: {
      type: Array,
      default() {
        return []
      }
    },
    isCheckboxShow: {
      type: Boolean,
      default: false
    }
  },
  emits: ['selectedModification'],
  data() {
    return {
      productModel_id: 0,
      // Фильтр по модельному ряду
      models: [],
      propsTreeModels: {
        label: 'productModel_name'
      },
      // Фильтр по году
      years: [],
      propsYear: {
        label: 'year'
      },
      // Выберите модификацию
      modification: [],
      propsTreeModification: {
        label: 'productModification_name'
      },
      currentFilter: {},
      // Выбранные модификации
      selectedModificationIds: [],
      propsTreeSelectedModification: {
        label: 'productModification_name'
      },
      // Чек-боксы
      optionalCheckbox: []
    }
  },
  watch: {
    optionalCheckbox(newV, oldV) {
      const params = {
        a: newV[0] || false,
        b: newV[1] || false,
        c: newV[2] || false
      }
      console.log('params', params)
    },
    selectedModification(newV, oldV) {
      this.selectedModificationIds = []
      this.selectedModification.map((v) => {
        return this.selectedModificationIds.push(v.productModification_id)
      })
    }
  },
  mounted() {
    this.getModels()
  },
  methods: {
    filterModification(value, data) {
      if (!value) return true
      return data.productModification_name.includes(value)
    },
    searchModification() {
      this.$refs.treeModification.filter(this.currentFilter.filter)
    },
    async getModels() {
      const res = await request({
        url: '/productmodel/onlymodels/',
        method: 'get'
      })
      this.models = res.data
    },
    async treeModelsNodeClick(node) {
      this.productModel_id = node.productModel_id
      const params = { productModel_id: this.productModel_id }
      await this.getModifications(params)
      await this.getYears()
    },
    getYears() {
      this.years = this.modification.map((v) => v.productModification_modelYear)
      // Получить уникальные года выпуска
      this.years = [...new Set(this.years)]
      // Удалить пустые значения и отсортировать
      this.years = this.years.filter(Number).sort()
      // Преобразовать в объект
      this.years = this.years.map((v) => ({
        year: v
      }))
    },
    filterYear(node) {
      const params = { productModel_id: this.productModel_id, year: node.year }
      this.getModifications(params)
    },
    // methods for second el-tree
    async getModifications(params) {
      const res = await request({
        url: '/productmodification',
        method: 'get',
        params: params
      })
      this.modification = res.data
    },
    chkModification(node, status) {
      if (status.checkedKeys.indexOf(node.productModification_id) > -1) {
        this.selectedModification.push(node)
      } else {
        this.unselectedModifications(node)
      }
    },
    // methods for third el-tree
    unselectedModifications(node) {
      let id = 0
      if (node.productModification_id) {
        id = node.productModification_id
      } else {
        id = node.data.productModification_id
      }
      this.$emit(
        'update:selectedModification',
        this.selectedModification.filter(
          (item) => item.productModification_id !== id
        )
      )
      this.$refs.treeModification.setChecked(id, false)
    },
    handleNodeClick(node) {
      const cond = this.isInArray(
        node.productModification_name,
        this.selectedModification
      )
      if (!cond) {
        this.selectedModification.push(node)
      } else {
        this.unselectedModifications(node)
      }
    },
    isInArray(id, arr) {
      if (arr.some((el) => el.productModification_name === id)) {
        return true
      }
      return false
    }
  }
}
</script>

<style scoped>
.modification {
  display: flex;
  width: 800px;
  width: auto; /*резиновая ширина*/
  padding: 0;
  flex-wrap: wrap;
}
.modification .block .content {
  overflow-y: auto;
  height: 457px;
  margin: 0 5px;
}
.modification .sidenav .content,
.block_none .nav .content {
  height: 607px;
}
.modification .block2 .content {
  overflow-y: auto;
  height: 108px;
  margin: 0 5px;
}
.modification .title {
  display: block;
  font-size: 14px;
  margin-bottom: 20px;
  white-space: nowrap; /*Выберите модификацию-в одну строку*/
}
.grid {
  display: grid;
}
.logo {
  grid-area: logo;
}
.nav {
  grid-area: nav;
}
.sidenav {
  grid-area: sidenav;
}
.advert {
  grid-area: advert;
}
.footer {
  grid-area: footer;
  padding: 38px 0 0 29px;
}
.logo,
.nav,
.sidenav,
.advert {
  text-align: center;
}
.logo,
.nav,
.advert,
.footer {
  border-left: solid 1px lightgray;
}
.nav,
.sidenav,
.footer {
  border-right: solid 1px lightgray;
}
.footer label.el-checkbox {
  display: block;
}
.grid-template {
  grid-template:
    'logo nav sidenav' 500px
    'advert footer sidenav' 150px;
}
/*РЕДАКТОР ТЕХ. КАРТ: Условие, когда второй блок снизу исчезает*/
.block_none.grid-template {
  grid-template:
    'logo nav sidenav' 500px
    'advert nav sidenav' 150px;
}
.block_none .footer {
  display: none;
}
</style>
