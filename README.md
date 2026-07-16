<<<<<<< HEAD
# LocalHub

Vue 3 + Vite 기반의 동네 커뮤니티 챗봇 예제입니다.
=======
# localhub Busan

부산 지역 명소 정보를 공유하는 로컬 커뮤니티 플랫폼

## 기술 스택

- Vue 3 + Vite
- Tailwind CSS
- Vue Router
- Kakao Maps API

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 `.env`로 복사하고 카카오맵 API 키를 설정합니다:

```bash
cp .env.example .env
```

#### 카카오맵 API 키 발급 방법

1. [카카오 개발자 콘솔](https://developers.kakao.com/console/app) 접속
2. 로그인 후 '내 애플리케이션' 메뉴에서 애플리케이션 추가 또는 선택
3. **앱 키** 탭에서 **JavaScript 키** 복사 (⚠️ REST API 키가 아닙니다)
4. **플랫폼** 설정 메뉴로 이동
5. **Web 플랫폼 추가** 클릭
6. 사이트 도메인에 `http://localhost:5173` 추가 (개발 서버 포트에 맞게)
7. `.env` 파일에서 `VITE_KAKAO_MAP_API_KEY`에 복사한 JavaScript 키 입력

```env
VITE_KAKAO_MAP_API_KEY=your_javascript_key_here
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

## 주요 기능

- 🗺️ 부산 지역별 명소 지도
- 📝 커뮤니티 게시판
- 💬 AI 챗봇 추천

## 문제 해결

### 카카오맵 403 Forbidden 에러

지도가 표시되지 않고 403 에러가 발생하는 경우:

1. 카카오 개발자 콘솔에서 **JavaScript 키**를 사용했는지 확인 (REST API 키 ❌)
2. **플랫폼 설정**에서 현재 사용 중인 도메인(`http://localhost:5173`)이 등록되었는지 확인
3. `.env` 파일에 API 키가 올바르게 설정되었는지 확인
4. 개발 서버를 재시작 (`Ctrl+C` 후 `npm run dev`)

## Learn More

This template uses Vue 3 `<script setup>` SFCs. Check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.
>>>>>>> 2c7dcaf38e2c18851fea4012a83ef4825c9f255e

## 실행 방법

```bash
npm install
npm run dev
```

## OpenAI 연동

1. `.env.local` 파일을 생성합니다.
2. 아래 내용을 넣습니다.

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

3. 브라우저에서 챗봇에 질문하면 로컬 게시글과 OpenAI 응답을 함께 활용해 답변합니다.

> API 키는 브라우저에서 사용되므로, 민감한 정보는 절대 서버 코드에 저장하지 말고 `.env.local`로 관리하세요.
