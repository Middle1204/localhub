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
              <span class="flex items-center gap-0.5"><i class="fa-regular fa-eye text-slate-300"></i> {{ post.views }}</span>
              <!-- Liking interaction button -->
              <button 
                @click.stop="likePost(post.id)"
                class="flex items-center gap-0.5 hover:text-rose-500 font-bold transition-colors group/heart"
                title="이 게시글에 공감하기"
              >
                <i class="fa-solid fa-heart text-slate-300 group-hover/heart:text-rose-400 group-hover/heart:scale-110 transition-all" :class="{ 'text-rose-500': post.liked }"></i> 
                <span :class="{ 'text-rose-500': post.liked }">{{ post.likes }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Mock Sample Data
const popularPosts = ref([
  {
    id: 1,
    title: "수변최고돼지국밥 민락본점, 항정국밥의 숨겨진 조화",
    region: "광안리 해변길",
    category: "돼지국밥",
    excerpt: "국물이 걸쭉하고 가벼운 한약재 풍미가 아주 매력적입니다. 항정살 특유의 기름지고 고소한 맛을 정구지(부추)로 꼭 잡아서 드셔보세요.",
    author: "부산갈매기99",
    views: 1245,
    likes: 54,
    liked: false,
    image: "https://placehold.co/600x400/0ea5e9/ffffff?text=Busan+Gukbap"
  },
  {
    id: 2,
    title: "해운대 가야밀면 대기 안 서는 아침 시간대 꿀팁",
    region: "해운대 달맞이길",
    category: "밀면 전문점",
    excerpt: "오전 10시 40분쯤 오픈 전에 맞춰 가시면 한 번에 들어갑니다. 새콤한 양념장에 한방 약재 육수를 자작하게 붓는 것 잊지 마세요.",
    author: "밀면콜렉터",
    views: 980,
    likes: 42,
    liked: false,
    image: "https://placehold.co/600x400/0284c7/ffffff?text=Haeundae+Milmyeon"
  },
  {
    id: 3,
    title: "영도 흰여울마을 감성 오션뷰 통유리 카페 3대장",
    region: "영도 절영길",
    category: "감성 카페",
    excerpt: "바다 한가운데에 떠 있는 듯한 느낌을 선사하는 흰여울마을 절벽 위 테라스 스팟들만 직접 다녀오고 고심 끝에 골랐습니다.",
    author: "오션러버",
    views: 890,
    likes: 38,
    liked: false,
    image: "https://placehold.co/600x400/0369a1/ffffff?text=Yeongdo+Cafe"
  },
  {
    id: 4,
    title: "자갈치 곱창 골목 '백화양곱창' 연탄불 세트 솔직 후기",
    region: "남포·자갈치",
    category: "양곱창 노포",
    excerpt: "이모님들이 눈앞에서 직접 연탄불에 구워주시는 노포 감성은 최고입니다. 특유의 짠맛과 쫄깃한 곱창 식감이 소주를 부르네요.",
    author: "노포매니아",
    views: 742,
    likes: 31,
    liked: false,
    image: "https://placehold.co/600x400/0c4a6e/ffffff?text=Jagalchi+Gopchang"
  }
]);

// Local Like Logic
const likePost = (id) => {
  const post = popularPosts.value.find(p => p.id === id);
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