<template>
  <div>
    <div id="mainViewContainer" style="width: 100%; height: 100%">
      <div ref="space" v-html="svg" />
    </div>
    <div
      id="uaz__context-menu"
      :style="{
        top: `${position.y}px`,
        left: `${position.x}px`,
        position: 'absolute'
      }"
    >
      <div v-if="isModalOpen" id="uaz__context-menu" class="uaz__context-menu">
        <span v-if="electricgroups.length === 0" class="uaz__emaps-not-found" />

        <ul v-else class="uaz__context-menu__items">
          <li
            v-for="item in electricgroups"
            :key="item.electricGroup_id"
            class="uaz__context-menu__item"
          >
            <!-- <a
              href="#"
              class="uaz__context-menu__link"
              @click="handleClick(item)"
            >
              {{ item.electricGroup_name }}
            </a> -->

            <router-link
              class="uaz__context-menu__link"
              :to="'/emaps/preview/' + item.electricGroup_id"
            >
              {{ item.electricGroup_name }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import { fromEvent, merge } from 'rxjs'
import { withLatestFrom } from 'rxjs/operators'

const documentOb$ = fromEvent(document, 'click')
export default {
  name: 'EmapsIllustration',
  props: { svgid: { type: Number, default: 0 } },
  data() {
    return {
      electricgroups: [],
      position: {
        x: 0,
        y: 0
      },
      isModalOpen: false,
      modalData: {},
      storage: process.env.VUE_APP_BACKEND_HOST + '/storage/',
      svgPath: '', // this.storage + this.currentEmap.electricGroup_imagePreview
      svg: '',
      mainNotes: []
    }
  },
  async mounted() {
    console.log('EI.vue 73 ~ mounted')
    await this.getInfo(this.svgid)
    this.onBacklight()
  },
  methods: {
    async getInfo(id) {
      this.isLoading = false
      const res = await request({
        url: '/electricgroup/get/' + id,
        method: 'get'
      })
      if (!res) {
        console.log('GET request error')
        return
      }
      this.currentEmap = res.data

      this.svgPath = this.storage + this.currentEmap.electricGroup_imagePreview
      const svgRaw = await fetch(this.svgPath)
      this.svg = await svgRaw.text()
      this.mainNotes = res.data.notes.main
    },
    openModal(e) {
      console.log('EI.vue 100 ~ openModal:', e)
      this.isModalOpen = true
      this.position.x = e.offsetX
      this.position.y = e.offsetY + 20
    },
    async loadElectricgroup(id) {
      this.electricgroups = []
      const res = await request({
        url: '/electricgroup/',
        method: 'get',
        params: { electricGroup_ref: id }
      })
      if (!res) {
        console.log('GET request error')
        return
      }
      this.electricgroups = res.data
      console.log(
        'EI.vue 116 ~ loadElectricgroup ~ this.electricgroups:',
        this.electricgroups
      )
    },
    searchNote: function (noteId) {
      for (var m = 0; m < this.mainNotes.length; m++) {
        if (noteId == this.mainNotes[m].electricGroupNote_id) {
          return {
            note: this.mainNotes[m],
            key: m
          }
        }
      }

      return false
    },
    onBacklight() {
      console.log('EI.vue 123 ~ onBacklight ~ BEGIN')

      const elements = document.querySelectorAll('g[notetype]')
      console.log('EI.vue 126 ~ onBacklight ~ elements:', elements)

      const clicks$ = []
      for (var i = 0; i < elements.length; i++) {
        const noteid = elements[i].getAttribute('noteid').split(',')
        // console.log('EI.vue 131 ~ onBacklight ~ noteid:', noteid)
        for (var j = 0; j < noteid.length; j++) {
          var data = this.searchNote(noteid[j])
          if (data) {
            elements[i].setAttribute('style', 'cursor: pointer !important;')
            // сделать кликабельной всю зону rect
            const rect = elements[i].querySelector('rect')
            rect.setAttribute('pointer-events', 'all')

            elements[i].setAttribute(
              !data.note.isLink ? 'selected' : 'isLink',
              true
            )

            elements[i].setAttribute('electricGroupNote_id', noteid[j])

            clicks$.push(fromEvent(elements[i], 'click'))
          }
        }
      }
      console.log('EI.vue 147 ~ onBacklight ~ clicks$:', clicks$)

      // Collect all mouse click, if coords are equal - click within red square -
      const notesOb$ = merge(...clicks$)
      console.log('EI.vue 151 ~ onBacklight ~ notesOb$:', notesOb$)

      documentOb$
        .pipe(withLatestFrom(notesOb$))
        .subscribe(([documentEvent, noteEvent]) => {
          this.isModalOpen = false
          if (
            documentEvent.offsetX === noteEvent.offsetX &&
            documentEvent.offsetY === noteEvent.offsetY
          ) {
            this.openModal(noteEvent)

            let electricGroupNote_id
            if (noteEvent.target.nodeName === 'tspan') {
              electricGroupNote_id =
                noteEvent.target.parentNode.parentNode.getAttribute(
                  'electricGroupNote_id'
                )
            } else {
              electricGroupNote_id = noteEvent.target.parentNode.getAttribute(
                'electricGroupNote_id'
              )
            }
            console.log(
              'EI.vue 175 ~ onBacklight ~ electricGroupNote_id:',
              noteEvent.target.nodeName,
              electricGroupNote_id
            )

            this.loadElectricgroup(electricGroupNote_id)
          }
        })
      console.log('EI.vue 184 ~ onBacklight ~ END')
    },
    handleClick(electricGroup) {
      console.log('EI.vue 198 ~ handleClick ~ BEGIN', electricGroup)
      const stack = []
      stack.push(this.$route.params.id) // перед переходом сохранить id
      console.log('EI.vue 201 ~ handleClick ~ stack', stack)
      // const linkPath = this.storage + electricGroup.electricGroup_imagePreview
      // const href = `/emaps/preview/${electricGroup.electricGroup_id}`
      // this.$router.push(href)
      this.$router.push(`/emaps/list/`)
      // location.replace(href)
      // window.location.href = linkPath
    }
  }
}
</script>

<style>
.emaps-links {
  position: absolute;
}

.uaz__context-menu {
  display: block;
  position: fixed;
  z-index: 10;
  padding: 12px 0;
  width: auto;
  background-color: #fff;
  border: 1px solid #b8bdc0;
  box-shadow: 1px 1px 2px #cfcfcf;
}
.uaz__context-menu__items {
  list-style: none;
  margin: 0;
  padding: 0;
}
.uaz__context-menu__item {
  display: block;
  margin-bottom: 4px;
}
.uaz__context-menu__link {
  display: block;
  padding: 4px 12px;
  color: #013e2c;
  text-decoration: none !important;
}
g[isLink] path,
g[isLink] polygon,
g[isLink] rect,
g[selected] path,
g[selected] polygon,
g[selected] rect {
  stroke: red !important;
  stroke-width: 0.75 !important;
  stroke-dasharray: 0 !important;
}
</style>
