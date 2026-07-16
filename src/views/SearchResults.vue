<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <!-- Hero Section with Search Query -->
    <section class="bg-gradient-to-br from-sky-50 via-blue-50 to-white border-b border-sky-100 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-sky-200 mb-4">
            <div class="w-4 h-4 text-sky-500" v-html="svgIcons.search"></div>
            <span class="text-xs font-semibold text-slate-600">검색 결과</span>
          </div>
          
          <h1 class="text-3xl sm:text-4xl font-black text-slate-800 mb-3">
            "<span class="text-sky-500">{{ searchQuery }}</span>" 검색 결과
          </h1>
          
          <p class="text-sm text-slate-500">
            총 <span class="font-bold text-sky-600">{{ filteredResults.length }}개</span>의 장소를 찾았습니다
          </p>
        </div>
      </div>
    </section>

    <!-- Filter Tabs -->
    <section class="bg-white border-b border-slate-200 sticky top-16 sm:top-20 z-40 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
          <button
            @click="selectedCategory = 'all'"
            :class="selectedCategory === 'all' 
              ? 'bg-sky-500 text-white border-sky-500' 
              : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:text-sky-600'"
            class="px-4 py-2 rounded-full border-2 text-sm font-semibold whitespace-nowrap transition-all"
          >
            전체 ({{ filteredResults.length }})
          </button>
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategory = category.id"
            :class="selectedCategory === category.id 
              ? 'bg-sky-500 text-white border-sky-500' 
              : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:text-sky-600'"
            class="px-4 py-2 rounded-full border-2 text-sm font-semibold whitespace-nowrap transition-all"
          >
            {{ category.name }} ({{ getCategoryCount(category.id) }})
          </button>
        </div>
      </div>
    </section>

    <!-- Search Results Grid -->
    <section class="py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- No Results -->
        <div v-if="displayedResults.length === 0" class="text-center py-20">
          <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
            <div class="w-10 h-10 text-slate-400" v-html="svgIcons.search"></div>
          </div>
          <h3 class="text-xl font-bold text-slate-700 mb-2">검색 결과가 없습니다</h3>
          <p class="text-sm text-slate-500">다른 키워드로 검색해보세요</p>
        </div>

        <!-- Results Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="place in displayedResults"
            :key="place.contentid"
            class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer"
          >
            <!-- Image -->
            <div class="relative h-48 overflow-hidden bg-gradient-to-br from-sky-100 to-blue-100">
              <img
                v-if="place.firstimage"
                :src="place.firstimage"
                :alt="place.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                @error="handleImageError"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <div class="w-16 h-16 text-sky-300" v-html="svgIcons.beach"></div>
              </div>
              
              <!-- Category Badge -->
              <div class="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-sky-600 border border-sky-200">
                {{ place.categoryName }}
              </div>
            </div>

            <!-- Content -->
            <div class="p-5">
              <h3 class="text-lg font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-sky-600 transition-colors">
                {{ place.title }}
              </h3>
              
              <div class="flex items-start gap-2 text-xs text-slate-500 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mt-0.5 flex-shrink-0 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="line-clamp-2">{{ place.addr1 }}</span>
              </div>

              <div v-if="place.tel" class="flex items-center gap-2 text-xs text-slate-500 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{{ place.tel }}</span>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-2 mt-4">
                <!-- Kakao Map Button -->
                <a
                  v-if="place.mapy && place.mapx"
                  :href="`https://map.kakao.com/link/map/${encodeURIComponent(place.title)},${place.mapy},${place.mapx}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex-1 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-white rounded-xl font-semibold text-sm transition-all border border-amber-500 flex items-center justify-center gap-2"
                  title="카카오맵에서 보기"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3c5.523 0 10 3.806 10 8.5 0 4.694-4.477 8.5-10 8.5-.93 0-1.829-.1-2.678-.285L5 21.5v-3.256C2.613 16.73 2 14.716 2 12.5 2 7.806 6.477 3 12 3z"/>
                  </svg>
                  <span>카카오맵</span>
                </a>
                
                <!-- Google Search Button -->
                <a
                  :href="`https://www.google.com/search?q=${encodeURIComponent(place.title + ' ' + place.addr1)}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex-1 px-4 py-2 bg-sky-50 hover:bg-sky-500 text-sky-600 hover:text-white rounded-xl font-semibold text-sm transition-all border border-sky-200 hover:border-sky-500 flex items-center justify-center gap-2"
                  title="구글 검색"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>구글검색</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { svgIcons } from '../assets/svgGroup.js';

// Import all places data
import 관광지Data from '../data/places/부산_관광지.json';
import 레포츠Data from '../data/places/부산_레포츠.json';
import 문화시설Data from '../data/places/부산_문화시설.json';
import 쇼핑Data from '../data/places/부산_쇼핑.json';
import 숙박Data from '../data/places/부산_숙박.json';
import 여행코스Data from '../data/places/부산_여행코스.json';
import 축제공연행사Data from '../data/places/부산_축제공연행사.json';

const route = useRoute();
const router = useRouter();

const searchQuery = ref('');
const selectedCategory = ref('all');

const categories = [
  { id: 'tourism', name: '관광지', data: 관광지Data.items },
  { id: 'sports', name: '레포츠', data: 레포츠Data.items },
  { id: 'culture', name: '문화시설', data: 문화시설Data.items },
  { id: 'shopping', name: '쇼핑', data: 쇼핑Data.items },
  { id: 'accommodation', name: '숙박', data: 숙박Data.items },
  { id: 'course', name: '여행코스', data: 여행코스Data.items },
  { id: 'festival', name: '축제공연행사', data: 축제공연행사Data.items },
];

// Combine all places data with category labels
const allPlaces = computed(() => {
  const combined = [];
  categories.forEach(category => {
    category.data.forEach(place => {
      combined.push({
        ...place,
        categoryId: category.id,
        categoryName: category.name
      });
    });
  });
  return combined;
});

// Filter results based on search query
const filteredResults = computed(() => {
  if (!searchQuery.value) return [];
  
  const query = searchQuery.value.toLowerCase();
  
  return allPlaces.value.filter(place => {
    const titleMatch = place.title?.toLowerCase().includes(query);
    const addrMatch = place.addr1?.toLowerCase().includes(query);
    const addr2Match = place.addr2?.toLowerCase().includes(query);
    
    return titleMatch || addrMatch || addr2Match;
  });
});

// Filter by selected category
const displayedResults = computed(() => {
  if (selectedCategory.value === 'all') {
    return filteredResults.value;
  }
  
  return filteredResults.value.filter(place => place.categoryId === selectedCategory.value);
});

// Get count for each category
const getCategoryCount = (categoryId) => {
  return filteredResults.value.filter(place => place.categoryId === categoryId).length;
};

// Handle image loading errors
const handleImageError = (event) => {
  event.target.style.display = 'none';
};

// Initialize search query from route
onMounted(() => {
  searchQuery.value = route.query.q || '';
  
  // If no search query, redirect to home
  if (!searchQuery.value) {
    router.push('/');
  }
});

// Watch for search query changes in URL
watch(
  () => route.query.q,
  (newQuery) => {
    if (newQuery) {
      searchQuery.value = newQuery;
      selectedCategory.value = 'all'; // Reset category filter on new search
    } else {
      router.push('/');
    }
  }
);
</script>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}

.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
