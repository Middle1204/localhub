<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class="w-2.5 h-6 bg-sky-500 rounded-full"></span>
          <h2 class="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
            실시간 인기 로컬 추천글
          </h2>
        </div>
        <p class="text-xs sm:text-sm text-slate-500">
          부산 시민들과 맛집 사냥꾼들이 직접 제보한 광고 없는 청정 리뷰 목록입니다.
        </p>
      </div>
      
      <!-- Go to Board Route Link -->
      <router-link 
        to="/board" 
        class="text-xs sm:text-sm font-bold text-sky-500 hover:text-sky-600 flex items-center gap-1 group transition-colors shrink-0"
      >
        전체글 보러가기 
        <i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
      </router-link>
    </div>

    <!-- Grid Layout of Popular Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div 
        v-for="(post, idx) in popularPosts" 
        :key="post.id" 
        class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group cursor-pointer"
        @click="navigateToPost(post.id)"
      >
        <!-- Card Thumbnail -->
        <div class="relative h-44 sm:h-48 bg-slate-100 overflow-hidden shrink-0">
          <img 
            :src="post.image" 
            :alt="post.title" 
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            @error="handleImageError"
          >
          <span class="absolute top-3 left-3 bg-gradient-to-r from-sky-400 to-blue-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow-md z-10">
            인기 {{ idx + 1 }}위
          </span>
        </div>

        <!-- Card Body -->
        <div class="p-5 flex-grow flex flex-col justify-between">
          <div>
            <!-- Badges -->
            <div class="flex items-center gap-1.5 text-[10px] font-extrabold text-sky-600 mb-2.5">
              <span class="px-2 py-0.5 bg-sky-50 rounded">{{ post.region }}</span>
              <span>•</span>
              <span class="px-2 py-0.5 bg-slate-50 text-slate-500 rounded">{{ post.category }}</span>
            </div>
            
            <!-- Title -->
            <h3 class="font-extrabold text-slate-800 text-sm mb-2 line-clamp-1 group-hover:text-sky-500 transition-colors">
              {{ post.title }}
            </h3>
            
            <!-- Excerpt -->
            <p class="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-4">
              {{ post.excerpt }}
            </p>
          </div>

          <!-- Card Footer Metadata -->
          <div class="border-t border-slate-100 pt-3.5 mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span class="font-semibold text-slate-600 flex items-center gap-1">
              <i class="fa-solid fa-user-pen text-slate-300"></i>
              {{ post.author }}
            </span>
            <div class="flex items-center gap-3">
              <span class="flex items-center gap-0.5"><i class="fa-regular fa-eye text-slate-300"></i> {{ post.views.toLocaleString() }}</span>
              <!-- Liking interaction button -->
              <button 
                @click.stop="likePost(post.id)"
                class="flex items-center gap-0.5 hover:text-rose-500 font-bold transition-colors group/heart"
                title="이 게시글에 공감하기"
              >
                <i class="fa-solid fa-heart text-slate-300 group-hover/heart:text-rose-400 group-hover/heart:scale-110 transition-all" :class="{ 'text-rose-500': post.liked }"></i> 
                <span :class="{ 'text-rose-500': post.liked }">{{ post.likes.toLocaleString() }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import boardsData from '../../data/boards/dummy_board.json';

// Places 데이터 import
import placesGwangwang from '../../data/places/부산_관광지.json';
import placesLeports from '../../data/places/부산_레포츠.json';
import placesMunhwa from '../../data/places/부산_문화시설.json';
import placesShopping from '../../data/places/부산_쇼핑.json';
import placesSukbak from '../../data/places/부산_숙박.json';
import placesYeohaeng from '../../data/places/부산_여행코스.json';
import placesChukje from '../../data/places/부산_축제공연행사.json';

const router = useRouter();

// 모든 places 데이터를 하나의 배열로 통합
const allPlaces = [
  ...placesGwangwang.items,
  ...placesLeports.items,
  ...placesMunhwa.items,
  ...placesShopping.items,
  ...placesSukbak.items,
  ...placesYeohaeng.items,
  ...placesChukje.items
];

// placeId로 장소 정보 찾기
const getPlaceById = (placeId) => {
  return allPlaces.find(place => place.contentid === placeId);
};

// 데이터를 ref로 복사하여 수정 가능하게 만듦
const boards = ref(boardsData.map(board => ({ ...board, liked: false })));

// 실제 데이터를 좋아요 순으로 정렬하고 상위 4개만 표시
const popularPosts = computed(() => {
  return [...boards.value]
    .sort((a, b) => b.likes - a.likes) // 좋아요 수 내림차순 정렬
    .slice(0, 4) // 상위 4개만
    .map(post => {
      const place = getPlaceById(post.placeId);
      return {
        id: post.id,
        title: post.title,
        region: "부산", // 기본 지역
        category: "로컬 추천", // 기본 카테고리
        excerpt: post.content.length > 50 ? post.content.substring(0, 50) + '...' : post.content,
        author: "익명",
        views: post.views,
        likes: post.likes,
        liked: post.liked,
        image: place?.firstimage || `https://placehold.co/600x400/0ea5e9/ffffff?text=Post+${post.id}`
      };
    });
});

// Local Like Logic
const likePost = (id) => {
  const post = boards.value.find(p => p.id === id);
  if (post) {
    if (!post.liked) {
      post.likes++;
      post.liked = true;
    } else {
      post.likes--;
      post.liked = false;
    }
  }
};

// Routing Handler
const navigateToPost = (id) => {
  router.push(`/board/${id}`);
};

// Image Placeholder Fallback
const handleImageError = (e) => {
  e.target.src = "https://placehold.co/600x400/cbd5e1/475569?text=localhub+Busan";
};
</script>

<style scoped>
/* Smooth translation hover for nice micro-interaction */
.hover\:-translate-y-1\.5:hover {
  transform: translateY(-0.375rem);
}
</style>