<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  getPostById, 
  updatePost, 
  deletePost,
  addLike,
  removeLike,
  isLiked,
  getLikes,
  addBookmark,
  removeBookmark,
  isBookmarked,
  getBookmarkCount,  // 추가
  incrementViewCount,
  getViewCount
} from '../services/BoardService'
import { getPlaceById } from '../services/PlaceService'

const route = useRoute()
const router = useRouter()

const post = ref(null)
const place = ref(null)
const showPasswordModal = ref(false)
const modalAction = ref(null)
const passwordInput = ref('')

// 좋아요, 북마크, 조회수
const isUserLiked = ref(false)
const likeCount = ref(0)
const isUserBookmarked = ref(false)
const bookmarkCount = ref(0)  // 추가
const viewCount = ref(0)

onMounted(() => {
  const postId = parseInt(route.params.board_id)
  post.value = getPostById(postId)
  
  if (!post.value) {
    router.push('/board')
    return
  }
  
  // 가게 정보 로드 (동기)
  place.value = getPlaceById(post.value.placeId)
  
  // 조회수 증가
  viewCount.value = incrementViewCount(postId)
  
  // 좋아요, 북마크 상태 로드
  isUserLiked.value = isLiked(postId)
  likeCount.value = getLikes(postId)
  isUserBookmarked.value = isBookmarked(postId)
  bookmarkCount.value = getBookmarkCount(postId)  // 추가
})

function openPasswordModal(action) {
  modalAction.value = action
  passwordInput.value = ''
  showPasswordModal.value = true
}

function closePasswordModal() {
  showPasswordModal.value = false
  passwordInput.value = ''
}

function handlePasswordSubmit() {
  if (!passwordInput.value) {
    alert('비밀번호를 입력해주세요.')
    return
  }

  if (modalAction.value === 'edit') {
    handleEdit()
  } else if (modalAction.value === 'delete') {
    handleDelete()
  }
}

function handleEdit() {
  const newTitle = prompt('새 제목을 입력하세요:', post.value.title)
  if (newTitle === null) return

  const newContent = prompt('새 내용을 입력하세요:', post.value.content)
  if (newContent === null) return

  const result = updatePost(
    post.value.id,
    newTitle,
    newContent,
    passwordInput.value,
    post.value.placeId
  )

  if (result === false) {
    alert('비밀번호가 일치하지 않습니다.')
  } else {
    alert('게시글이 수정되었습니다.')
    post.value = result
    closePasswordModal()
  }
}

function handleDelete() {
  if (!confirm('정말 삭제하시겠습니까?')) return

  const result = deletePost(post.value.id, passwordInput.value)

  if (result === false) {
    alert('비밀번호가 일치하지 않습니다.')
  } else {
    alert('게시글이 삭제되었습니다.')
    closePasswordModal()
    router.push('/board')
  }
}

function handleBack() {
  router.push('/board')
}

function toggleLike() {
  if (isUserLiked.value) {
    removeLike(post.value.id)
    isUserLiked.value = false
    likeCount.value--
  } else {
    addLike(post.value.id)
    isUserLiked.value = true
    likeCount.value++
  }
}

function toggleBookmark() {
  if (isUserBookmarked.value) {
    removeBookmark(post.value.id)
    isUserBookmarked.value = false
    bookmarkCount.value--  // 개수 감소
  } else {
    addBookmark(post.value.id)
    isUserBookmarked.value = true
    bookmarkCount.value++  // 개수 증가
  }
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString('ko-KR')
}
</script>

<template>
  <div v-if="post" class="detail-view">
    <button @click="handleBack" class="back-btn">← 목록으로 돌아가기</button>

    <article class="detail-container">
      <div class="detail-grid">
        <!-- 왼쪽: 제목, 내용 -->
        <div class="main-content">
          <h1 class="post-title">{{ post.title }}</h1>
          <p class="post-meta">{{ formatDate(post.timestamp) }}</p>

          <div v-if="place" class="place-info">
            <p class="place-label">📍 추천 가게</p>
            <p class="place-name">{{ place.title }}</p>
            <p class="place-address">{{ place.address }}</p>
          </div>

          <div class="post-content">
            {{ post.content }}
          </div>

          <!-- 좌측 하단: 좋아요, 북마크, 조회수 -->
          <div class="stats-section">
            <div class="stat-item">
              <span class="stat-label">👀</span>
              <span class="stat-value">{{ viewCount }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">❤️</span>
              <span class="stat-value">{{ likeCount }}</span>
            </div>
          </div>
        </div>

        <!-- 오른쪽: 이미지 및 액션 -->
        <aside class="sidebar">
          <div class="place-image">
            <img
              v-if="place?.image"
              :src="place.image"
              :alt="place.title"
              class="detail-image"
            />
            <div v-else class="image-placeholder">
              이미지 미리보기
            </div>
          </div>

          <div class="action-section">
            <button
              @click="openPasswordModal('edit')"
              class="btn btn-edit"
            >
              수정
            </button>
            <button
              @click="openPasswordModal('delete')"
              class="btn btn-delete"
            >
              삭제
            </button>
          </div>

          <!-- 우측 하단: 좋아요, 북마크, 조회수 액션 -->
          <div class="interaction-section">
            <button
              @click="toggleLike"
              class="interaction-btn"
              :class="{ active: isUserLiked }"
            >
              <span class="icon">❤️</span>
              <span class="label">좋아요</span>
              <span class="count">{{ likeCount }}</span>
            </button>

            <button
              @click="toggleBookmark"
              class="interaction-btn"
              :class="{ active: isUserBookmarked }"
            >
              <span class="icon">🔖</span>
              <span class="label">북마크</span>
              <span class="count">{{ bookmarkCount }}</span>
            </button>

            <div class="view-count-item">
              <span class="icon">👀</span>
              <span class="label">조회</span>
              <span class="count">{{ viewCount }}</span>
            </div>
          </div>
        </aside>
      </div>
    </article>

    <!-- 비밀번호 검증 모달 -->
    <div v-if="showPasswordModal" class="modal-overlay" @click="closePasswordModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>비밀번호 확인</h2>
          <button class="close-btn" @click="closePasswordModal">×</button>
        </div>
        <div class="modal-body">
          <p>비밀번호를 입력하세요.</p>
          <input
            v-model="passwordInput"
            type="password"
            placeholder="비밀번호"
            class="input-field"
            @keyup.enter="handlePasswordSubmit"
          />
        </div>
        <div class="modal-footer">
          <button @click="handlePasswordSubmit" class="btn btn-primary">
            {{ modalAction === 'edit' ? '수정' : '삭제' }}
          </button>
          <button @click="closePasswordModal" class="btn btn-secondary">
            취소
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.detail-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 45%, #ffffff 100%);
  min-height: 100vh;
}

