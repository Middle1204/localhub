import OpenAI from 'openai'

const apiKey = import.meta.env.VITE_OPENAI_API_KEY

let client = null

if (apiKey) {
  client = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  })
}

export async function askOpenAI({ message, posts = [] }) {
  if (!client) {
    return null
  }

  const contextText = posts.length
    ? posts
        .slice(0, 5)
        .map((post) => `- 제목: ${post.title || '(제목 없음)'} / 내용: ${post.content || ''}`)
        .join('\n')
    : '현재 저장된 지역 게시글이 없습니다.'

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-5-mini',
      messages: [
        {
          role: 'system',
          content:
            '너는 LocalHub의 동네 커뮤니티 챗봇이야. 지역 커뮤니티, 동네 게시글, 맛집, 행사, 가게 추천, 생활 정보에 대해 따뜻하고 친근하게 답해줘. 개인정보는 다루지 말고, 근거 없는 루머는 피하며, 모르면 솔직하게 말해줘.',
        },
        {
          role: 'user',
          content: `사용자 질문: ${message}\n\n참고 게시글:\n${contextText}`,
        },
      ],
    })

    return completion.choices?.[0]?.message?.content?.trim() || null
  } catch (error) {
    console.error('OpenAI request failed:', error)
    return null
  }
}

export default {
  ask: askOpenAI,
}
