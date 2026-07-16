<script setup>
import { useRouter } from 'vue-router'
import { ref, provide } from 'vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import Chatbot from './components/Chatbot.vue';

const router = useRouter()
const isModalOpen = ref(false);
const chatbotRef = ref(null);

const handleOpenModal = () => {
  isModalOpen.value = true;
};

// 전역에서 챗봇을 열 수 있도록 제공
const openChatbot = () => {
  if (chatbotRef.value) {
    chatbotRef.value.openChat();
  }
};

// 자식 컴포넌트에서 챗봇을 열 수 있도록 제공
provide('openChatbot', openChatbot);

</script>

<template>
  <div id="app-wrapper">
    <!-- 모든 페이지에 공통으로 보일 헤더 -->
    <Header @open-write-modal="handleOpenModal" />

    <!-- 라우팅되는 페이지 내용이 이 자리에 렌더링됩니다 -->
    <router-view />

    <!-- 모든 페이지에 공통으로 보일 푸터 -->
    <Footer />

    <!-- 챗봇 (전역) -->
    <Chatbot ref="chatbotRef" />

    <!-- 글쓰기 모달 (전역으로 관리) -->
    <div v-if="isModalOpen" class="fixed inset-0 ...">
      <!-- 모달 내용 -->
    </div>
  </div>
</template>
