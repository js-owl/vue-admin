<template>
  <div class="app-container">

    <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-circle-check" /> Стартовый набор кнопок</span>



        <article>
          <h2>Основные кнопки</h2><br />
          <el-row>
            <el-button>По умолчанию</el-button>
            <el-button type="primary">Добавить</el-button>
            <el-button type="success">Успешно</el-button>
            <el-button type="info">В работу</el-button>
            <el-button type="warning">На корректировку</el-button>
            <el-button type="danger">Удалить</el-button>
          </el-row>
        </article>
        <hr />

        <article>
          <el-upload
            class="avatar-uploader"
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            5645645654
          </el-upload>

          <h1>Стартовый набор кнопок</h1> <hr /><br />
          <h2>Большие кнопки</h2><br />
          <el-row>
            <el-button size="large">По умолчанию</el-button>
            <el-button type="primary" size="large">Добавить</el-button>
            <el-button type="success" size="large">Успешно</el-button>
            <el-button type="info" size="large">В работу</el-button>
            <el-button type="warning" size="large">На корректировку</el-button>
            <el-button type="danger" size="large">Удалить</el-button>
          </el-row>
        </article>
        <hr />

        <article>
          <h2>Отключенные кнопки</h2><br />
          <el-row>
            <el-button disabled>По умолчанию</el-button>
            <el-button type="primary" disabled>Добавить</el-button>
            <el-button type="success" disabled>Успешно</el-button>
            <el-button type="info" disabled>В работу</el-button>
            <el-button type="warning" disabled>На корректировку</el-button>
            <el-button type="danger" disabled>Удалить</el-button>
          </el-row>
        </article>
        <hr />

        <article>
          <h3>Маленькие кнопки</h3><br />
          <el-row>
            <el-button size="small">По умолчанию</el-button>
            <el-button type="primary" size="small">Добавить</el-button>
            <el-button type="success" size="small">Успешно</el-button>
            <el-button type="info" size="small">В работу</el-button>
            <el-button type="warning" size="small">На корректировку</el-button>
            <el-button type="danger" size="small">Удалить</el-button>
          </el-row>
        </article>
        <hr />

        <article>
          <h3>Кнопки с текстом без фона</h3><br />
          <el-row>
            <el-button class="el-button--text">По умолчанию</el-button>
            <el-button type="primary" class="el-button--text">Добавить</el-button>
            <el-button type="success" class="el-button--text">Успешно</el-button>
            <el-button type="info" class="el-button--text">В работу</el-button>
            <el-button type="warning" class="el-button--text">На корректировку</el-button>
            <el-button type="danger" class="el-button--text">Удалить</el-button>
          </el-row>
        </article>
        <hr />

        <article>
          <h3>Размерный ряд</h3><br />

          <div class="column">
            <el-row class="row">
              <el-button size="large">По умолчанию</el-button>
              <el-button>По умолчанию</el-button>
              <el-button size="small">По умолчанию</el-button>
            </el-row>

            <el-row class="row">
              <el-button type="primary" size="large">Добавить</el-button>
              <el-button type="primary">Добавить</el-button>
              <el-button type="primary" size="small">Добавить</el-button>
            </el-row>

            <el-row class="row">
              <el-button type="success" size="large">Успешно</el-button>
              <el-button type="success">Успешно</el-button>
              <el-button type="success" size="small">Успешно</el-button>
            </el-row>

            <el-row class="row">
              <el-button type="info" size="large">В работу</el-button>
              <el-button type="info">В работу</el-button>
              <el-button type="info" size="small">В работу</el-button>
            </el-row>

            <el-row class="row">
              <el-button type="warning" size="large">На корректировку</el-button>
              <el-button type="warning">На корректировку</el-button>
              <el-button type="warning" size="small">На корректировку</el-button>
            </el-row>

            <el-row class="row">
              <el-button type="danger" size="large">Удалить</el-button>
              <el-button type="danger">Удалить</el-button>
              <el-button type="danger" size="small">Удалить</el-button>
            </el-row>
          </div>
        </article>
      </el-tab-pane>
      <el-tab-pane label="Валидация форм">
        <h1>Тестовая форма с данными из разных компонентов</h1><br />
        <form-main />

      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import formMain from '@/views/TestNadezhda/formMain.vue'

export default {
  components: {
    formMain
  }
}
</script>

<style scoped>

.column {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  padding: 20px;gap
  : 20px;
}
.row {
display: flex;
align-items: self-start;
}

</style>
