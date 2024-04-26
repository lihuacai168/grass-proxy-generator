<template>
  <HelloWorld v-if="false" msg="Welcome to Your Vue.js App"/>
  <GrassProxy/>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import GrassProxy from "@/components/GrassProxy.vue";
export default {
  name: 'App',
  components: {
    GrassProxy,
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
