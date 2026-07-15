<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Chatbot from './components/Chatbot.vue'
</script>

<template>
  <div id="app">
    <Header />
    <main id="center">
      <h1>LocalHub에 오신 걸 환영해요 🏠</h1>
      <p>동네 게시글을 함께 관리해요.</p>
    </main>
    <Footer />
    <Chatbot />
  </div>
</template>
