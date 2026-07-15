<template>
  <div :class="['chatbot', { open: isOpen }]" aria-live="polite" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
    <!-- 플로팅 액션 버튼: 부산 갈매기 테마 -->
    <button 
      class="chat-toggle" 
      @click="toggle" 
      :aria-expanded="isOpen" 
      aria-controls="chat-panel" 
      aria-label="부산 여행 챗봇 열기"
    >
      <svg v-if="!isOpen" class="seagull-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- 부산 갈매기 아이콘 -->
        <path d="M12 2C11.4 2 10.9 2.3 10.6 2.8L3.5 15C3.2 15.5 3 16.1 3 16.7V18C3 19.1 3.9 20 5 20H19C20.1 20 21 19.1 21 18V16.7C21 16.1 20.8 15.5 20.5 15L13.4 2.8C13.1 2.3 12.6 2 12 2M9 10H8L6 13H5L9 6V10M16 10H17L19 13H20L16 6V10M12 11L10 15H14L12 11Z" />
      </svg>
      <svg v-else class="close-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- 채팅 패널 -->
    <div id="chat-panel" class="chat-panel" v-if="isOpen">
      <!-- 헤더 -->
      <div class="chat-header">
        <div class="header-content">
          <h3>부산 여행 가이드 🌊</h3>
          <p class="header-subtitle">부산 로컬 정보를 나눠요</p>
        </div>
        <button class="btn-reset" @click="resetChat" aria-label="대화 초기화" title="새 대화 시작">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2-8.83"></path>
          </svg>
        </button>
      </div>

      <!-- 추천 키워드 (초기 상태일 때만 표시) -->
      <div v-if="messages.length === 0" class="suggested-keywords">
        <p class="keywords-label">어떤 정보를 찾고 계신가요?</p>
        <div class="keywords-grid">
          <button 
            v-for="(keyword, idx) in suggestedKeywords" 
            :key="idx"
            class="keyword-btn"
            @click="sendQuickKeyword(keyword)"
            :aria-label="`${keyword} 검색하기`"
          >
            {{ keyword }}
          </button>
        </div>
      </div>

      <!-- 메시지 목록 -->
      <div class="messages" ref="messagesRef" role="log" aria-live="polite">
        <div v-for="(m, i) in messages" :key="i" :class="['message', m.from]">
          <div class="bubble">
            <div class="bubble-text">{{ m.text }}</div>
            <span v-if="m.timestamp" class="message-time">{{ formatTime(m.timestamp) }}</span>
          </div>
        </div>
        <!-- 입력 표시기 -->
        <div v-if="isLoading" class="message bot">
          <div class="bubble typing">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>
      </div>

      <!-- 입력 폼 -->
      <form class="chat-form" @submit.prevent="send">
        <div class="input-wrapper">
          <input 
            v-model="input" 
            placeholder="부산 정보를 물어봐주세요..."
            @keydown.enter.prevent="send"
            aria-label="메시지 입력"
            maxlength="500"
          />
          <button type="submit" class="btn-send" aria-label="메시지 전송" :disabled="!input.trim()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.9429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,0.994641125 C3.34915502,0.661890152 2.40734225,0.772762535 1.77946707,1.44381618 C0.994623095,2.0597696 0.837654326,3.0023539 1.15159189,3.78785078 L3.03521743,10.2288438 C3.03521743,10.3859412 3.19218622,10.5430386 3.50612381,10.5430386 L16.6915026,11.3285254 C16.6915026,11.3285254 17.1624089,11.3285254 17.1624089,10.8572333 L17.1624089,11.7998176 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"/>
            </svg>
          </button>
        </div>
        <div class="char-count">{{ input.length }}/500</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import BoardService from '../services/BoardService.js'
import { askOpenAI } from '../services/OpenAIService.js'

// 상태 관리
const isOpen = ref(false)
const input = ref('')
const messages = ref([])
const messagesRef = ref(null)
const isLoading = ref(false)
const storageKey = 'localhub_chat_messages'
const contextKey = 'localhub_chat_context'

// 터치 제스처 관리
let touchStartY = 0
let touchEndY = 0

// 추천 키워드
const suggestedKeywords = [
  '🍜 부산 맛집 추천',
  '🎉 오늘의 축제',
  '📸 인스타 감성 카페',
  '🚢 해운대 여행 팁'
]

// 대화 컨텍스트 (히스토리 기억용)
const chatContext = ref({
  lastTopic: '', // 마지막 주제
  mentionedPlaces: [], // 언급된 장소들
  recommendations: [] // 추천했던 항목들
})

// 초기화
onMounted(() => {
  loadMessages()
  loadContext()
})

// 메시지 저장/로드
function loadMessages() {
  try {
    const raw = localStorage.getItem(storageKey)
    if (raw) messages.value = JSON.parse(raw)
  } catch (e) {
    messages.value = []
  }
}

