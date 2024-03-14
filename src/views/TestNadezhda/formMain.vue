<!-- <template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
    <el-form-item label="Activity name" prop="name">
      <activity-name v-model="ruleForm.name" :input-value="inputValue" @updateInput="updateInput" />
    </el-form-item>
    <el-form-item label="Activity zone" prop="region">
      <activity-select v-model="ruleForm.region" @selected-value="selectedValue" />
    </el-form-item>
    <el-form-item label="Activity time" required>
      <el-col :span="11">
        <el-form-item prop="date1">
          <el-date-picker v-model="ruleForm.date1" type="date" placeholder="Pick a date" style="width: 100%;" />
        </el-form-item>
      </el-col>
      <el-col class="line" :span="2">-</el-col>
      <el-col :span="11">
        <el-form-item prop="date2">
          <el-time-picker v-model="ruleForm.date2" placeholder="Pick a time" style="width: 100%;" />
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item label="Instant delivery" prop="delivery">
      <el-switch v-model="ruleForm.delivery" />
    </el-form-item>
    <el-form-item label="Activity type" prop="type">
      <el-checkbox-group v-model="ruleForm.type">
        <el-checkbox label="Online activities" name="type" />
        <el-checkbox label="Promotion activities" name="type" />
        <el-checkbox label="Offline activities" name="type" />
        <el-checkbox label="Simple brand exposure" name="type" />
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="Resources" prop="resource">
      <el-radio-group v-model="ruleForm.resource">
        <el-radio label="Sponsorship" />
        <el-radio label="Venue" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="Activity form" prop="desc">
      <activity-form v-model="ruleForm.desc" @input-changed="onInputChanged" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">Create</el-button>
      <el-button @click="resetForm('ruleForm')">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import ActivityName from '@/views/TestNadezhda/activityName.vue'
import ActivitySelect from '@/views/TestNadezhda/activitySelect.vue'
import ActivityForm from '@/views/TestNadezhda/activityForm.vue'
// import multySelect from '@/views/TestNadezhda/multySelect.vue'

export default {
  components: {
    ActivityName,
    ActivitySelect,
    ActivityForm
  },
  // props: {
  //   selectedValue: {
  //     type: String,
  //     required: true,
  //     default: ''
  //   }
  // },
  data() {
    // var validateSelect = (rule, value, callback) => {
    //     if (value === '') {
    //       callback(new Error('Please input the password again'));
    //     } else if (value !== this.ruleForm.pass) {
    //       callback(new Error('Two inputs don\'t match!'));
    //     } else {
    //       callback();
    //     }
    //   };
    return {
      ruleForm: {
        inputValue: '',
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: 'Please input Activity name', trigger: 'blur' },
          { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
        ],
        region: [
          { required: true, message: 'Please select Activity zone', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: 'Please pick a date', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: 'Please pick a time', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: 'Please select at least one activity type', trigger: 'change' }
        ],
        resource: [
          { required: true, message: 'Please select activity resource', trigger: 'change' }
        ],
        desc: [
          { required: true, message: 'Please input activity form', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    updateInput(value) {
      this.inputValue = value
    },
    submitForm(formName) {
      console.log(formName)
      console.log(formName.region)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}

</script> -->
