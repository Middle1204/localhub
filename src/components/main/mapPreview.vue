<template>
  <section data-map-preview class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
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
        
        <!-- API MAP CONTAINER -->
        <div id="real-busan-map" class="absolute inset-0 z-0"></div>

        <!-- Error State -->
        <div v-if="mapError" class="absolute inset-0 z-10 bg-red-50 flex flex-col items-center justify-center p-6">
           <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(#ef4444 1.5px, transparent 1.5px); background-size: 24px 24px;"></div>
           <div class="flex flex-col items-center gap-3 max-w-md text-center relative z-10">
             <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
               <i class="fa-solid fa-exclamation-triangle text-red-600 text-xl"></i>
             </div>
             <p class="text-red-700 text-sm font-bold">{{ mapError }}</p>
             <div class="mt-2 p-4 bg-white rounded-lg border border-red-200 text-left text-xs text-slate-700">
               <p class="font-bold mb-2">403 에러 해결 방법:</p>
               <ol class="list-decimal list-inside space-y-1">
                 <li><a href="https://developers.kakao.com/console/app" target="_blank" class="text-sky-600 hover:underline">카카오 개발자 콘솔</a> 접속</li>
                 <li>내 애플리케이션 선택</li>
                 <li>'플랫폼' 메뉴에서 'Web 플랫폼 등록' 클릭</li>
                 <li>사이트 도메인: <code class="bg-slate-100 px-1 py-0.5 rounded">http://localhost:5173</code> 추가</li>
                 <li>JavaScript 키 확인 및 .env 파일 재확인</li>
               </ol>
             </div>
           </div>
        </div>

        <!-- Loading State -->
        <div v-else-if="!mapLoaded" class="absolute inset-0 z-10 bg-sky-50 flex flex-col items-center justify-center">
           <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(#000 1.5px, transparent 1.5px); background-size: 24px 24px;"></div>
           <div class="flex flex-col items-center gap-3">
             <div class="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
             <p class="text-slate-400 text-xs font-medium italic">지도 데이터를 불러오는 중...</p>
           </div>
        </div>
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
    lat: 35.1587,
    lng: 129.1604,
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
    lat: 35.0975,
    lng: 129.0315,
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
    lat: 35.1583,
    lng: 129.0620,
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
const mapLoaded = ref(false);
const mapError = ref(null);

const selectZone = (key) => {
  activeZoneKey.value = key;
};

// lifecycle hook for real map sdk initialization
onMounted(() => {
  // 스크립트 동적 로드 (API 키 보안을 위해)
  const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
  if (!apiKey) {
    mapError.value = "API 키가 설정되지 않았습니다. .env 파일을 확인하세요.";
    console.error("Kakao Map API key is missing in .env file");
    return;
  }

  if (window.kakao && window.kakao.maps) {
    initMap();
  } else {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${apiKey}&libraries=services`;
    
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          initMap();
        });
      } else {
        mapError.value = "카카오맵 SDK 로드에 실패했습니다.";
        console.error("Kakao maps object is not available");
      }
    };
    
    script.onerror = (error) => {
      mapError.value = "카카오맵 API 로드 실패 (403 Forbidden): 카카오 개발자 콘솔에서 JavaScript 키와 플랫폼 설정을 확인하세요.";
      console.error("Failed to load Kakao Maps script:", error);
      console.info(`
        403 에러 해결 방법:
        1. https://developers.kakao.com/console/app 접속
        2. 내 애플리케이션 선택
        3. '플랫폼' 메뉴에서 'Web 플랫폼 등록' 클릭
        4. 사이트 도메인에 'http://localhost:5173' 추가 (또는 현재 사용 중인 포트)
        5. JavaScript 키가 .env 파일의 VITE_KAKAO_MAP_API_KEY에 올바르게 설정되었는지 확인
      `);
    };
    
    document.head.appendChild(script);
  }
});

const initMap = () => {
  try {
    const container = document.getElementById('real-busan-map');
    if (!container) {
      mapError.value = "지도 컨테이너를 찾을 수 없습니다.";
      return;
    }

    const options = {
      center: new window.kakao.maps.LatLng(35.14, 129.10), // 부산 중심부 대략적 설정
      level: 8
    };
    
    const map = new window.kakao.maps.Map(container, options);
    mapLoaded.value = true;
    mapError.value = null;

    // 각 구역별 마커 추가
    Object.keys(mapZones).forEach((key) => {
      const zone = mapZones[key];
      const markerPosition = new window.kakao.maps.LatLng(zone.lat, zone.lng);
      
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        map: map,
        title: zone.title
      });

      // 마커 클릭 시 해당 구역 선택
      window.kakao.maps.event.addListener(marker, 'click', () => {
        selectZone(key);
      });
    });
  } catch (error) {
    mapError.value = `지도 초기화 실패: ${error.message}`;
    console.error("Failed to initialize map:", error);
  }
};
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