.back-btn {
  margin-bottom: 20px;
  padding: 12px 24px;
  background-color: #e2e8f0;
  color: #1e293b;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.3s ease;
  font-size: 14px;
}

.back-btn:hover {
  background-color: #cbd5e1;
  transform: translateX(-4px);
}

.detail-container {
  background: white;
  padding: 40px;
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 40px;
}

.post-title {
  margin: 0 0 12px 0;
  font-size: 2.2rem;
  color: #1e293b;
  font-weight: 700;
}

.post-meta {
  margin: 0 0 24px 0;
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.place-info {
  padding: 18px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  border-left: 4px solid #0ea5e9;
  margin-bottom: 30px;
}

.place-label {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #64748b;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.place-name {
  margin: 8px 0;
  font-size: 1.1rem;
  color: #1e293b;
  font-weight: 700;
}

.place-address {
  margin: 8px 0 0 0;
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
}

.post-content {
  padding: 24px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  line-height: 1.8;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: #1e293b;
  margin-bottom: 30px;
  border: 1px solid #e2e8f0;
}

.stats-section {
  display: flex;
  gap: 24px;
  padding-top: 20px;
  border-top: 2px solid #e2e8f0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-label {
  font-size: 24px;
}

.stat-value {
  color: #0ea5e9;
  font-weight: 700;
  font-size: 16px;
}

/* 사이드바 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.place-image {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.detail-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  display: block;
}

.image-placeholder {
  width: 100%;
  height: 300px;
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

.action-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn {
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.btn-edit {
  background: linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2);
}

.btn-edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.3);
}

.btn-delete {
  background-color: #fca5a5;
  color: #1e293b;
  font-weight: 700;
}

.btn-delete:hover {
  background-color: #f87171;
  transform: translateY(-2px);
}

.interaction-section {
  padding: 18px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.interaction-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 700;
  font-size: 13px;
  color: #1e293b;
}

.interaction-btn:hover {
  background: #f0f9ff;
  border-color: #0ea5e9;
  transform: translateY(-2px);
}

.interaction-btn.active {
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  border-color: #0ea5e9;
  color: #0ea5e9;
}

.interaction-btn .icon {
  font-size: 18px;
}

.interaction-btn .label {
  flex: 1;
}

.interaction-btn .count {
  font-weight: 700;
  color: #0ea5e9;
}

.view-count-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-weight: 700;
  font-size: 13px;
  color: #1e293b;
}

.view-count-item .icon {
  font-size: 18px;
}

.view-count-item .label {
  flex: 1;
}

.view-count-item .count {
  font-weight: 700;
  color: #0ea5e9;
}

/* 모달 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 90%;
  border: 2px solid #e2e8f0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 2px solid #e2e8f0;
  background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
  border-radius: 14px 14px 0 0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.3rem;
  color: white;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: white;
  font-weight: 700;
  transition: transform 0.2s ease;
}

.close-btn:hover {
  transform: rotate(90deg);
}

.modal-body {
  padding: 24px;
}

.modal-body p {
  color: #1e293b;
  margin-bottom: 12px;
  font-weight: 600;
}

.input-field {
  width: 100%;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  color: #1e293b;
  background: white;
  transition: all 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
}

.modal-footer {
  display: flex;
  gap: 10px;
  padding: 20px 24px;
  border-top: 2px solid #e2e8f0;
}

.modal-footer .btn {
  flex: 1;
}

.btn-primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2);
}

.btn-primary:hover {
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #1e293b;
  font-weight: 700;
}

.btn-secondary:hover {
  background-color: #cbd5e1;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .detail-container {
    padding: 20px;
  }

  .detail-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .post-title {
    font-size: 1.8rem;
  }

  .sidebar {
    flex-direction: column;
  }

  .interaction-section {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .interaction-btn,
  .view-count-item {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px;
    font-size: 12px;
  }
}
</style>