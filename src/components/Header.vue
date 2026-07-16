<template>
  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-sky-100/80 shadow-sm transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-20">
        
        <div class="flex items-center gap-3">
          <router-link to="/" class="flex items-center gap-2 group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <div class="w-5 h-5" v-html="svgIcons.anchor"></div>
            </div>
            <span class="text-xl font-black tracking-tight text-slate-800 group-hover:text-sky-500 transition-colors">
              local<span class="text-sky-500">hub</span>
            </span>
          </router-link>
          
          <span class="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <span class="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>
            부산 ONLY 🌊
          </span>
        </div>

        <nav class="hidden lg:flex items-center gap-8 font-semibold text-slate-600">
          <router-link 
            to="/" 
            class="px-1 py-2 text-sm transition-all relative group"
            active-class="text-sky-500 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-sky-500 after:rounded-full"
          >
            홈
          </router-link>
          <button 
            @click="scrollToMap"
            class="hover:text-sky-500 px-1 py-2 text-sm transition-all relative cursor-pointer"
          >
            명소지도
          </button>
          <router-link 
            to="/board" 
            class="hover:text-sky-500 px-1 py-2 text-sm transition-all relative"
            active-class="text-sky-500 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-sky-500 after:rounded-full"
          >
            게시판
          </router-link>
          <router-link 
            to="/chat" 
            class="hover:text-sky-500 px-1 py-2 text-sm transition-all relative flex items-center gap-1"
            active-class="text-sky-500 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-sky-500 after:rounded-full"
          >
            AI채팅
            <span class="inline-block px-1.5 py-0.5 bg-rose-500 text-white text-[9px] font-bold rounded-md animate-bounce">AI</span>
          </router-link>
        </nav>

        <div class="hidden md:flex items-center flex-1 max-w-xs mx-8 relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div class="w-4 h-4 text-slate-400" v-html="svgIcons.search"></div>
          </div>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="해운대 밀면, 자갈치 횟집..." 
            class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm transition-all"
            @keyup.enter="handleSearch"
          />
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Notification Dropdown Toggle -->
          <div class="relative">
            <button 
              @click="toggleNotifications"
              class="p-2 text-slate-500 hover:text-sky-500 hover:bg-sky-50 rounded-full transition-all relative" 
              title="부산 로컬 새소식"
            >
              <div class="w-5 h-5" v-html="svgIcons.bell"></div>
              <span v-if="hasUnreadNotification" class="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
            
            <!-- Real-time Notifications Popup -->
            <div 
              v-show="showNotificationBox" 
              class="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-sky-100 shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div class="flex justify-between items-center pb-2 border-b border-slate-100 mb-2">
                <span class="font-bold text-xs text-slate-800">로컬 실시간 리포트 📢</span>
                <button @click="showNotificationBox = false" class="text-slate-400 hover:text-slate-600 text-xs">닫기</button>
              </div>
              <div class="space-y-3">
                <div class="text-xs text-slate-600 bg-sky-50/50 p-2.5 rounded-xl border border-sky-100/50">
                  <p class="font-bold text-sky-600">🌊 광안리 핫이슈</p>
                  <p class="mt-0.5">민락더마켓 앞 신상 횟집 실시간 웨이팅 글이 작성되었습니다.</p>
                </div>
                <div class="text-xs text-slate-600 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100/50">
                  <p class="font-bold text-amber-600">🥟 남포동 노포 투어</p>
                  <p class="mt-0.5">자갈치 곱창 골목 꿀팁 조회수가 급격히 오르고 있습니다!</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Write Button -->
          <router-link 
            to="/create"
            class="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-500 hover:to-blue-700 shadow-md shadow-sky-500/20 hover:shadow-sky-500/30 transition-all" 
            title="글쓰기"
          >
            <div class="w-3 h-3 mr-2" v-html="svgIcons.write"></div> 
            <span class="hidden sm:inline">글쓰기</span>
          </router-link>

          <!-- Mobile Menu Toggle Button -->
          <button 
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="p-2 lg:hidden text-slate-500 hover:text-sky-500 hover:bg-sky-50 rounded-full transition-all"
          >
            <i :class="isMobileMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'" class="text-xl"></i>
          </button>
        </div>

      </div>
    </div>

    <div 
      v-show="isMobileMenuOpen" 
      class="lg:hidden border-t border-sky-100 bg-white shadow-inner transition-all duration-300"
    >
      <div class="px-4 py-4 space-y-3">
        <!-- Search bar inside mobile drawer -->
        <div class="relative w-full mb-3">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div class="w-4 h-4 text-slate-400" v-html="svgIcons.search"></div>
          </div>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="부산 명소 검색..." 
            class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm"
            @keyup.enter="handleSearch"
          />
        </div>
        
        <!-- Navigation Links for Mobile -->
        <router-link 
          to="/" 
          class="block px-4 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-500"
          active-class="bg-sky-50/50 text-sky-500 font-bold"
          @click="isMobileMenuOpen = false"
        >
          홈
        </router-link>
        <button
          @click="scrollToMap"
          class="block w-full text-left px-4 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-500 cursor-pointer"
        >
          명소지도
        </button>
        <router-link 
          to="/board" 
          class="block px-4 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-500"
          active-class="bg-sky-50/50 text-sky-500 font-bold"
          @click="isMobileMenuOpen = false"
        >
          게시판
        </router-link>
        <router-link 
          to="/chat" 
          class="block px-4 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-500 flex items-center justify-between"
          active-class="bg-sky-50/50 text-sky-500 font-bold"
          @click="isMobileMenuOpen = false"
        >
          <span>AI채팅</span>
          <span class="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full animate-pulse">LIVE</span>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { svgIcons } from '../assets/svgGroup.js';

const router = useRouter();
const route = useRoute();
const searchQuery = ref('');
const isMobileMenuOpen = ref(false);
const showNotificationBox = ref(false);
const hasUnreadNotification = ref(true);

// Triggering search and routing to search view
const handleSearch = () => {
  if (!searchQuery.value.trim()) return;
  
  router.push({
    path: '/search',
    query: { q: searchQuery.value.trim() }
  });
  
  searchQuery.value = '';
  isMobileMenuOpen.value = false;
};

// Controlling notification panel behavior
const toggleNotifications = () => {
  showNotificationBox.value = !showNotificationBox.value;
  if (showNotificationBox.value) {
    hasUnreadNotification.value = false; // Mark as read upon open
  }
};

// Scroll to MapPreview component
const scrollToMap = () => {
  isMobileMenuOpen.value = false;
  
  // If not on home page, navigate to home first
  if (route.path !== '/') {
    router.push('/').then(() => {
      // Wait for DOM to fully render
      nextTick(() => {
        setTimeout(() => {
          scrollToMapElement();
        }, 500);
      });
    });
  } else {
    scrollToMapElement();
  }
};

const scrollToMapElement = () => {
  // Find MapPreview component by looking for an element with specific class or id
  const mapElement = document.querySelector('[data-map-preview]');
  
  if (mapElement) {
    // Get header height for offset
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 0;
    
    // Calculate position with offset
    const elementPosition = mapElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  } else {
    console.warn('MapPreview element not found');
  }
};
</script>

<style scoped>
/* Custom animations or local overrides if necessary */
.animate-ping {
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}
@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>