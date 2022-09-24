<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <DataDisplay/>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import DataDisplay from '@/components/DataDisplay.vue'

export default {
  name: 'HomeView',
  components: {
    // HelloWorld,
    DataDisplay
  }
}
</script>
