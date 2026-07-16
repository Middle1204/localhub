<template>
  <footer class="bg-slate-900 text-slate-300 border-t border-slate-800 font-sans">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- 3-Column Grid Layout (Newsletter Section Removed) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        
        <!-- Column 1: Brand Info & Social Media -->
        <div class="space-y-5">
          <div class="flex items-center gap-2">
            <router-link to="/" class="flex items-center gap-2 group">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white">
                <div class="w-4 h-4" v-html="svgIcons.anchor"></div>
              </div>
              <span class="text-lg font-bold text-white tracking-tight group-hover:text-sky-400 transition-colors">
                local<span class="text-sky-400">hub</span>
              </span>
            </router-link>
          </div>
          
          <p class="text-xs text-slate-400 leading-relaxed max-w-sm">
            localhub 부산은 별도의 회원가입 절차 없이, 오직 신뢰할 수 있는 로컬 미식 정보만을 투명하게 공유하는 비회원 전용 맛집 매칭 커뮤니티 플랫폼입니다. 광고성 스팸 없는 청정 구역을 지향합니다.
          </p>

          <!-- Social Link Icons -->
          <div class="flex gap-3 pt-2">
            <a 
              v-for="(sns, idx) in socialLinks" 
              :key="idx"
              :href="sns.url" 
              target="_blank"
              rel="noopener noreferrer"
              class="w-8 h-8 rounded-full bg-slate-800 hover:bg-sky-500 text-slate-400 hover:text-white flex items-center justify-center transition-all"
              :title="sns.name"
            >
              <div class="w-4 h-4" v-html="sns.icon"></div>
            </a>
          </div>
        </div>

        <!-- Column 2: Board Categories Quick Navigation -->
        <div>
          <h4 class="text-white text-sm font-bold tracking-wider mb-4 uppercase flex items-center gap-1.5">
            <span class="w-1 h-3.5 bg-sky-500 rounded-full"></span>
            맛집 카테고리
          </h4>
          <ul class="space-y-2.5 text-xs text-slate-400">
            <li v-for="(category, idx) in boardCategories" :key="idx">
              <router-link 
                :to="category.path" 
                class="hover:text-sky-400 transition-colors flex items-center gap-1 group"
              >
                <span class="text-[10px] text-slate-600 group-hover:text-sky-400 transition-colors">▶</span>
                {{ category.name }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Column 3: Local Regulations & Guidelines -->
        <div>
          <h4 class="text-white text-sm font-bold tracking-wider mb-4 uppercase flex items-center gap-1.5">
            <span class="w-1 h-3.5 bg-sky-500 rounded-full"></span>
            커뮤니티 안심 정책
          </h4>
          <ul class="space-y-2.5 text-xs text-slate-400">
            <li v-for="(policy, idx) in policies" :key="idx">
              <router-link 
                :to="policy.path" 
                class="hover:text-sky-400 transition-colors flex items-center gap-1 group"
              >
                <span class="text-[10px] text-slate-600 group-hover:text-sky-400 transition-colors">▪</span>
                {{ policy.name }}
              </router-link>
            </li>
          </ul>
        </div>

      </div>
    </div>

    <!-- Lower Subfooter with Copyright & Platform Metadata -->
    <div class="border-t border-slate-800 py-6 bg-slate-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© {{ currentYear }} localhub Busan. All rights reserved. 부산 로컬 미식 네트워킹 플랫폼.</p>
        
        <div class="flex gap-6">
          <span class="flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            Open Prototype
          </span>
          <span class="flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Server: Connected
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';
import { svgIcons } from '../assets/svgGroup.js';

// Dynamic copyright year computed property
const currentYear = computed(() => new Date().getFullYear());

// Brand Social links data
const socialLinks = [
  { name: 'Instagram', url: '#', icon: svgIcons.instagram },
  { name: 'YouTube', url: '#', icon: svgIcons.youtube },
  { name: 'KakaoTalk Channel', url: '#', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M12 3c5.523 0 10 3.806 10 8.5 0 4.694-4.477 8.5-10 8.5-.93 0-1.829-.1-2.678-.285L5 21.5v-3.256C2.613 16.73 2 14.716 2 12.5 2 7.806 6.477 3 12 3zm0 2C7.582 5 4 7.91 4 11.5c0 1.815.738 3.451 1.937 4.678l.563.576v1.496l2.207-1.104.464.116C10.076 17.59 11.02 17.75 12 17.75c4.418 0 8-2.91 8-6.5S16.418 5 12 5z"/></svg>` },
  { name: 'Email', url: 'mailto:contact@localhub.kr', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm9.06 8.683L5.648 6.238 4.353 7.762l7.72 6.555 7.581-6.56-1.308-1.513-6.285 5.439z"/></svg>` }
];

// Board Categories data (to match router endpoints)
const boardCategories = [
  { name: '전체 자유 제보', path: '/board' },
  { name: '뜨끈뜨끈 국밥지도', path: '/map' },
  { name: '부산 수변 횟집 실시간 톡', path: '/board' },
  { name: '오션뷰 카페 조사단', path: '/board' },
  { name: '로컬비 AI 추천챗', path: '/ai-chat' }
];

// Community Policies & Guidelines
const policies = [
  { name: '비회원 작성글 권리 안내', path: '/policy/anonymous-rights' },
  { name: '개인정보 보호 가이드라인', path: '/policy/privacy' },
  { name: '광고/스팸 게시글 신고 센터', path: '/policy/report' },
  { name: '게시글 비밀번호 분실 가이드', path: '/policy/password-help' }
];
</script>

<style scoped>
/* Standard Tailwind class customization if required */
</style>