function saveMessages() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(messages.value))
  } catch (e) {}
}

// 컨텍스트 저장/로드
function loadContext() {
  try {
    const raw = localStorage.getItem(contextKey)
    if (raw) chatContext.value = JSON.parse(raw)
  } catch (e) {}
}

function saveContext() {
  try {
    localStorage.setItem(contextKey, JSON.stringify(chatContext.value))
  } catch (e) {}
}

watch(messages, saveMessages)
watch(chatContext, saveContext, { deep: true })

// 메시지 전송
async function send() {
  const text = input.value && input.value.trim()
  if (!text) return

  const now = new Date().toISOString()
  messages.value.push({ from: 'user', text, timestamp: now })
  input.value = ''
  isLoading.value = true
  await nextTick()
  scrollToBottom()

  // 주제 업데이트
  updateContext(text)

  // 로컬 검색
  const results = BoardService.search(text)
  if (results && results.length) {
    const lines = results.slice(0, 3).map((r, idx) => 
      `${idx + 1}. ${r.title || r.content.slice(0, 30)} (${new Date(r.createdAt).toLocaleDateString()})`
    )
    messages.value.push({ 
      from: 'bot', 
      text: `검색 결과가 ${results.length}건 있어요. 주요 결과:\n${lines.join('\n')}\n원하시면 번호를 눌러 상세를 보여드릴게요.`,
      timestamp: new Date().toISOString()
    })
    isLoading.value = false
    return
  }

  // AI 응답 (히스토리 포함)
  try {
    const aiReply = await askOpenAI({ 
      message: text, 
      posts: BoardService.getAll(),
      context: buildContextForAI()
    })
    if (aiReply) {
      messages.value.push({ 
        from: 'bot', 
        text: aiReply,
        timestamp: new Date().toISOString()
      })
    } else {
      messages.value.push({ 
        from: 'bot', 
        text: '아쉽지만, 해당 정보를 찾을 수 없어요. "부산 맛집 추천", "축제 일정" 등 다른 질문을 해보세요!',
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error('Chat error:', error)
    messages.value.push({ 
      from: 'bot', 
      text: 'AI 응답을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.',
      timestamp: new Date().toISOString()
    })
  } finally {
    isLoading.value = false
    await nextTick()
    scrollToBottom()
  }
}

// 빠른 키워드 전송
function sendQuickKeyword(keyword) {
  input.value = keyword
  send()
}

// 컨텍스트 업데이트
function updateContext(userMessage) {
  const msg = userMessage.toLowerCase()
  
  // 주제 인식
  if (msg.includes('맛집') || msg.includes('식당')) {
    chatContext.value.lastTopic = '맛집'
  } else if (msg.includes('축제') || msg.includes('행사')) {
    chatContext.value.lastTopic = '축제'
  } else if (msg.includes('카페')) {
    chatContext.value.lastTopic = '카페'
  } else if (msg.includes('해운대') || msg.includes('광안리')) {
    chatContext.value.lastTopic = '해변'
  }
  
  // 장소 기록 (중복 제거)
  if (!chatContext.value.mentionedPlaces.includes(userMessage)) {
    chatContext.value.mentionedPlaces.push(userMessage)
    if (chatContext.value.mentionedPlaces.length > 10) {
      chatContext.value.mentionedPlaces.shift()
    }
  }
}

// AI용 컨텍스트 빌드
function buildContextForAI() {
  return {
    lastTopic: chatContext.value.lastTopic,
    conversationLength: messages.value.length,
    hasContext: messages.value.length > 2
  }
}

// 대화 초기화
function resetChat() {
  if (confirm('대화 내용을 모두 삭제하시겠어요?')) {
    messages.value = []
    chatContext.value = {
      lastTopic: '',
      mentionedPlaces: [],
      recommendations: []
    }
    input.value = ''
    saveMessages()
    saveContext()
  }
}

// UI 함수들
function toggle() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(scrollToBottom)
  } else {
    touchStartY = 0
    touchEndY = 0
  }
}

function scrollToBottom() {
  const el = messagesRef.value
  if (el) {
    setTimeout(() => {
      el.scrollTop = el.scrollHeight
    }, 0)
  }
}

// 터치 제스처: swipe-down-to-close
function touchStart(e) {
  touchStartY = e.changedTouches[0].screenY
}

function touchMove(e) {
  // 선택적: 드래그 시각적 피드백
}

function touchEnd(e) {
  touchEndY = e.changedTouches[0].screenY
  const diff = touchEndY - touchStartY
  
  if (diff > 100 && isOpen.value && messagesRef.value?.scrollTop === 0) {
    toggle()
  }
}

// 시간 포맷
function formatTime(timestamp) {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}
</script>

<style scoped>
/* 부산 테마 색상 팔레트 - chatbot 컴포넌트에서 정의 */
.chatbot {
  --busan-blue: #0066cc;      /* 맑은 바다 파란색 */
  --busan-light-blue: #e6f2ff; /* 밝은 파란색 */
  --busan-sand: #ffc966;       /* 따뜻한 모래 노란색 */
  --busan-coral: #ff8c5a;      /* 산호색 */
  --busan-dark: #1a1a2e;       /* 진한 네이비 */
  
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans KR', sans-serif;
}

/* 플로팅 버튼 */
.chat-toggle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #0066cc 0%, #ff8c5a 100%);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
  transition: all 0.3s ease;
  font-size: 24px;
  z-index: 10000;
}

