<template>
  <el-form-item prop="prop">
    <el-row>
      <label class="el-form-item__label">
        Город
      </label>
    </el-row>
    <el-row>
      <el-select v-model="value" @select="$emit('input', $event.target.value)" placeholder="Выберите город">
        <el-option
          v-for="item in cities"
          :key="item.city_id"
          :label="item.city_name"
          :value="item.city_id"
        />
      </el-select>
    </el-row>
  </el-form-item>
</template>
<script>
import request from '@/utils/request'
export default {
  name: 'SelectCity',
  props: {
    prop: {
      type: String,
      default() {
        return true
      }
    },
    value: {
      type: Number,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      cities: []
    }
  },
  mounted() {
    this.getCities()
  },
  methods: {
    async getCities() {
      const res = await request({
        url: '/city/',
        method: 'get',
        params: {
          limit: 5000
        }
      })
      this.cities = res.data
    }
  }
}
</script>
