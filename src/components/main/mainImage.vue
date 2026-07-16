<template>
  <section class="ocean-gradient py-16 sm:py-20 border-b border-sky-100/60 relative overflow-hidden">
    <!-- Subtle background wave decorations -->
    <div class="absolute -right-10 -bottom-20 w-80 h-80 rounded-full bg-sky-200/20 blur-3xl pointer-events-none"></div>
    <div class="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-blue-100/15 blur-3xl pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      
      <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-sky-800 text-xs font-bold rounded-full uppercase tracking-wider mb-5 shadow-sm border border-sky-200/50">
        <div class="w-3.5 h-3.5 animate-pulse" v-html="svgIcons.ship"></div> Authentic Busan Spots
      </span>
      
      <h1 class="text-3xl sm:text-5xl font-black tracking-tight text-slate-800 mb-5 leading-tight sm:leading-snug">
        부산 토박이가 알려주는 <br class="sm:hidden"> 진짜 <span class="text-sky-500 underline decoration-sky-300 decoration-8 underline-offset-4">로컬 명소</span>
      </h1>
      
      <p class="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
        거추장스러운 가입 없이 자유롭게 소통하는 광고 청정 정보 플랫폼! 해운대 해수욕장부터 감천문화마을, 태종대, 영도 오션뷰 카페까지 로컬들의 생생한 제보로 만나보세요.
      </p>

      <div class="space-y-3">
        <p class="text-[11px] text-slate-400 font-bold uppercase tracking-wider">주요 테마별 빠른 탐색</p>
        <div class="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
          <!-- AI 챗봇 버튼 -->
          <button 
            @click="handleAIChatClick"
            class="px-4 py-2.5 bg-gradient-to-br from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white border border-blue-400 rounded-full text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-1.5"
            title="AI 챗봇과 대화하기"
          >
            <span>🤖</span>
            <span>AI가이드</span>
          </button>
          
          <!-- 기존 태그 버튼들 -->
          <button 
            v-for="(tag, idx) in quickTags" 
            :key="idx"
            @click="handleTagClick(tag.keyword)"
            class="px-4 py-2.5 bg-white hover:bg-sky-500 hover:text-white hover:border-sky-500 text-slate-700 border border-slate-200/80 rounded-full text-xs sm:text-sm font-semibold shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-1.5"
          >
            <span>{{ tag.emoji }}</span>
            <span>{{ tag.label }}</span>
          </button>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { svgIcons } from '../../assets/svgGroup.js';

const router = useRouter();

// 전역 챗봇 열기 함수 주입
const openChatbot = inject('openChatbot');

// Define Quick Search Tags
const quickTags = ref([
  { emoji: '�️', label: '해운대 해수욕장', keyword: '해운대' },
  { emoji: '🎭', label: '감천문화마을', keyword: '감천문화마을' },
  { emoji: '🌉', label: '광안대교 야경', keyword: '광안대교' },
  { emoji: '🏔️', label: '태종대 전망대', keyword: '태종대' },
  { emoji: '🏛️', label: '부산타워', keyword: '부산타워' }
]);

const emit = defineEmits(['select-category']);

const handleAIChatClick = () => {
  if (openChatbot) {
    openChatbot();
  }
};

const handleTagClick = (keyword) => {
  // 1. Emit a custom event if parent component wants to filter live data instantly
  emit('select-category', keyword);

  // 2. Route with search queries to board or search page
  router.push({
    path: '/search',
    query: { q: keyword }
  });
};
</script>

<style scoped>
.ocean-gradient {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 45%, #ffffff 100%);
}
</style>