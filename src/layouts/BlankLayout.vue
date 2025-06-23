<template>
  <div class="container">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'BlankLayout'
}
</script>

<style scoped>
  .container{
    height: 100%;
    width: 100%;
    position: absolute;
  }
</style>