.chat-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 102, 204, 0.4);
}

.chat-toggle:active {
  transform: scale(0.95);
}

.seagull-icon {
  width: 32px;
  height: 32px;
  animation: float 3s ease-in-out infinite;
}

.close-icon {
  width: 20px;
  height: 20px;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

/* 채팅 패널 */
.chat-panel {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 380px;
  height: 600px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 헤더 */
.chat-header {
  background: linear-gradient(135deg, #0066cc 0%, #ff8c5a 100%);
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.header-content h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.header-subtitle {
  margin: 4px 0 0 0;
  font-size: 12px;
  opacity: 0.9;
}

.btn-reset {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  color: white;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reset:hover {
  background: rgba(255, 255, 255, 0.3);
}

.btn-reset:active {
  transform: scale(0.95);
}

/* 추천 키워드 */
.suggested-keywords {
  padding: 16px;
  border-bottom: 1px solid #e5e5e5;
  flex-shrink: 0;
}

.keywords-label {
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 500;
  color: #666;
}

.keywords-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.keyword-btn {
  background: #e6f2ff;
  border: 1px solid #0066cc;
  border-radius: 8px;
  color: #0066cc;
  padding: 10px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.keyword-btn:hover {
  background: #0066cc;
  color: white;
}

.keyword-btn:active {
  transform: scale(0.95);
}

/* 메시지 영역 */
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
  animation: messageIn 0.3s ease-out;
}

@keyframes messageIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  justify-content: flex-end;
}

.message.bot {
  justify-content: flex-start;
}

.bubble {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 12px;
  word-wrap: break-word;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message.user .bubble {
  background: #0066cc;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.bot .bubble {
  background: #e6f2ff;
  color: #1a1a2e;
  border-bottom-left-radius: 4px;
}

.bubble-text {
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
}

/* 입력 표시기 */
.typing {
  display: flex;
  align-items: center;
  gap: 4px;
}

.typing-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #0066cc;
  animation: typing 1.4s infinite;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    opacity: 0.5;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateY(-10px);
  }
}

/* 입력 폼 */
.chat-form {
  padding: 12px 16px;
  border-top: 1px solid #e5e5e5;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.chat-form input {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s;
  min-height: 44px;
}

.chat-form input:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 3px #e6f2ff;
}

.btn-send {
  background: linear-gradient(135deg, #0066cc 0%, #ff8c5a 100%);
  border: none;
  border-radius: 8px;
  color: white;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-send:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.3);
}

.btn-send:active:not(:disabled) {
  transform: scale(0.95);
}

.btn-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.char-count {
  font-size: 11px;
  color: #999;
  text-align: right;
}

/* 모바일 반응형 */
@media (max-width: 480px) {
  .chatbot {
    bottom: 16px;
    right: 16px;
  }

  .chat-toggle {
    width: 52px;
    height: 52px;
  }

  .chat-panel {
    width: calc(100vw - 32px);
    height: 70vh;
    max-height: 600px;
    bottom: 70px;
  }

  .keywords-grid {
    grid-template-columns: 1fr;
  }

  .bubble {
    max-width: 90%;
  }
}

/* 다크모드 지원 */
@media (prefers-color-scheme: dark) {
  .chat-panel {
    background: #1a1a2e;
    color: #f0f0f0;
  }

  .messages {
    background: #0f0f1e;
  }

  .message.bot .bubble {
    background: rgba(0, 102, 204, 0.2);
    color: #e0e0e0;
  }

  .chat-form input {
    background: #2a2a3e;
    border-color: #404050;
    color: #f0f0f0;
  }

  .chat-form input::placeholder {
    color: #999;
  }

  .chat-form input:focus {
    border-color: #ff8c5a;
    box-shadow: 0 0 0 3px rgba(255, 140, 90, 0.1);
  }

  .keyword-btn {
    background: rgba(0, 102, 204, 0.15);
    color: #ffc966;
    border-color: #ff8c5a;
  }

  .keyword-btn:hover {
    background: #ff8c5a;
    color: white;
  }
}

/* 접근성 */
.chat-toggle:focus-visible,
.btn-send:focus-visible,
.btn-reset:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .chat-toggle,
  .chat-panel,
  .message,
  .seagull-icon {
    animation: none;
    transition: none;
  }
}
</style>