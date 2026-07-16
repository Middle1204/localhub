<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-16">
    <!-- 섹션 헤더 -->
    <div class="text-center mb-12">
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-50 to-blue-50 rounded-full mb-4 border border-sky-100">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
        </span>
        <span class="text-xs font-semibold text-sky-700 uppercase tracking-wide">실시간 트래픽</span>
      </div>
      <h2 class="text-3xl sm:text-4xl font-bold text-slate-800 mb-3 text-center">
        일주일 트래픽 현황
      </h2>
      <div class="flex justify-center">
        <p class="text-slate-600 max-w-2xl text-center">
          로컬허브의 최근 7일간 페이지 조회수와 방문자 수를 투명하게 공개합니다
        </p>
      </div>
    </div>

    <!-- 메인 차트 카드 -->
    <div class="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      
      <!-- 상단 통계 바 -->
      <div class="grid grid-cols-2 divide-x divide-slate-200 bg-gradient-to-br from-slate-50 to-white border-b border-slate-200">
        <div class="p-6 text-center">
          <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">오늘 총 조회수</div>
          <div class="text-3xl font-bold text-slate-800">{{ todayPV.toLocaleString() }}</div>
          <div class="text-xs text-sky-600 font-medium mt-1">페이지뷰 (PV)</div>
        </div>
        <div class="p-6 text-center">
          <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">오늘 순 방문자</div>
          <div class="text-3xl font-bold text-sky-600">{{ todayUV.toLocaleString() }}</div>
          <div class="text-xs text-slate-600 font-medium mt-1">방문자 수 (UV)</div>
        </div>
      </div>

      <!-- 차트 영역 -->
      <div class="p-8">
        
        <!-- 범례 -->
        <div class="flex items-center justify-center gap-6 mb-8">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-gradient-to-br from-sky-400 to-sky-600"></div>
            <span class="text-sm font-medium text-slate-700">페이지 조회수</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600"></div>
            <span class="text-sm font-medium text-slate-700">순 방문자 수</span>
          </div>
        </div>

        <!-- SVG 차트 컨테이너 -->
        <div class="relative" style="height: 320px;">
          
          <!-- Y축 레이블 -->
          <div class="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs font-medium text-slate-400 pr-4">
            <span>50K</span>
            <span>40K</span>
            <span>30K</span>
            <span>20K</span>
            <span>10K</span>
            <span>0</span>
          </div>

          <!-- SVG 그래프 -->
          <div class="ml-12 h-full pb-8">
            <svg viewBox="0 0 700 280" class="w-full h-full" preserveAspectRatio="xMidYMid meet">
              
              <!-- 그리드 라인 -->
              <g class="grid-lines">
                <line v-for="i in 5" :key="i" 
                  x1="0" :y1="i * 56" 
                  x2="700" :y2="i * 56" 
                  stroke="#f1f5f9" 
                  stroke-width="1"
                  stroke-dasharray="4,4"/>
                <line x1="0" y1="280" x2="700" y2="280" stroke="#cbd5e1" stroke-width="2"/>
              </g>

              <!-- 그라데이션 정의 -->
              <defs>
                <linearGradient id="pvGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.3"/>
                  <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0"/>
                </linearGradient>
                <linearGradient id="uvGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#818cf8" stop-opacity="0.2"/>
                  <stop offset="100%" stop-color="#818cf8" stop-opacity="0"/>
                </linearGradient>
                <filter id="shadow">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
                </filter>
              </defs>

              <!-- PV 영역 -->
              <path :d="pvAreaPath" fill="url(#pvGradient)"/>
              
              <!-- UV 영역 -->
              <path :d="uvAreaPath" fill="url(#uvGradient)"/>
              
              <!-- PV 라인 -->
              <path 
                :d="pvLinePath" 
                fill="none" 
                stroke="url(#pvLineGradient)" 
                stroke-width="3" 
                stroke-linecap="round" 
                stroke-linejoin="round"
                filter="url(#shadow)"/>
              
              <!-- UV 라인 -->
              <path 
                :d="uvLinePath" 
                fill="none" 
                stroke="url(#uvLineGradient)" 
                stroke-width="2.5" 
                stroke-linecap="round" 
                stroke-linejoin="round"/>

              <!-- 라인 그라데이션 -->
              <defs>
                <linearGradient id="pvLineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#38bdf8"/>
                  <stop offset="100%" stop-color="#0ea5e9"/>
                </linearGradient>
                <linearGradient id="uvLineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#a5b4fc"/>
                  <stop offset="100%" stop-color="#818cf8"/>
                </linearGradient>
              </defs>

              <!-- 데이터 포인트 -->
              <g v-for="(day, idx) in chartData" :key="'point-' + idx">
                <!-- PV 포인트 -->
                <circle 
                  :cx="day.x" 
                  :cy="day.pvY" 
                  :r="activeIndex === idx ? 8 : 6"
                  fill="white" 
                  stroke="#0ea5e9" 
                  :stroke-width="activeIndex === idx ? 3 : 2"
                  class="cursor-pointer transition-all duration-200"
                  @mouseenter="setActiveIndex(idx)"
                  @mouseleave="resetActive"
                  filter="url(#shadow)"/>
                
                <!-- UV 포인트 -->
                <circle 
                  :cx="day.x" 
                  :cy="day.uvY" 
                  :r="activeIndex === idx ? 7 : 5"
                  fill="white" 
                  stroke="#818cf8" 
                  :stroke-width="activeIndex === idx ? 3 : 2"
                  class="cursor-pointer transition-all duration-200"
                  @mouseenter="setActiveIndex(idx)"
                  @mouseleave="resetActive"/>
              </g>
            </svg>
          </div>

          <!-- 툴팁 -->
          <transition name="fade">
            <div 
              v-if="activeData"
              class="absolute bg-slate-900 text-white rounded-xl shadow-2xl pointer-events-none z-50 px-4 py-3 min-w-[200px]"
              :style="tooltipStyle">
              <div class="text-xs font-semibold text-slate-300 mb-2">{{ activeData.date }}</div>
              <div class="space-y-2">
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-sky-400"></div>
                    <span class="text-xs text-slate-200">페이지뷰</span>
                  </div>
                  <span class="text-sm font-bold text-white">{{ activeData.pv.toLocaleString() }}</span>
                </div>
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-indigo-400"></div>
                    <span class="text-xs text-slate-200">방문자</span>
                  </div>
                  <span class="text-sm font-bold text-white">{{ activeData.uv.toLocaleString() }}</span>
                </div>
              </div>
              <!-- 툴팁 화살표 -->
              <div class="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full">
                <div class="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-slate-900"></div>
              </div>
            </div>
          </transition>

          <!-- X축 레이블 -->
          <div class="absolute bottom-0 left-12 right-0 flex justify-between text-xs font-medium text-slate-500">
            <span 
              v-for="(day, idx) in chartData" 
              :key="'label-' + idx"
              :class="{ 'text-slate-800 font-bold': activeIndex === idx }"
              class="cursor-pointer hover:text-slate-800 transition-colors"
              @mouseenter="setActiveIndex(idx)"
              @mouseleave="resetActive">
              {{ day.label }}
            </span>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';

