import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    name: 'Login',
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/request',
    children: [
      {
        path: 'request',
        component: () => import('@/views/request/list'),
        name: 'Request',
        meta: {
          title: 'Заявки',
          icon: 'dashboard',
          affix: true,
          build: 'development',
          roles: ['urrd', 'dpo', 'admin', 'translator', 'dialer']
        }
      }
    ]
  },
  {
    path: '/flowchartsstructure',
    component: Layout,
    redirect: '/flowchartsstructure',
    children: [
      {
        path: 'flowchartsstructure',
        component: () => import('@/views/flowchartsstructure/list'),
        name: 'Flowchartsstructure',
        meta: {
          title: 'Редактор иллюстраций',
          icon: 'list',
          noCache: true,
          build: 'development'
        }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // service - запись на сервис
  {
    path: '/booking',
    component: Layout,
    redirect: 'noRedirect',
    name: 'booking',
    meta: {
      title: 'Запись на сервис',
      icon: 'el-icon-date',
      build: 'development',
      roles: ['admin', 'dialer']
    },
    children: [
      {
        path: '/settings',
        component: () => import('@/views/booking/settings/list'),
        name: 'settings',
        meta: {
          title: 'Настройки',
          icon: 'el-icon-setting',
          roles: ['urrd', 'dialer']
        }
      },
      {
        path: '/sync',
        component: () => import('@/views/booking/sync/list'),
        name: 'sync',
        meta: {
          title: 'История синхронизации',
          icon: 'el-icon-refresh',
          roles: ['urrd', 'dialer']
        }
      },
      {
        path: '/schedule',
        component: () => import('@/views/booking/schedule/list'),
        name: 'schedule',
        meta: {
          title: 'График',
          icon: 'el-icon-tickets',
          roles: ['urrd', 'dialer']
        }
      }
    ]
  },

  // labortime
  {
    path: '/labortime',
    component: Layout,
    // redirect: '/labortime/upload',
    redirect: 'noRedirect',
    name: 'labortime',
    meta: {
      title: 'Нормативы времени',
      icon: 'el-icon-s-help',
      roles: ['urrd', 'dpo', 'admin']
    },
    children: [
      {
        path: '/labortime/upload',
        component: () => import('@/views/labortime/upload/list'),
        name: 'laborTimeUpload',
        meta: {
          title: 'Импорт файлов',
          icon: 'el-icon-download',
          roles: ['urrd']
        }
      },
      {
        path: '/labortime/upload/edit/',
        redirect: '/labortime/upload',
        component: () => import('@/views/labortime/upload/edit'),
        meta: { title: 'Импорт файлов', roles: ['urrd'] },
        hidden: true,
        children: [
          {
            path: '/labortime/upload/edit/:id(\\d+)?',
            meta: {
              title: 'Создание/загрузка файла XLS',
              noCache: true,
              activeMenu: '/labortime/upload',
              roles: ['urrd']
            },
            hidden: true
          }
        ]
      },
      {
        path: '/labortime/groupmodification',
        component: () => import('@/views/labortime/groupmodification/list'),
        name: 'groupmodificationlist',
        meta: { title: 'Группы модификаций', icon: 'tree', roles: ['urrd'] }
      },
      {
        path: '',
        redirect: '/labortime/groupmodification',
        component: () => import('@/views/labortime/groupmodification/edit'),
        meta: { title: 'Группы модификаций', roles: ['urrd'] },
        hidden: true,
        children: [
          {
            path: '/labortime/groupmodification/edit/:id(\\d+)',
            meta: {
              title: 'Редактирование НЧ для группы модификаций',
              noCache: true,
              activeMenu: '/labortime/groupmodification',
              roles: ['urrd']
            },
            hidden: true
          }
        ]
      },
      {
        path: '/labortime/modification',
        component: () => import('@/views/labortime/modification/list'),
        name: 'modificationlist',
        meta: { title: 'Модификации', icon: 'el-icon-truck', roles: ['urrd'] }
      },
      {
        path: '/labortime/structure',
        component: () => import('@/views/labortime/structure/list'),
        name: 'StructureLaborTimeList',
        meta: {
          title: 'Структура нормативов времени',
          icon: 'el-icon-truck',
          roles: ['urrd']
        }
      },
      {
        path: 'external-link',
        component: Layout,
        children: [
          {
            path: 'https://v2.elis.uaz.ru/storage/labortime/bBXGPc9FWEJUDI6exmQxyR495XcsuxzMXdFkczdO.xlsx',
            meta: {
              title: 'Экспорт файла XLS',
              icon: 'el-icon-upload2',
              roles: ['urrd']
            }
          }
        ]
      },
      {
        path: '/labortime/faq',
        component: () => import('@/views/labortime/faq'),
        meta: { title: 'FAQ', icon: 'el-icon-question', roles: ['urrd'] }
      }
    ]
  },

  // товарный портфель
  {
    path: '/product-portfolio',
    component: Layout,
    redirect: 'noRedirect',
    name: 'productportfolio',
    meta: {
      title: 'Товарный портфель',
      icon: 'el-icon-shopping-bag-1',
      build: 'development',
      roles: ['urrd', 'dpo', 'admin']
    },
    children: [
      {
        path: '/analysis-of-blocked',
        component: () =>
          import('@/views/productportfolio/analysisofblocked/list'),
        name: 'analysisofblocked',
        meta: {
          title: 'Анализ заблокированных',
          icon: 'el-icon-pie-chart',
          roles: ['urrd', 'dpo', 'admin']
        }
      },
      {
        path: '/analysis-of-blocked/upload-hide-part',
        component: () =>
          import('@/views/productportfolio/analysisofblocked/hidePart'),
        name: 'analysisofblocked',
        meta: {
          title: 'Скрытие артикулов из XLS',
          icon: 'el-icon-document-delete',
          roles: ['admin']
        }
      }
    ]
  },

  // manual
  {
    path: '/manual',
    component: Layout,
    // redirect: '/manual/flowchart',
    redirect: 'noRedirect',
    name: 'manual',
    meta: {
      title: 'Руководство по ремонту',
      icon: 'el-icon-s-help',
      build: 'development',
      roles: ['urrd', 'dpo', 'translator']
    },
    children: [
      {
        path: '/action',
        component: () => import('@/views/action/list'),
        name: 'action',
        meta: {
          title: 'Типовые действия',
          icon: 'nested',
          roles: ['urrd', 'translator']
        }
      },
      {
        path: '/tools',
        component: () => import('@/views/tools/list'),
        name: 'tools',
        meta: {
          title: 'Оборудование и инструменты',
          icon: 'list',
          roles: ['urrd', 'translator']
        }
      },
      {
        path: '/generaltools',
        component: () => import('@/views/generaltools/list'),
        name: 'generaltools',
        meta: {
          title: 'Общие инструменты',
          icon: 'list',
          roles: ['urrd', 'translator']
        }
      },
      {
        path: '/specialtools',
        component: () => import('@/views/specialtools/list'),
        name: 'specialtools',
        meta: {
          title: 'Специнструменты',
          icon: 'list',
          roles: ['urrd', 'translator']
        }
      },
      {
        path: '/materials',
        component: () => import('@/views/materials/list'),
        name: 'materials',
        meta: {
          title: 'Материалы',
          icon: 'list',
          roles: ['urrd', 'translator']
        }
      },
      {
        path: '/tables',
        component: () => import('@/views/tables/list'),
        name: 'tables',
        meta: { title: 'Таблицы', icon: 'list', roles: ['urrd', 'translator'] }
      },
      {
        path: '/notifications',
        component: () => import('@/views/notifications/list'),
        name: 'notifications',
        meta: {
          title: 'Уведомления и предупреждения',
          icon: 'list',
          roles: ['urrd', 'translator']
        }
      },
      {
        path: '/symbols',
        component: () => import('@/views/symbols/list'),
        name: 'symbols',
        meta: { title: 'Символы', icon: 'list', roles: ['urrd'] }
      },
      {
        path: '/operations',
        component: () => import('@/views/operations/list'),
        name: 'operations',
        meta: { title: 'Операции', icon: 'list', roles: ['urrd', 'translator'] }
      },
      {
        path: '/operations/edit',
        redirect: '/operations',
        component: () => import('@/views/operations/edit'),
        meta: { title: 'Операции', roles: ['urrd', 'translator'] },
        hidden: true,
        children: [
          {
            path: '/operations/edit/:id(\\d+)?',
            meta: {
              title: 'Создание/редактирование операции',
              noCache: true,
              activeMenu: '/operations',
              roles: ['urrd', 'translator']
            },
            hidden: true
          }
        ]
      },
      {
        path: '/operations/toastEditor',
        redirect: '/operations',
        component: () => import('@/views/operations/toastEditor'),
        meta: { title: 'Операции', roles: ['urrd'] },
        hidden: true,
        children: [
          {
            path: '/toast',
            meta: {
              title: 'Редактор иллюстрации',
              noCache: true,
              activeMenu: '/operations',
              roles: ['urrd']
            },
            hidden: true
          }
        ]
      },
      {
        path: '/flowchart',
        component: () => import('@/views/flowchart/list'),
        name: 'flowchart',
        meta: { title: 'Техкарты', icon: 'list', roles: ['urrd', 'translator'] }
      },
      {
        path: '/flowchart/edit',
        redirect: '/flowchart',
        component: () => import('@/views/flowchart/editFlowchart'),
        meta: { title: 'Техкарты', roles: ['urrd'] },
        hidden: true,
        children: [
          {
            path: '/flowchart/edit/:id(\\d+)?',
            meta: {
              title: 'Создание/редактирование техкарт',
              noCache: true,
              activeMenu: '/flowchart',
              roles: ['urrd', 'translator']
            },
            hidden: true
          }
        ]
      },
      {
        path: '/flowchart/bidedit/:id',
        component: () => import('@/views/flowchart/bid'),
        meta: {
          title: 'Заявка на изменение ТК',
          icon: 'edit',
          build: 'development',
          roles: ['urrd', 'dpo', 'admin', 'translator']
        },
        hidden: true
      },
      {
        path: '/descriptionworkunit',
        component: () => import('@/views/descriptionworkunit/list'),
        name: 'descriptionworkunit',
        meta: { title: 'Описания работы узлов', icon: 'list', roles: ['urrd'] }
      }
    ]
  },
  // emaps
  {
    path: '/emaps',
    component: Layout,
    redirect: 'noRedirect',
    name: 'emaps',
    meta: {
      title: 'Электросхемы',
      icon: 'el-icon-s-help',
      build: 'development',
      roles: ['urrd', 'dpo', 'translator']
    },
    children: [
      {
        path: '/emaps/list',
        component: () => import('@/views/emaps/list'),
        name: 'list',
        meta: {
          title: 'Cписок электросхем',
          icon: 'nested',
          roles: ['urrd', 'translator']
        }
      },
      {
        path: '/emaps/edit',
        component: () => import('@/views/emaps/edit/index.vue'),
        name: 'edit',
        meta: {
          title: 'Добавить локатор компонентов',
          icon: 'nested',
          roles: ['urrd', 'translator']
        }
      },
      {
        path: '/emaps/preview',
        redirect: '/emaps',
        component: () => import('@/views/emaps/preview'),
        meta: { roles: ['urrd'] },
        hidden: true,
        children: [
          {
            path: '/emaps/preview/:id(\\d+)?',
            meta: {
              title: 'Просмотр электросхем',
              noCache: true,
              activeMenu: '/emaps',
              roles: ['urrd', 'translator']
            },
            hidden: true
          }
        ]
      },
      {
        path: '/emaps/group',
        component: () => import('@/views/emaps/group/list'),
        name: 'group',
        meta: {
          title: 'Изменить список групп эл.схем',
          icon: 'nested',
          roles: ['urrd', 'translator']
        }
      }
    ]
  },
  // directory
  {
    path: '/directory',
    component: Layout,
    redirect: 'noRedirect',
    name: 'directory',
    meta: {
      title: 'Справочники',
      icon: 'el-icon-s-help',
      roles: ['urrd', 'dpo', 'admin']
    },
    children: [
      {
        path: '/directory/replacement',
        component: () => import('@/views/directory/replacement/list'),
        name: 'replacement',
        meta: {
          title: 'Взаимозамены',
          icon: 'el-icon-s-help',
          build: 'development',
          roles: ['urrd', 'dpo', 'admin']
        }
      },
      {
        path: '/directory/feedback', //
        component: () => import('@/views/directory/feedback/list'),
        name: 'feedback',
        meta: {
          title: 'Обратная связь',
          icon: 'el-icon-s-help',
          roles: ['admin']
        }
      },
      {
        path: '/user/list',
        component: () => import('@/views/user/list'),
        name: 'userList',
        meta: {
          title: 'Список пользователей',
          build: 'development',
          icon: 'el-icon-s-help',
          roles: ['dpo', 'admin']
        }
      },
      {
        path: '/user/edit',
        redirect: '/user/list',
        component: () => import('@/views/user/edit'),
        meta: { title: 'Список пользователей', roles: ['dpo', 'admin'] },
        hidden: true,
        children: [
          {
            path: '/user/edit/:id(\\d+)?',
            meta: {
              title: 'Создание/редактирование пользователя',
              activeMenu: '/user/list',
              roles: ['dpo', 'admin']
            },
            hidden: true
          }
        ]
      },
      {
        path: '/user/editRequest',
        redirect: '/dealer/request',
        component: () => import('@/views/user/editRequest'),
        meta: {
          title: 'Заявки на регистрацию',
          roles: ['dpo', 'admin', 'urrd']
        },
        hidden: true,
        children: [
          {
            path: '/user/editRequest/:id(\\d+)?',
            meta: {
              title: 'Создание/редактирование заявки на регистрацию',
              activeMenu: '/dealer/request',
              roles: ['dpo', 'admin', 'urrd']
            },
            hidden: true
          }
        ]
      }
    ]
  },
  // dealer
  {
    path: '/dealer',
    component: Layout,
    redirect: 'noRedirect',
    name: 'dealer',
    meta: {
      title: 'Дилеры',
      icon: 'el-icon-s-help',
      roles: ['urrd', 'dpo', 'admin']
    },
    children: [
      {
        path: '/dealer/list',
        component: () => import('@/views/dealer/list'),
        name: 'dealerList',
        meta: {
          title: 'Список дилеров',
          icon: 'el-icon-s-help',
          roles: ['urrd', 'dpo', 'admin']
        }
      },
      {
        path: '/dealer/edit',
        redirect: '/dealer/list',
        component: () => import('@/views/dealer/edit'),
        meta: { title: 'Список дилеров', roles: ['urrd', 'dpo', 'admin'] },
        hidden: true,
        children: [
          {
            path: '/dealer/edit/:id(\\d+)?',
            meta: {
              title: 'Редактирование дилера',
              activeMenu: '/dealer/list',
              roles: ['urrd', 'dpo', 'admin']
            },
            hidden: true
          }
        ]
      },
      {
        path: '/position/list',
        component: () => import('@/views/position/list'),
        name: 'positionList',
        meta: {
          title: 'Список должностей',
          icon: 'el-icon-s-help',
          roles: ['urrd', 'dpo', 'admin']
        }
      },
      {
        path: '/dealer/activity', //
        component: () => import('@/views/directory/activity/list'),
        name: 'activity',
        meta: {
          title: 'Активность',
          icon: 'el-icon-s-help',
          roles: ['urrd', 'dpo', 'admin']
        }
      },
      {
        path: '/dealer/request',
        component: () => import('@/views/dealer/request'),
        name: 'dealerListRequest',
        meta: {
          title: 'Заявки на регистрацию',
          icon: 'el-icon-s-help',
          roles: ['urrd', 'dpo', 'admin']
        }
      }
    ]
  },
  // message
  {
    path: '/message',
    component: Layout,
    redirect: 'noRedirect',
    name: 'message',
    meta: {
      title: 'Уведомления',
      icon: 'el-icon-s-help',
      roles: ['urrd', 'dpo', 'admin']
    },
    children: [
      {
        path: '/message/list',
        component: () => import('@/views/message/list'),
        name: 'messageList',
        meta: {
          title: 'Список уведомлений',
          icon: 'el-icon-s-help',
          roles: ['urrd', 'dpo', 'admin']
        }
      },
      {
        path: '/message/list',
        redirect: '/message/list',
        component: () => import('@/views/message/edit'),
        meta: { title: 'Список уведомлений' },
        hidden: true,
        children: [
          {
            path: '/message/edit/:id(\\d+)?',
            meta: {
              title: 'Редактирование уведомления',
              activeMenu: '/message/list',
              roles: ['urrd', 'dpo', 'admin']
            },
            hidden: true
          }
        ]
      }
    ]
  },

  {
    path: '/report',
    component: Layout,
    redirect: 'noRedirect',
    name: 'report',
    meta: {
      title: 'Отчёты',
      icon: 'el-icon-s-help',
      roles: ['urrd', 'dpo', 'admin']
    },
    children: [
      {
        path: '/report/price/availability',
        component: () => import('@/views/report/price/availability'),
        name: 'priceAvailability',
        meta: {
          title: 'Наличие в прайсе',
          icon: 'nested',
          roles: ['urrd', 'dpo', 'admin']
        }
      },
      {
        path: '/report/price/declinedinfo',
        component: () => import('@/views/report/price/declinedinfo'),
        name: 'declinedInfo',
        meta: {
          title: 'Анализ отклоненных',
          icon: 'nested',
          build: 'development',
          roles: ['urrd', 'dpo', 'admin']
        }
      },
      {
        path: '/report/price/onecmodsstats',
        component: () => import('@/views/report/price/onecmodsstats'),
        name: 'onecmodsstats',
        meta: {
          title: 'Анализ автопарка',
          icon: 'nested',
          roles: ['admin']
        }
      },
      {
        path: '/system/spec/updatepartname',
        component: () => import('@/views/system/spec/updatepartname'),
        name: 'specUpdateName',
        meta: {
          title: 'Обновить наименования из прайса',
          icon: 'nested',
          roles: ['urrd', 'dpo', 'admin']
        }
      },
      {
        path: '/report/statswork',
        component: () => import('@/views/report/statswork'),
        name: 'statsWork',
        meta: {
          title: 'Отчёт по работам за период',
          icon: 'nested',
          roles: ['urrd', 'dpo', 'admin']
        }
      }
    ]
  },
  // diagnostic
  {
    path: '/diagnostic/operation',
    component: Layout,
    redirect: 'noRedirect',
    name: 'diagnostic_operations',
    meta: {
      title: 'Диагностика',
      icon: 'el-icon-s-help',
      build: 'development',
      roles: ['urrd']
    },
    children: [
      {
        path: '/diagnostic/operation/list',
        component: () => import('@/views/diagnostic/operation/list'),
        name: 'diagnosticOperationList',
        meta: {
          title: 'Справочник операций',
          icon: 'el-icon-s-help',
          roles: ['urrd']
        }
      },
      {
        path: '/diagnostic/operation/list/',
        redirect: '/diagnostic/operation/list',
        component: () => import('@/views/diagnostic/operation/edit'),
        meta: { title: 'Справочник операций', roles: ['urrd'] },
        hidden: true,
        children: [
          {
            path: '/diagnostic/operation/edit/:id(\\d+)?',
            meta: {
              title: 'Редактирование операции диагностики',
              activeMenu: '/diagnostic/operation/list',
              roles: ['urrd']
            },
            hidden: true
          }
        ]
      },
      {
        path: '/diagnostic/operation/edit/2',
        component: () => import('@/views/diagnostic/operation/list'),
        name: 'diagnosticOperationList',
        meta: {
          title: 'Дубль',
          icon: 'el-icon-s-help'
        }
      },
      {
        path: '/diagnostic/operation/edit/3',
        redirect: '/diagnostic/operation/list',
        component: () => import('@/views/diagnostic/operation/edit'),
        meta: { title: 'Справочник операций', roles: ['urrd'] },
        hidden: true,
        children: [
          {
            path: '/diagnostic/operation/edit/:id(\\d+)?',
            meta: {
              title: 'Редактирование операции диагностики',
              activeMenu: '/diagnostic/operation/list',
              roles: ['urrd']
            },
            hidden: true
          }
        ]
      }
    ]
  },
  // specification
  {
    path: '/specification',
    component: Layout,
    name: 'specification',
    meta: {
      title: 'Спецификации',
      icon: 'el-icon-s-help',
      build: 'development',
      roles: ['urrd', 'dpo', 'admin']
    },
    children: [
      {
        path: '/specificationList',
        component: () => import('@/views/specification/list'),
        name: 'specificationList',
        meta: {
          title: 'Спецификации',
          icon: 'el-icon-s-help',
          build: 'development',
          roles: ['urrd', 'dpo', 'admin']
        }
      },
      {
        path: '/specification/edit/:id(\\d+)?',
        component: () => import('@/views/specification/edit'),
        name: 'specificationEdit',
        meta: {
          title: 'Создание/загрузка файлов со спецификацией и структурой',
          noCache: true,
          activeMenu: '/specification',
          roles: ['urrd', 'dpo', 'admin']
        },
        hidden: true
      }
    ]
  },

  // example
  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: 'Example',
      icon: 'el-icon-s-help',
      build: 'development'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: { title: 'Create Article', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: {
          title: 'Edit Article',
          noCache: true,
          activeMenu: '/example/list'
        },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: { title: 'Article List', icon: 'list' }
      },
      {
        path: 'test/:id(\\d+)',
        component: () => import('@/views/example/testDealerEdit'),
        name: 'testDealerEdit',
        meta: { title: 'Test', icon: 'edit' }
      }
    ]
  },
  // permission
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin', 'editor'],
      build: 'development' // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'Page Permission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'Role Permission',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: 'Icons', icon: 'icon', noCache: true }
      }
    ],
    meta: {
      build: 'development'
    }
  },

  /** when your routing map is too long, you can split it into small modules **/
  componentsRouter,
  chartsRouter,
  tableRouter,

  {
    path: '/tab',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/tab/index'),
        name: 'Tab',
        meta: { title: 'Tab', icon: 'tab' }
      }
    ],
    meta: {
      build: 'development'
    }
  },

  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: 'Error Pages',
      icon: '404',
      build: 'development',
      roles: ['urrd', 'dpo', 'admin']
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true, roles: ['urrd', 'dpo', 'admin'] }
      }
    ]
  },

  {
    path: '/error-log',
    component: Layout,
    children: [
      {
        path: 'log',
        component: () => import('@/views/error-log/index'),
        name: 'ErrorLog',
        meta: { title: 'Error Log', icon: 'bug', build: 'development' }
      }
    ]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'Excel',
      icon: 'excel',
      build: 'development'
    },
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/export-excel'),
        name: 'ExportExcel',
        meta: { title: 'Export Excel' }
      },
      {
        path: 'export-selected-excel',
        component: () => import('@/views/excel/select-excel'),
        name: 'SelectExcel',
        meta: { title: 'Export Selected' }
      },
      {
        path: 'export-merge-header',
        component: () => import('@/views/excel/merge-header'),
        name: 'MergeHeader',
        meta: { title: 'Merge Header' }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/upload-excel'),
        name: 'UploadExcel',
        meta: { title: 'Upload Excel' }
      }
    ]
  },

  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    alwaysShow: true,
    name: 'Zip',
    meta: { title: 'Zip', icon: 'zip', build: 'development' },
    children: [
      {
        path: 'download',
        component: () => import('@/views/zip/index'),
        name: 'ExportZip',
        meta: { title: 'Export Zip' }
      }
    ]
  },

  {
    path: '/pdf',
    component: Layout,
    redirect: '/pdf/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/pdf/index'),
        name: 'PDF',
        meta: { title: 'PDF', icon: 'pdf', build: 'development' }
      }
    ]
  },
  {
    path: '/pdf/download',
    component: () => import('@/views/pdf/download'),
    hidden: true
  },

  {
    path: '/theme',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/theme/index'),
        name: 'Theme',
        meta: { title: 'Theme', icon: 'theme', build: 'development' }
      }
    ]
  },

  {
    path: '/clipboard',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/clipboard/index'),
        name: 'ClipboardDemo',
        meta: { title: 'Clipboard', icon: 'clipboard' }
      }
    ],
    meta: {
      build: 'development'
    }
  },
  {
    path: '/test-nadezhda',
    component: Layout,
    // redirect: '/manual/flowchart',
    redirect: 'noRedirect',
    name: 'test-nadezhda',
    meta: {
      title: 'Тест Надежда',
      icon: 'el-icon-s-help',
      build: 'development',
      roles: ['urrd', 'dpo']
    },
    children: [
      {
        path: '/test-nadezhda',
        component: () => import('@/views/TestNadezhda/pageNadezhda'),
        name: 'buttonNadezhda',
        meta: {
          title: 'Тест Надежда',
          icon: 'nested',
          roles: ['urrd', 'dpo', 'admin']
        }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: [...constantRoutes, ...asyncRoutes]
  })

const router = createRouter()
console.log('router.js 1233 ~ router:', router)

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
