<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function navigateToBoard() {
  router.push('/board')
}

function navigateToCreate() {
  router.push('/create')
}
</script>

<template>
  <div class="main-view">
    <section class="hero">
      <div class="hero-content">
        <h1>LocalHub</h1>
        <p class="subtitle">공공데이터 기반 지역 정보 공유 커뮤니티</p>
        <p class="description">
          당신 주변의 숨겨진 명소, 맛집, 관광지를 함께 발견하고 공유하세요.
        </p>
        <div class="cta-buttons">
          <button @click="navigateToBoard" class="btn btn-primary">
            게시글 보기
          </button>
          <button @click="navigateToCreate" class="btn btn-secondary">
            게시글 작성
          </button>
        </div>
      </div>
    </section>

    <section class="features">
      <h2>주요 기능</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon">🏙️</div>
          <h3>지역 정보</h3>
          <p>부산의 다양한 관광지, 맛집, 쇼핑 정보를 한눈에 확인하세요.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">💬</div>
          <h3>커뮤니티</h3>
          <p>당신의 경험과 팁을 공유하고 다른 사람의 의견을 들어보세요.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🤖</div>
          <h3>AI 추천</h3>
          <p>스마트한 AI 어시스턴트가 당신에게 딱 맞는 장소를 추천합니다.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📍</div>
          <h3>지도 연동</h3>
          <p>지도 위치 정보로 쉽게 찾아갈 수 있습니다.</p>
        </div>
      </div>
    </section>

    <section class="stats">
      <div class="stat-item">
        <h3>1000+</h3>
        <p>지역 정보</p>
      </div>
      <div class="stat-item">
        <h3>500+</h3>
        <p>활동 회원</p>
      </div>
      <div class="stat-item">
        <h3>2000+</h3>
        <p>공유된 팁</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.main-view {
  width: 100%;
}

/* Hero 섹션 */
.hero {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  padding: 80px 20px;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 15px;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 1.3rem;
  margin-bottom: 15px;
  font-weight: 600;
}

.description {
  font-size: 1.1rem;
  margin-bottom: 40px;
  opacity: 0.95;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 14px 32px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: white;
  color: #007bff;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* Features 섹션 */
.features {
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.features h2 {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 60px;
  color: #333;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.feature-card {
  background: white;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: #333;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
  font-size: 0.95rem;
}

/* Stats 섹션 */
.stats {
  background-color: #f8f9fa;
  padding: 60px 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.stat-item {
  text-align: center;
}

.stat-item h3 {
  font-size: 2.5rem;
  color: #007bff;
  margin-bottom: 10px;
  font-weight: 700;
}

.stat-item p {
  font-size: 1rem;
  color: #666;
  font-weight: 500;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .hero {
    padding: 50px 20px;
  }

  .hero h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .description {
    font-size: 0.95rem;
    margin-bottom: 30px;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .features {
    padding: 50px 20px;
  }

  .features h2 {
    font-size: 1.8rem;
    margin-bottom: 40px;
  }

  .feature-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .feature-card {
    padding: 25px 20px;
  }

  .feature-icon {
    font-size: 2.5rem;
  }

  .stat-item h3 {
    font-size: 1.8rem;
  }

  .stat-item p {
    font-size: 0.9rem;
  }
}
</style>