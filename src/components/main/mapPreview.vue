<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
    <div class="mb-8">
      <div class="flex items-center gap-2 mb-2">
        <span class="w-2.5 h-6 bg-sky-500 rounded-full"></span>
        <h2 class="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
          🗺️ 부산 구역별 테마 맛지도
        </h2>
      </div>
      <p class="text-xs sm:text-sm text-slate-500">
        지도의 로컬 마커를 클릭하여 부산 지역 대표 구역의 평점 높은 토박이 인증 맛집 목록을 확인하세요.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
      
      <!-- Left side: Interactive Map Area (API Integration Placeholder) -->
      <div class="lg:col-span-2 bg-sky-50/40 h-[450px] relative flex items-center justify-center overflow-hidden select-none">
        
        <!-- API MAP CONTAINER PLACEHOLDER -->
        <!-- 실지 지도 API(Naver/Kakao)를 연동할 때 아래 주석을 풀고 사용하고, 바로 아래의 mock-map을 지우시면 됩니다. -->
        <!-- <div id="real-busan-map" class="absolute inset-0 z-0"></div> -->

        <!-- MOCK INTERACTIVE MAP GRAPHIC (Fallback visual design) -->
        <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(#000 1.5px, transparent 1.5px); background-size: 24px 24px;"></div>
        
        <!-- Decorative Ocean Waves representing Busan Bay -->
        <div class="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-sky-200/50 to-sky-100/10 transform skew-y-1 border-t border-sky-200/60 pointer-events-none">
          <span class="absolute bottom-4 left-6 text-sky-500/70 font-bold text-xs tracking-widest">
            <i class="fa-solid fa-ship mr-1"></i> BUSAN DEEP BLUE OCEAN
          </span>
        </div>

        <div class="absolute right-1/4 bottom-16 w-32 h-20 rounded-full bg-emerald-100/40 border border-emerald-200/60 flex items-center justify-center pointer-events-none">
          <span class="text-emerald-700/50 font-bold text-xs">영도 / 태종대</span>
        </div>

        <!-- Pin 1: Haeundae & Gwangalli -->
        <button 
          @click="selectZone('haeundae')" 
          class="absolute right-1/4 top-1/3 group/pin focus:outline-none z-10 transition-transform hover:scale-110"
        >
          <div class="relative flex items-center justify-center">
            <span class="absolute inline-flex h-12 w-12 rounded-full bg-sky-500/20 animate-ping opacity-75"></span>
            <div 
              class="relative w-11 h-11 rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-all duration-300"
              :class="activeZoneKey === 'haeundae' ? 'bg-sky-500 text-white' : 'bg-white text-sky-500'"
            >
              <i class="fa-solid fa-umbrella-beach text-sm"></i>
            </div>
          </div>
          <div class="absolute top-13 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap">
            해운대·광안리
          </div>
        </button>

        <!-- Pin 2: Nampo & Jagalchi -->
        <button 
          @click="selectZone('nampo')" 
          class="absolute left-1/3 top-1/2 group/pin focus:outline-none z-10 transition-transform hover:scale-110"
        >
          <div class="relative flex items-center justify-center">
            <span class="absolute inline-flex h-12 w-12 rounded-full bg-blue-500/20 animate-ping opacity-75"></span>
            <div 
              class="relative w-11 h-11 rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-all duration-300"
              :class="activeZoneKey === 'nampo' ? 'bg-blue-600 text-white' : 'bg-white text-blue-500'"
            >
              <i class="fa-solid fa-fish text-sm"></i>
            </div>
          </div>
          <div class="absolute top-13 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap">
            남포·자갈치 원조길
          </div>
        </button>

        <!-- Pin 3: Seomyeon -->
        <button 
          @click="selectZone('seomyeon')" 
          class="absolute left-1/2 top-1/4 group/pin focus:outline-none z-10 transition-transform hover:scale-110"
        >
          <div class="relative flex items-center justify-center">
            <span class="absolute inline-flex h-12 w-12 rounded-full bg-indigo-500/20 animate-ping opacity-75"></span>
            <div 
              class="relative w-11 h-11 rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-all duration-300"
              :class="activeZoneKey === 'seomyeon' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-500'"
            >
              <i class="fa-solid fa-bullseye text-sm"></i>
            </div>
          </div>
          <div class="absolute top-13 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap">
            서면 핫스팟
          </div>
        </button>

      </div>

      <!-- Right side: Selected Zone's Restaurant Details -->
      <div class="p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-100 bg-white">
        <div>
          <!-- Header and Count -->
          <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div>
              <span class="text-[10px] font-extrabold text-sky-500 tracking-wider uppercase">{{ activeZone.sub }}</span>
              <h3 class="text-base font-extrabold text-slate-800 mt-0.5">{{ activeZone.title }}</h3>
            </div>
            <span class="px-2 py-1 bg-sky-50 text-sky-700 rounded-lg text-[10px] font-extrabold">
              {{ activeZone.restaurants.length }}개 맛집
            </span>
          </div>

          <!-- Dynamic List -->
          <div class="space-y-3 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
            <div 
              v-for="(res, idx) in activeZone.restaurants" 
              :key="idx" 
              class="p-4 border rounded-2xl bg-sky-50/5 hover:bg-sky-50/20 border-sky-100/40 transition-all duration-300 group/item"
            >
              <div class="flex items-center justify-between mb-1">
                <span class="font-extrabold text-xs text-slate-800 group-hover/item:text-sky-500 transition-colors">{{ res.name }}</span>
                <span class="text-[9px] px-1.5 py-0.5 bg-white text-slate-500 rounded border border-slate-100 font-semibold">{{ res.tag }}</span>
              </div>
              
              <div class="flex items-center gap-1.5 text-[10px] text-amber-500 font-bold mb-2">
                <i class="fa-solid fa-star"></i>
                <span>{{ res.rating }}</span>
              </div>
              
              <p class="text-[11px] text-slate-500 leading-relaxed italic">
                "{{ res.comment }}"
              </p>
            </div>
          </div>
        </div>

        <!-- Bottom View All Button -->
        <div class="mt-6">
          <router-link 
            to="/map" 
            class="w-full py-3 bg-slate-50 hover:bg-sky-50 text-sky-600 hover:text-sky-700 font-bold text-xs rounded-2xl transition-all border border-slate-100 flex items-center justify-center gap-2"
          >
            <i class="fa-solid fa-map-location-dot"></i>
            부산 전체 테마지도 크게 보기
          </router-link>
        </div>

      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Mock Database matching districts in Busan
const mapZones = {
  haeundae: {
    title: "해운대·광안리 낭만 맛길",
    sub: "HAEUNDAE & GWANGALLI",
    restaurants: [
      {
        name: "수변최고돼지국밥 민락본점",
        tag: "돼지국밥 전문",
        rating: "4.8 (평가 1,230개)",
        comment: "항정국밥 고기 품질이 대단히 야들야들하며, 무조건 현장 웨이팅 전 테이블링 앱 예약을 추천드려요."
      },
      {
        name: "해운대 가야밀면",
        tag: "밀면 전문점",
        rating: "4.7 (평가 945개)",
        comment: "시원하고 은은한 한약재 깊이가 담긴 육수와 직접 빚은 얇은 피 피자식 고기만두 조화가 일품."
      }
    ]
  },
  nampo: {
    title: "남포·자갈치 유서 깊은 노포길",
    sub: "NAMPO & JAGALCHI OLD SEAPORT",
    restaurants: [
      {
        name: "백화양곱창",
        tag: "양곱창 전문 노포",
        rating: "4.6 (평가 680개)",
        comment: "자갈치 시장 뒤편, 연탄불 석쇠에 직접 양념 양곱창을 구워주는 특유의 야생적인 노포 정취."
      },
      {
        name: "이재모피자 본점",
        tag: "로컬 수제피자 명가",
        rating: "4.9 (평가 2,400개)",
        comment: "신선한 국산 임실 치즈를 아낌없이 뿌린 명실상부 부산의 넘버원 인생 치즈크러스트 피자집."
      }
    ]
  },
  seomyeon: {
    title: "서면 번화가 전포사잇길",
    sub: "SEOMYEON & JEONPO STREET",
    restaurants: [
      {
        name: "송정3대국밥",
        tag: "24시 국밥노포",
        rating: "4.5 (평가 712개)",
        comment: "고기를 얇게 썰어내어 매우 부드럽고 국물이 맑은 이북식 스타일입니다. 부추 겉절이를 팍팍 넣으세요!"
      },
      {
        name: "전포 베르크 로스터스",
        tag: "에스프레소 바",
        rating: "4.7 (평가 320개)",
        comment: "어둡고 성스러운 종교적 무드의 인테리어 공간에서 개성적인 싱글오리진 스페셜티를 서빙합니다."
      }
    ]
  }
};

const activeZoneKey = ref('haeundae');
const activeZone = computed(() => mapZones[activeZoneKey.value]);

const selectZone = (key) => {
  activeZoneKey.value = key;
};

// lifecycle hook for real map sdk initialization
onMounted(() => {
  // 예: Kakao Map SDK 가 로드되었을 시 맵 인스턴스를 그리는 영역
  // const container = document.getElementById('real-busan-map');
  // const options = { center: new kakao.maps.LatLng(35.179554, 129.075641), level: 8 };
  // const map = new kakao.maps.Map(container, options);
});
</script>

<style scoped>
/* Custom mini-scrollbar style for nice list scroll UI */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 9999px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>