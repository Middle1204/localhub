import OpenAI from 'openai'

const apiKey = import.meta.env.VITE_OPENAI_API_KEY

let client = null

if (apiKey) {
  client = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  })
}

function buildDummyReply({ message = '', posts = [] }) {
  const text = message.toLowerCase()
  
  if (text.includes('맛집') || text.includes('식당')) {
    return '부산의 유명한 맛집 정보는 게시글에서 검색해보세요! 해운대, 서면, 남포동 등 지역별로 다양한 음식점이 있어요. 특정 지역이나 음식 종류를 알려주면 더 구체적인 추천을 해드릴 수 있어요.'
  }
  if (text.includes('축제') || text.includes('행사')) {
    return '부산의 축제와 행사 정보는 게시글을 확인해보세요! 부산국제영화제, 해운대 해수욕장 축제 등 다양한 이벤트가 있습니다. 언제쯤 방문하시나요?'
  }
  if (text.includes('카페')) {
    return '인스타 감성 카페를 찾고 계세요? 부산에는 정말 멋진 카페들이 많아요. 해운대 카페거리, 감천문화마을, 광안리 카페거리 등이 유명합니다. 어느 지역을 선호하시나요?'
  }
  if (text.includes('해운대') || text.includes('광안리')) {
    return '해변을 즐기려고 하시는군요! 부산의 해수욕장들은 정말 아름다워요. 해운대는 활기차고, 광안리는 낭만적인 분위기입니다. 더 자세히 알고 싶으신 부분이 있으신가요?'
  }
  
  return '부산 여행에 대해 도움을 드릴 준비가 되어 있어요! 맛집, 축제, 카페, 해변 등 다양한 정보를 물어봐주세요. 저는 부산의 로컬 정보를 담은 게시글들도 검색할 수 있답니다.'
}

export async function askOpenAI({ message, posts = [], context = {} }) {
  if (!client) {
    return buildDummyReply({ message, posts })
  }

  const contextText = posts.length
    ? posts
        .slice(0, 5)
        .map((post) => `- 제목: ${post.title || '(제목 없음)'} / 내용: ${post.content || ''}`)
        .join('\n')
    : '현재 저장된 지역 게시글이 없습니다.'

  // 대화 맥락 포함
  const contextHint = context?.hasContext && context?.lastTopic
    ? `사용자는 이전에 ${context.lastTopic}에 대해 물어봤습니다. 관련된 내용으로 답변해주세요.`
    : ''

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content:
            `너는 LocalHub의 부산 여행 가이드 챗봇이야. 부산 여행객들을 위해 따뜻하고 친근하게 지역 정보를 제공해줘. 맛집, 축제, 카페, 해변, 명소 추천에 능숙해야 해. 이전 대화 맥락을 고려해서 자연스럽게 이어나가. ${contextHint}`,
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
    return buildDummyReply({ message, posts })
  }
}

export default {
  ask: askOpenAI,
}