// 차트 데이터 (7일간의 트래픽 데이터)
const chartData = ref([
  { label: '07/09', date: '7월 9일', pv: 24500, uv: 6800, x: 50, pvY: 210, uvY: 240 },
  { label: '07/10', date: '7월 10일', pv: 28900, uv: 7200, x: 150, pvY: 180, uvY: 225 },
  { label: '07/11', date: '7월 11일', pv: 32000, uv: 8500, x: 250, pvY: 155, uvY: 205 },
  { label: '07/12', date: '7월 12일', pv: 39500, uv: 10400, x: 350, pvY: 100, uvY: 165 },
  { label: '07/13', date: '7월 13일', pv: 35000, uv: 9100, x: 450, pvY: 135, uvY: 190 },
  { label: '07/14', date: '7월 14일', pv: 42100, uv: 11200, x: 550, pvY: 80, uvY: 150 },
  { label: '07/15', date: '7월 15일 (오늘)', pv: 48912, uv: 12450, x: 650, pvY: 35, uvY: 120 }
]);

// 오늘의 통계
const todayPV = computed(() => chartData.value[6].pv);
const todayUV = computed(() => chartData.value[6].uv);

// 활성 인덱스
const activeIndex = ref(null);

// 활성 데이터
const activeData = computed(() => {
  if (activeIndex.value === null) return null;
  return chartData.value[activeIndex.value];
});

// 인덱스 설정
const setActiveIndex = (idx) => {
  activeIndex.value = idx;
};

// 활성 초기화
const resetActive = () => {
  activeIndex.value = null;
};

// 툴팁 위치 계산
const tooltipStyle = computed(() => {
  if (!activeData.value) return {};
  
  const xPercent = (activeData.value.x / 700) * 100;
  const yPercent = (activeData.value.pvY / 280) * 100;
  
  return {
    left: `${xPercent}%`,
    top: `${yPercent}%`,
    transform: 'translate(-50%, calc(-100% - 16px))'
  };
});

// PV 라인 경로 (직선)
const pvLinePath = computed(() => {
  const d = chartData.value;
  return `M ${d[0].x} ${d[0].pvY} L ${d[1].x} ${d[1].pvY} L ${d[2].x} ${d[2].pvY} L ${d[3].x} ${d[3].pvY} L ${d[4].x} ${d[4].pvY} L ${d[5].x} ${d[5].pvY} L ${d[6].x} ${d[6].pvY}`;
});

// PV 영역 경로
const pvAreaPath = computed(() => {
  if (!pvLinePath.value) return '';
  const lastPoint = chartData.value[chartData.value.length - 1];
  const firstPoint = chartData.value[0];
  return `${pvLinePath.value} L ${lastPoint.x} 280 L ${firstPoint.x} 280 Z`;
});

// UV 라인 경로 (직선)
const uvLinePath = computed(() => {
  const d = chartData.value;
  return `M ${d[0].x} ${d[0].uvY} L ${d[1].x} ${d[1].uvY} L ${d[2].x} ${d[2].uvY} L ${d[3].x} ${d[3].uvY} L ${d[4].x} ${d[4].uvY} L ${d[5].x} ${d[5].uvY} L ${d[6].x} ${d[6].uvY}`;
});

// UV 영역 경로
const uvAreaPath = computed(() => {
  if (!uvLinePath.value) return '';
  const lastPoint = chartData.value[chartData.value.length - 1];
  const firstPoint = chartData.value[0];
  return `${uvLinePath.value} L ${lastPoint.x} 280 L ${firstPoint.x} 280 Z`;
});
</script>

<style scoped>
/* 툴팁 페이드 애니메이션 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 실시간 점멸 애니메이션 */
@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* SVG 요소 hover 효과 */
svg circle {
  transition: all 0.2s ease;
}

svg circle:hover {
  filter: drop-shadow(0 0 8px currentColor);
}
</style>