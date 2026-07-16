<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 mb-12">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
      
      <!-- Left Info Side -->
      <div class="lg:col-span-1">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 text-xs font-semibold rounded-full mb-3 border border-sky-100">
          <span class="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
          Live Traffic
        </span>
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
          투명하게 공개하는 <br class="hidden sm:inline"> 로컬허브 트래픽 트렌드
        </h2>
        <p class="text-slate-600 text-sm leading-relaxed mb-8">
          localhub의 일일 트래픽 현황을 투명하게 공개합니다.
        </p>
        
        <!-- Grid Counters -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white p-5 rounded-lg border border-slate-200">
            <span class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mb-2">오늘 조회수</span>
            <span class="text-2xl font-bold text-slate-800 block">48,912회</span>
          </div>
          <div class="bg-white p-5 rounded-lg border border-slate-200">
            <span class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mb-2">오늘 방문수</span>
            <span class="text-2xl font-bold text-sky-500 block">12,450회</span>
          </div>
        </div>
      </div>

      <!-- Right Graphic Side (SVG Chart) -->
      <div class="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-6 sm:p-8">
        
        <!-- Chart Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 class="text-sm sm:text-base font-bold text-slate-800 mb-1">일별 트래픽 추이 (최근 7일)</h3>
            <p class="text-[11px] text-slate-500">각 좌표 점에 마우스를 올려 상세 데이터를 확인하세요.</p>
          </div>
          
          <!-- Legend indicators -->
          <div class="flex gap-4 text-[11px] font-medium text-slate-600">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 bg-sky-500 rounded-full"></span>
              <span>페이지 조회수 (PV)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 bg-indigo-400 rounded-full"></span>
              <span>순 방문수 (UV)</span>
            </div>
          </div>
        </div>

        <!-- Interactive Chart Body -->
        <div class="w-full relative h-[250px] overflow-visible select-none">
          <!-- Y-Axis Labels -->
          <div class="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] font-medium text-slate-400 pointer-events-none -translate-x-1">
            <span>50K</span>
            <span>37.5K</span>
            <span>25K</span>
            <span>12.5K</span>
            <span>0</span>
          </div>

          <svg class="w-full h-full pl-10" viewBox="0 0 700 250" preserveAspectRatio="none">
            <!-- Grid Lines -->
            <line x1="0" y1="50" x2="700" y2="50" stroke="#e2e8f0" stroke-width="1"></line>
            <line x1="0" y1="110" x2="700" y2="110" stroke="#e2e8f0" stroke-width="1"></line>
            <line x1="0" y1="170" x2="700" y2="170" stroke="#e2e8f0" stroke-width="1"></line>
            <line x1="0" y1="230" x2="700" y2="230" stroke="#cbd5e1" stroke-width="1.5"></line>

            <!-- Gradient definitions -->
            <defs>
              <linearGradient id="pv-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.2"></stop>
                <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0.0"></stop>
              </linearGradient>
              <linearGradient id="uv-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#818cf8" stop-opacity="0.15"></stop>
                <stop offset="100%" stop-color="#818cf8" stop-opacity="0.0"></stop>
              </linearGradient>
            </defs>

            <!-- Area fills -->
            <path :d="pvAreaPath" fill="url(#pv-grad)"></path>
            <path :d="uvAreaPath" fill="url(#uv-grad)"></path>
            
            <!-- Lines -->
            <path :d="pvLinePath" fill="none" stroke="#0ea5e9" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path :d="uvLinePath" fill="none" stroke="#818cf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>

            <!-- Node circles using ellipse to maintain circular appearance when stretched -->
            <g v-for="(day, idx) in chartData" :key="idx">
              <ellipse 
                :cx="day.x" 
                :cy="day.pvY" 
                rx="14" 
                ry="4" 
                fill="#ffffff" 
                stroke="#0ea5e9" 
                stroke-width="2"
                @mouseenter="setActiveIndex(idx)"
                @mouseleave="resetToToday"
                style="cursor: pointer;"
              ></ellipse>
              
              <ellipse 
                :cx="day.x" 
                :cy="day.uvY" 
                rx="12" 
                ry="3.5" 
                fill="#ffffff" 
                stroke="#818cf8" 
                stroke-width="2"
                @mouseenter="setActiveIndex(idx)"
                @mouseleave="resetToToday"
                style="cursor: pointer;"
              ></ellipse>
            </g>
          </svg>

          <!-- Tooltip -->
          <div 
            v-if="activeData"
            class="absolute bg-slate-800 text-white text-[11px] p-3 rounded-lg shadow-lg pointer-events-none z-50"
            :style="{ left: tooltipX + '%', top: tooltipY + '%', transform: 'translate(-50%, -100%)', marginTop: '-12px' }"
          >
            <p class="font-bold text-white mb-2 pb-2 border-b border-slate-600">{{ activeData.date }}</p>
            <div class="space-y-1">
              <div class="flex justify-between gap-4">
                <span class="text-slate-300">Page Views:</span>
                <span class="font-bold text-sky-400">{{ activeData.pv.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between gap-4">
                <span class="text-slate-300">Unique Visitors:</span>
                <span class="font-bold text-indigo-300">{{ activeData.uv.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- X-Axis Labels -->
        <div class="flex justify-between text-[11px] font-medium text-slate-500 mt-4 px-3 sm:px-6">
          <span 
            v-for="(day, idx) in chartData" 
            :key="idx" 
            :class="{ 'text-slate-800 font-bold': activeIndex === idx }"
            class="cursor-pointer"
            @mouseenter="setActiveIndex(idx)"
            @mouseleave="resetToToday"
          >
            {{ day.label }}
          </span>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';

// 7-Day Mock DB (Matching Coordinate scales relative to viewBox 700x250)
const chartData = ref([
  { label: '07/09', date: '7월 9일 (목요일)', pv: 24500, uv: 6800, x: 50, pvY: 190, uvY: 220 },
  { label: '07/10', date: '7월 10일 (금요일)', pv: 28900, uv: 7200, x: 150, pvY: 160, uvY: 200 },
  { label: '07/11', date: '7월 11일 (토요일)', pv: 32000, uv: 8500, x: 250, pvY: 130, uvY: 175 },
  { label: '07/12', date: '7월 12일 (일요일)', pv: 39500, uv: 10400, x: 350, pvY: 90, uvY: 140 },
  { label: '07/13', date: '7월 13일 (월요일)', pv: 35000, uv: 9100, x: 450, pvY: 110, uvY: 160 },
  { label: '07/14', date: '7월 14일 (화요일)', pv: 42100, uv: 11200, x: 550, pvY: 70, uvY: 125 },
  { label: '07/15', date: '7월 15일 (오늘)', pv: 48912, uv: 12450, x: 650, pvY: 40, uvY: 100 }
]);

const activeIndex = ref(null); // No default - only show tooltip on hover
const activeData = computed(() => {
  if (activeIndex.value === null) return null;
  return chartData.value[activeIndex.value];
});

const setActiveIndex = (idx) => {
  activeIndex.value = idx;
};

const resetToToday = () => {
  // Hide tooltip when mouse leaves
  activeIndex.value = null;
};

// Calculate dynamic tooltip location (Map coordinate ratio of viewBox 700x250 into container size percentage)
const tooltipX = computed(() => {
  if (!activeData.value) return 0;
  return (activeData.value.x / 700) * 100;
});

const tooltipY = computed(() => {
  if (!activeData.value) return 0;
  return (activeData.value.pvY / 250) * 100;
});

// Computed Paths for PV (Straight lines)
const pvLinePath = computed(() => {
  const d = chartData.value;
  return `M ${d[0].x} ${d[0].pvY} L ${d[1].x} ${d[1].pvY} L ${d[2].x} ${d[2].pvY} L ${d[3].x} ${d[3].pvY} L ${d[4].x} ${d[4].pvY} L ${d[5].x} ${d[5].pvY} L ${d[6].x} ${d[6].pvY}`;
});

const pvAreaPath = computed(() => {
  const d = chartData.value;
  return `${pvLinePath.value} L ${d[6].x} 230 L ${d[0].x} 230 Z`;
});

// Computed Paths for UV (Straight lines)
const uvLinePath = computed(() => {
  const d = chartData.value;
  return `M ${d[0].x} ${d[0].uvY} L ${d[1].x} ${d[1].uvY} L ${d[2].x} ${d[2].uvY} L ${d[3].x} ${d[3].uvY} L ${d[4].x} ${d[4].uvY} L ${d[5].x} ${d[5].uvY} L ${d[6].x} ${d[6].uvY}`;
});

const uvAreaPath = computed(() => {
  const d = chartData.value;
  return `${uvLinePath.value} L ${d[6].x} 230 L ${d[0].x} 230 Z`;
});
</script>

<style scoped>
/* Simple styles only */

</style>