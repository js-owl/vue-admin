<template>
  <div class="modification">
    <div class="block">
      <span class="title">Фильтр по модельному ряду</span>
      <div class="content">
        <el-tree
          :data="models"
          :props="propsTreeModels"
          @node-click="treeModelsNodeClick"
        />
      </div>
    </div>
    <div class="block">
      <span class="title">Выберите модификацию</span>
      <div class="content">
        <el-tree
          ref="treeModification"
          show-checkbox
          node-key="productModification_id"
          :default-checked-keys="selectedModificationIds"
          :data="modification"
          :props="propsTreeModification"
          @check="chkModification"
        />
      </div>
    </div>
    <div class="block">
      <span class="title">Выбранные модификации</span>
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
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'SelectIncadeaModification',
  props: {
    selectedModification: {
      type: Array,
      default() {
        return []
      }
    }
  },
  emits: ['selectedModification'],
  data() {
    const productModel_id = 'Option4'
    const propsTreeModels = {
      label: 'productModel_name'
    }
    const propsTreeModification = {
      label: 'productModification_name'
    }
    const propsTreeSelectedModification = {
      label: 'productModification_name'
    }
    return {
      productModel_id,
      models: [],
      modification: [],
      propsTreeModels,
      propsTreeModification,
      propsTreeSelectedModification,
      selectedModificationIds: []
    }
  },
  watch: {
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
    // methods for first el-tree
    async getModels() {
      const res = await request({
        url: '/productmodelsLT/',
        method: 'get',
        params: {
          notShowIsIgnored: true
        }
      })
      this.models = res.data
    },
    treeModelsNodeClick(node) {
      this.getModifications(node.productModel_id)
    },
    // methods for second el-tree
    async getModifications(model_id) {
      const res = await request({
        url: '/productmodificationLT',
        method: 'get',
        params: {
          productModel_id: model_id,
          showOnlyNotLinked: true
        }
      })
      res.data = res.data.map((v) => {
        v.productModification_name = v.productModificationLT_code
        return v
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
  margin-bottom: 50px;
}
.modification .block {
  text-align: center;
  border-right: solid 1px lightgray;
  flex: 1;
  height: 600px;
  height: 500px; /*изменили высоту*/
}
.modification .content {
  overflow-y: auto;
  height: 460px;
  margin: 0 5px;
}
.modification .block:last-child {
  border-right: none;
}
.modification .title {
  display: block;
  font-size: 14px;
  margin-bottom: 20px;
  white-space: nowrap; /*Выберите модификацию-в одну строку*/
}
</style>
