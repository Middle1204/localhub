<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { createPost } from '../services/BoardService'
import { 
  getAllCategories, 
  getPlacesByCategory,
  searchPlaces 
} from '../services/PlaceService'

const router = useRouter()

// 카테고리와 가게
const categories = ref([])
const selectedCategory = ref('SHOPPING')
const places = ref([])
const selectedPlace = ref(null)
const isLoadingPlaces = ref(false)
const searchQuery = ref('')

// 폼 데이터
const formData = ref({
  title: '',
  content: '',
  password: ''
})

/**
 * 초기 로드
 */
onMounted(async () => {
  categories.value = getAllCategories()
  await loadPlaces()
})

/**
 * 카테고리 선택 시 가게 로드
 */
async function loadPlaces() {
  isLoadingPlaces.value = true
  try {
    if (searchQuery.value) {
      // 검색 모드
      places.value = await searchPlaces(searchQuery.value, selectedCategory.value)
    } else {
      // 카테고리별 모드
      places.value = await getPlacesByCategory(selectedCategory.value, 50)
    }
    selectedPlace.value = null
  } catch (error) {
    console.error('Failed to load places:', error)
    places.value = []
  } finally {
    isLoadingPlaces.value = false
  }
}

/**
 * 카테고리 변경
 */
async function handleCategoryChange() {
  searchQuery.value = ''
  await loadPlaces()
}

/**
 * 검색
 */
async function handleSearch() {
  await loadPlaces()
}

/**
 * 가게 선택
 */
function handleSelectPlace(place) {
  selectedPlace.value = place
}

/**
 * 게시글 작성
 */
async function handleCreatePost() {
  if (!formData.value.title.trim() || !formData.value.content.trim() || !formData.value.password) {
    alert('모든 필드를 입력해주세요.')
    return
  }

  if (!selectedPlace.value) {
    alert('추천 가게를 선택해주세요.')
    return
  }

  createPost(
    formData.value.title,
    formData.value.content,
    formData.value.password,
    selectedPlace.value.id
  )

  alert('게시글이 작성되었습니다.')
  router.push('/board')
}

/**
 * 폼 초기화
 */
function handleCancel() {
  router.push('/board')
}
</script>

<template>
  <div class="create-view">
    <h1>게시글 작성</h1>
    
    <div class="create-container">
      <!-- 왼쪽: 작성 폼 -->
      <div class="form-section">
        <div class="form-group">
          <label>제목</label>
          <input
            v-model="formData.title"
            type="text"
            placeholder="제목을 입력하세요"
            class="input-field"
          />
        </div>

        <div class="form-group">
          <label>내용</label>
          <textarea
            v-model="formData.content"
            placeholder="내용을 입력하세요"
            class="input-field content-textarea"
          ></textarea>
        </div>

        <div class="form-group">
          <label>비밀번호</label>
          <input
            v-model="formData.password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            class="input-field"
          />
        </div>

        <div class="button-group">
          <button @click="handleCreatePost" class="btn btn-primary">저장</button>
          <button @click="handleCancel" class="btn btn-secondary">취소</button>
        </div>
      </div>

      <!-- 오른쪽: 추천 가게 선택 -->
      <aside class="sidebar">
        <h3>추천 가게 선택</h3>
        
        <!-- 가게 이미지 미리보기 -->
        <div class="place-image">
          <img
            v-if="selectedPlace?.image"
            :src="selectedPlace.image"
            :alt="selectedPlace.title"
            class="preview-image"
          />
          <div v-else class="image-placeholder">
            이미지 미리보기
          </div>
        </div>

        <!-- 선택된 가게 정보 -->
        <div v-if="selectedPlace" class="selected-info">
          <p><strong>{{ selectedPlace.title }}</strong></p>
          <p class="category-badge">{{ selectedPlace.categoryLabel }}</p>
          <p class="address">{{ selectedPlace.address }}</p>
        </div>

        <!-- 카테고리 선택 -->
        <div class="filter-section">
          <label>카테고리</label>
          <select
            v-model="selectedCategory"
            @change="handleCategoryChange"
            class="select-field"
          >
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.label }}
            </option>
          </select>
        </div>

        <!-- 검색 -->
        <div class="search-section">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="가게 검색..."
            class="input-field search-input"
            @keyup.enter="handleSearch"
          />
          <button @click="handleSearch" class="btn btn-search">
            검색
          </button>
        </div>

        <!-- 가게 드롭다운 목록 -->
        <div class="place-list">
          <div class="loading" v-if="isLoadingPlaces">
            로딩 중...
          </div>
          <div v-else-if="places.length === 0" class="empty">
            가게가 없습니다.
          </div>
          <div v-else class="scroll-container">
            <div
              v-for="place in places"
              :key="place.id"
              class="place-item"
              :class="{ active: selectedPlace?.id === place.id }"
              @click="handleSelectPlace(place)"
            >
              <div class="place-item-image">
                <img
                  v-if="place.image"
                  :src="place.image"
                  :alt="place.title"
                  class="thumb"
                />
                <div v-else class="thumb-placeholder">이미지</div>
              </div>
              <div class="place-item-info">
                <p class="place-item-title">{{ place.title }}</p>
                <p class="place-item-category">{{ place.categoryLabel }}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
