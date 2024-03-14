<template>

  <ChildComponent @input-changed="onInputChanged" />

</template>

<script>
import ChildComponent from '@/views/TestNadezhda/selectItem.vue'
// import multySelect from '@/views/TestNadezhda/multySelect.vue'
export default {
  components: {
    ChildComponent
  },
  data: function () {
    return {
      inputValue: ''
    }
  },
  methods: {
    onInputChanged(newValue) {
      this.inputValue = newValue
    }
  }
}

</script>
