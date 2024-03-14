<template>
  <div :class="{ 'has-logo': true }">
    <logo :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import { asyncRoutes, constantRoutes } from '@/router'

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      permission_routes: []
    }
  },
  computed: {
    ...mapGetters(['sidebar']),
    // ...mapGetters(['permission_routes', 'sidebar']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  mounted() {
    this.permission_routes = [...constantRoutes, ...asyncRoutes]
    const userRole = this.$store.state.user.role_name
    // отфильтровать родителей
    this.permission_routes = this.permission_routes.filter((v) => {
      return v.meta?.roles?.includes(userRole)
    })
    // отфильтровать детей
    this.permission_routes.forEach((v) => {
      v.children = v.children.filter((c) => c?.meta?.roles?.includes(userRole))
    })
  }
}
</script>
<style lang="scss" scoped></style>
