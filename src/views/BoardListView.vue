<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  getAllPosts, 
  searchPosts,
  getLikes,
  getViewCount,
  getBookmarkCount  // 추가
} from '../services/BoardService'
import { getPlaceById } from '../services/PlaceService'

const router = useRouter()
const posts = ref([])
const searchKeyword = ref('')
const placesCache = new Map()

onMounted(() => {
  loadPosts()
})

function loadPosts() {
  const allPosts = getAllPosts().sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  )
  
  for (const post of allPosts) {
    if (post.placeId && !placesCache.has(post.placeId)) {
      try {
        const placeInfo = getPlaceById(post.placeId)
        if (placeInfo) {
          placesCache.set(post.placeId, placeInfo)
        }
      } catch (error) {
        console.error(`Failed to load place ${post.placeId}:`, error)
      }
    }
  }
  
  posts.value = allPosts
}

const filteredPosts = computed(() => {
  if (!searchKeyword.value) return posts.value
  return searchPosts(searchKeyword.value).sort((a, b) =>
    new Date(b.timestamp) - new Date(a.timestamp)
  )
})

function handleViewDetail(postId) {
  router.push(`/board/${postId}`)
}

function handleCreateNew() {
  router.push('/create')
}

function getPlaceInfo(placeId) {
  return placesCache.get(placeId) || null
}

function getPostStats(postId) {
  return {
    likes: getLikes(postId),
    views: getViewCount(postId),
    bookmarkCount: getBookmarkCount(postId)  // 변경
  }
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString('ko-KR')
}
</script>

<template>
  <div class="list-view">
    <div class="header">
      <h1>게시글 목록</h1>
      <button @click="handleCreateNew" class="btn btn-create">
        새 글 작성
      </button>
    </div>

    <div class="search-section">
      <input
        v-model="searchKeyword"
        type="text"
        placeholder="게시글 검색..."
        class="search-input"
      />
    </div>

    <div v-if="filteredPosts.length === 0" class="empty-message">
      게시글이 없습니다.
    </div>

    <div v-else class="posts-grid">
      <article
        v-for="post in filteredPosts"
        :key="post.id"
        class="post-card"
        @click="handleViewDetail(post.id)"
      >
        <div class="card-image">
          <img
            v-if="getPlaceInfo(post.placeId)?.image"
            :src="getPlaceInfo(post.placeId).image"
            :alt="post.title"
            class="post-image"
          />
          <div v-else class="image-placeholder">
            이미지 없음
          </div>
        </div>

        <div class="card-content">
          <h3 class="post-title">{{ post.title }}</h3>
          
          <p v-if="getPlaceInfo(post.placeId)" class="place-name">
            📍 {{ getPlaceInfo(post.placeId).title }}
          </p>

          <p class="post-date">{{ formatDate(post.timestamp) }}</p>

          <p class="post-preview">
            {{ post.content.substring(0, 100) }}...
          </p>
        </div>

        <!-- 통계 섹션 -->
        <div class="card-stats">
          <div class="stat-item">
            <span class="stat-icon">👀</span>
            <span class="stat-value">{{ getPostStats(post.id).views }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">❤️</span>
            <span class="stat-value">{{ getPostStats(post.id).likes }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">🔖</span>
            <span class="stat-value">{{ getPostStats(post.id).bookmarkCount }}</span>
          </div>
        </div>

        <div class="card-footer">
          <button class="btn-detail">상세보기</button>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.list-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 45%, #ffffff 100%);
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.header h1 {
  margin: 0;
  font-size: 2.5rem;
  color: #1e293b;
  font-weight: 700;
}

.btn-create {
  padding: 14px 32px;
  background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
  font-size: 15px;
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.4);
}

.search-section {
  margin-bottom: 35px;
}

.search-input {
  width: 100%;
  max-width: 500px;
  padding: 14px 20px;
  border: 2px solid #bae6fd;
  border-radius: 12px;
  font-size: 14px;
  background: white;
  color: #1e293b;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
  background: #f0f9ff;
}

.search-input::placeholder {
  color: #94a3b8;
}

.empty-message {
  text-align: center;
  padding: 80px 20px;
  color: #64748b;
  font-size: 18px;
  font-weight: 500;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 28px;
}

.post-card {
  background: white;
  border: none;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.post-card:hover {
  box-shadow: 0 12px 35px rgba(14, 165, 233, 0.2);
  transform: translateY(-8px);
}

.card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  position: relative;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

.card-content {
  padding: 20px;
  flex: 1;
}

.post-title {
  margin: 0 0 12px 0;
  font-size: 1.2rem;
  color: #1e293b;
  line-height: 1.5;
  font-weight: 700;
}

.place-name {
  margin: 10px 0;
  font-size: 13px;
  color: #0ea5e9;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.post-date {
  margin: 8px 0;
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.post-preview {
  margin: 12px 0 0 0;
  font-size: 13px;
  color: #475569;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 통계 섹션 */
.card-stats {
  display: flex;
  gap: 12px;
  padding: 14px 20px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  justify-content: space-around;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 60px;
}

.stat-icon {
  font-size: 20px;
}

.stat-value {
  font-size: 13px;
  font-weight: 700;
  color: #0ea5e9;
}

.card-footer {
  padding: 12px 20px;
  border-top: 1px solid #e2e8f0;
  text-align: center;
}

.btn-detail {
  padding: 10px 20px;
  background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  font-weight: 700;
}

.btn-detail:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .btn-create {
    width: 100%;
  }

  .posts-grid {
    grid-template-columns: 1fr;
  }

  .header h1 {
    font-size: 2rem;
  }
}
</style>