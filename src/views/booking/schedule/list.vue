<template>
  <div v-if="dealerID" class="app-container booking-settings">
    <el-card shadow="always">
      <el-row style="padding-bottom: 20px">
        <el-col :span="4"><p class="dealer-title">ID дилера</p></el-col>
        <el-col :span="20">
          <p>{{ dealerID }}</p>
        </el-col>
      </el-row>
      <el-row style="padding-bottom: 20px">
        <el-col :span="4"><p class="dealer-title">Дата</p></el-col>
        <el-col :span="20">
          <el-date-picker
            width="4003"
            v-model="bookingDate"
            value-format="yyyy-MM-dd"
            @change="getSchedule"
          />
        </el-col>
      </el-row>
      <el-table :data="dealerSchedule2" style="width: 100%">
        <el-table-column label="Время" width="180">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span style="margin-left: 10px">{{ scope.row.slotStart }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-for="h in headTable"
          :key="h"
          :label="'Пост ' + (+h + 1).toString()"
        >
          <template slot-scope="scope">
            <!-- <el-tag v-if="scope.row.status[+h] == 'busy'"> -->
            <el-tag @click="clickTag(scope.$index, scope.row, h)">
              {{ scope.row.status[+h].status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <schedule-dialog
      :open.sync="isModalOpen"
      :data.sync="modalData"
      @saveData="saveModalData"
    />
  </div>
  <div v-else class="app-container">
    Учетная запись не привязана. Обратитесь в тех. поддержку support@elis.uaz.ru
  </div>
</template>
<script>
import store from '@/store'
import request from '@/utils/request'
import ScheduleDialog from '@/components/Dialog/ScheduleDialog.vue'
export default {
  components: { ScheduleDialog },
  props: {},
  data() {
    return {
      dealerID: '',
      dealerSchedule: [],
      dealerSchedule2: [],
      headTable: [],
      isModalOpen: false,
      bookingDate: '',
      modalData: {}
    }
  },
  computed: {},
  created() {
    this.dealerID = store.state.user.dealer_id
  },

  methods: {
    async getSchedule() {
      this.headTable = []
      this.dealerSchedule = await request({
        url: '/booking/',
        method: 'get',
        params: {
          dealer_id: this.dealerID,
          date: this.bookingDate
        }
      })
      // this.dealerSchedule = [
      //   { dealer_id: 24, numberPost: 1, slotStart: '08:00', status: 'empty' },
      //   { dealer_id: 24, numberPost: 1, slotStart: '09:00', status: 'busy' },
      //   { dealer_id: 24, numberPost: 2, slotStart: '08:00', status: 'empty' },
      //   { dealer_id: 24, numberPost: 2, slotStart: '09:00', status: 'empty' },
      //   { dealer_id: 24, numberPost: 3, slotStart: '08:00', status: 'busy' },
      //   { dealer_id: 24, numberPost: 3, slotStart: '09:00', status: 'empty' }
      // ]
      const lengthPosts =
        this.dealerSchedule[this.dealerSchedule.length - 1].numberPost
      // this.headTable = ['0', '1']
      for (let i = 0; i < lengthPosts; i++) {
        this.headTable.push(i.toString())
      }
      // const slotTime = ['08:00', '09:00']
      const slotTime = [
        ...new Set(this.dealerSchedule.map((item) => item.slotStart))
      ]
      slotTime.forEach((item) => {
        const o = {}
        o.dealer_id = this.dealerID
        o.slotStart = item
        o.status = []
        this.dealerSchedule
          .filter((el) => el.slotStart === o.slotStart)
          .forEach((el) => {
            const o2 = {}
            o2.status = el.status
            o2.booking_id = el.booking_id
            o.status.push(o2)
          })
        this.dealerSchedule2.push(o)
      })
    },
    clickTag(idx, row, status_idx) {
      this.modalData.dealer_id = row.dealer_id
      this.modalData.numberPost = +status_idx + 1
      this.modalData.slotStart = row.slotStart
      this.modalData.date = this.bookingDate
      this.modalData.booking_id = row.status[status_idx].booking_id
      this.modalData.status = row.status[status_idx].status
      this.isModalOpen = true
    },
    saveModalData() {
      console.log('🚀 ~ file: list.vue:105 ~ saveModalData ~ saveModalData:')
    }
  }
}
</script>
