<script setup>
import { useRouter } from 'vue-router'
import ChatView from './views/ChatView.vue'

const router = useRouter()
</script>

<template>
  <div id="app-wrapper">
    <!-- 모든 페이지에 공통으로 보일 헤더 -->
    <Header @open-write-modal="handleOpenModal" />

    <!-- 라우팅되는 페이지 내용이 이 자리에 렌더링됩니다 -->
    <router-view />

    <!-- 모든 페이지에 공통으로 보일 푸터 -->
    <Footer />

    <!-- 글쓰기 모달 (전역으로 관리) -->
    <div v-if="isModalOpen" class="fixed inset-0 ...">
      <!-- 모달 내용 -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

const isModalOpen = ref(false);
const handleOpenModal = () => {
  isModalOpen.value = true;
};
</script>