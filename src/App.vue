<script setup>
import { useRouter } from 'vue-router'
import ChatView from './views/ChatView.vue'

const router = useRouter()
</script>

<template>
  <div id="app">
    <main>
      <RouterView />
    </main>
    <ChatView />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  width: 100%;
}
</style>