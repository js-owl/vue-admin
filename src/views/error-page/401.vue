<template>
  <div class="layout__main">
    <div class="not-found">
      <h1 class="not-found__title">Эта страница не работает</h1>
      <div class="not-found__subtitle">
        Доступ к запрашиваемому вами ресурсу ограничен!
      </div>
      <div class="not-found__wrapper">
        <div class="not-found__text">401</div>
        <div class="not-found__img" />
      </div>
      <el-button
        icon="el-icon-arrow-right"
        class="not-found__link"
        @click="back"
      >
        Перейти на главную страницу
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page401',
  data() {
    return {}
  },
  methods: {
    back() {
      this.$router.push({ path: '/' })
      // if (this.$route.query.noGoBack) {
      // } else {
      //   this.$router.go(-1)
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
.layout__main {
  background: #fff;
  font-family: Stem, sans-serif;
  line-height: 1.44444;
  color: #1c252c;
  font-size: 1.77778vh;
  position: relative;
  overflow: hidden;
  scrollbar-gutter: stable;
  width: 100%;
  margin: 0;
  padding-top: 0.5em;
  min-height: 8.5em;
}
.not-found {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}
.not-found__title {
  color: #1c252c;
  font-weight: 600;
  font-size: 4em;
  line-height: 1.0625em;
  margin: 3.125em 0 0.1875em;
}
.not-found__subtitle {
  font-size: 1.315em;
  line-height: 1.36364em;
  font-weight: 700;
}
.not-found__wrapper {
  position: relative;
}
.not-found__text {
  font-weight: 100;
  font-size: 14.375em;
  line-height: 1.30435em;
  margin-top: 0.04348em;
}
.not-found__img {
  position: absolute;
  left: 50%;
  bottom: 0;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  background-image: url(https://www.uaz.ru/_nuxt/img/0bf6af6.png);
  width: 18.75em;
  height: 12.5em;
}
.not-found__link {
  font-size: 0.65em;
  line-height: 1.33333;
  color: #1c252c;
  display: inline-block;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  padding: 1.5em 3em 1.5em 1.5em;
  letter-spacing: 0.14em;
  font-weight: 700;
  background-color: #fff;
  box-shadow: 0 0.16667em 0.16667em rgb(0 0 0 / 10%), 0 0 1px rgb(0 0 0 / 20%);
  border-radius: 0.16667em;
  position: relative;
  transition: background 0.2s;
  margin-top: 4em;
}
.not-found__img,
.not-found__link:before {
  background-size: contain;
  background-position: 50%;
  background-repeat: no-repeat;
}
.not-found__link:hover {
  background: #f8f8f8;
}
</style>
