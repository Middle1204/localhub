<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
const messages = ref([])
const inputMessage = ref('')

function toggleChat() {
  isOpen.value = !isOpen.value
}

function sendMessage() {
  if (!inputMessage.value.trim()) return

  // 사용자 메시지 추가
  messages.value.push({
    type: 'user',
    content: inputMessage.value
  })

  // 임시 응답 (나중에 OpenAI API로 연동)
  setTimeout(() => {
    messages.value.push({
      type: 'ai',
      content: '현재 AI 기능은 준비 중입니다.'
    })
  }, 500)

  inputMessage.value = ''
}
</script>

<template>
  <div class="chat-container">
    <!-- 플로팅 채팅 버튼 -->
    <button @click="toggleChat" class="chat-toggle-btn">
      💬
    </button>

    <!-- 채팅 창 -->
    <div v-if="isOpen" class="chat-window">
      <div class="chat-header">
        <h3>LocalHub AI Assistant</h3>
        <button @click="toggleChat" class="close-btn">×</button>
      </div>

      <div class="chat-messages">
        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          class="message"
          :class="msg.type"
        >
          {{ msg.content }}
        </div>
      </div>

      <div class="chat-input">
        <input
          v-model="inputMessage"
          type="text"
          placeholder="메시지를 입력하세요..."
          @keyup.enter="sendMessage"
          class="input-field"
        />
        <button @click="sendMessage" class="send-btn">전송</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
  font-family: inherit;
}

.chat-toggle-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  border: none;
  font-size: 28px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
  transition: all 0.3s ease;
}

.chat-toggle-btn:hover {
  background-color: #0056b3;
  transform: scale(1.1);
}

.chat-window {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
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

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border-radius: 12px 12px 0 0;
}

.chat-header h3 {
  margin: 0;
  font-size: 1rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  padding: 10px 12px;
  border-radius: 8px;
  max-width: 80%;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.4;
}

.message.user {
  align-self: flex-end;
  background-color: #007bff;
  color: white;
  border-bottom-right-radius: 2px;
}

.message.ai {
  align-self: flex-start;
  background-color: #e9ecef;
  color: #333;
  border-bottom-left-radius: 2px;
}

.chat-input {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #e0e0e0;
  background-color: #f9f9f9;
  border-radius: 0 0 12px 12px;
}

.input-field {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 13px;
  font-family: inherit;
  outline: none;
}

.input-field:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

.send-btn {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.send-btn:hover {
  background-color: #0056b3;
}

@media (max-width: 480px) {
  .chat-window {
    width: 100%;
    height: 100%;
    position: fixed;
    bottom: 0;
    right: 0;
    border-radius: 0;
  }

  .message {
    max-width: 90%;
  }
}
</style>