<style scoped>
.create-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 45%, #ffffff 100%);
  min-height: 100vh;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 40px;
  color: #1e293b;
  font-weight: 700;
}

.create-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.form-section {
  background: white;
  padding: 30px;
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 700;
  color: #1e293b;
  font-size: 14px;
}

.input-field {
  width: 100%;
  padding: 14px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  background: white;
  color: #1e293b;
  transition: all 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
  background: #f0f9ff;
}

.content-textarea {
  min-height: 220px;
  resize: vertical;
}

.button-group {
  display: flex;
  gap: 12px;
  margin-top: 40px;
}

.btn {
  padding: 14px 28px;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  font-size: 15px;
}

.btn-primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.4);
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #1e293b;
}

.btn-secondary:hover {
  background-color: #cbd5e1;
}

.btn-search {
  background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
  color: white;
  padding: 12px;
  font-size: 13px;
  margin-top: 8px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2);
}

.btn-search:hover {
  transform: translateY(-1px);
}

/* 사이드바 */
.sidebar {
  background: white;
  padding: 30px;
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: fit-content;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.sidebar h3 {
  margin: 0;
  color: #1e293b;
  font-size: 1.2rem;
  font-weight: 700;
}

.place-image {
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 5px;
}

.preview-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}

.image-placeholder {
  width: 100%;
  height: 180px;
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

.selected-info {
  padding: 14px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 10px;
  border-left: 4px solid #0ea5e9;
}

.selected-info p {
  margin: 6px 0;
  font-size: 13px;
  color: #1e293b;
}

.selected-info strong {
  color: #1e293b;
  font-weight: 700;
}

.category-badge {
  display: inline-block;
  background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
  color: white;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  margin: 6px 0;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.2);
}

.address {
  color: #475569;
  font-size: 12px;
  line-height: 1.4;
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-section label {
  font-weight: 700;
  font-size: 13px;
  color: #1e293b;
}

.select-field {
  padding: 10px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  background: white;
  color: #1e293b;
  transition: all 0.3s ease;
}

.select-field:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
}

.search-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-input {
  padding: 10px;
  font-size: 12px;
}

/* 가게 리스트 */
.place-list {
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  height: 350px;
  display: flex;
  flex-direction: column;
  background: white;
}

.loading,
.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
}

.scroll-container {
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.scroll-container::-webkit-scrollbar {
  width: 6px;
}

.scroll-container::-webkit-scrollbar-track {
  background: #e0f2fe;
}

.scroll-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
  border-radius: 3px;
}

/* 가게 아이템 */
.place-item {
  display: flex;
  gap: 12px;
  padding: 10px;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
  align-items: center;
  flex-shrink: 0;
}

.place-item:hover {
  background-color: #f0f9ff;
}

.place-item.active {
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  border-left: 3px solid #0ea5e9;
  padding-left: 7px;
}

.place-item-image {
  flex: 0 0 90px;
  height: 90px;
  border-radius: 8px;
  overflow: hidden;
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumb {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  background-color: white;
  padding: 2px;
}

.thumb-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #64748b;
  font-weight: 500;
}

.place-item-info {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.place-item-title {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

.place-item-category {
  margin: 3px 0 0 0;
  font-size: 11px;
  color: #64748b;
  white-space: nowrap;
  font-weight: 500;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .create-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .sidebar {
    height: auto;
  }

  h1 {
    font-size: 2rem;
  }

  .button-group {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .place-list {
    height: 300px;
  }

  .place-item-image {
    flex: 0 0 75px;
    height: 75px;
  }
}
</style>