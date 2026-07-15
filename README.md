# LocalHub

Vue 3 + Vite 기반의 동네 커뮤니티 챗봇 예제입니다.

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
