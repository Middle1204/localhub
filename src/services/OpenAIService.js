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
    ? (() => {
        // 선택적: 메시지에서 키워드 추출하여 관련 게시글 우선 선택
        const msg = (message || '').toLowerCase()
        const words = Array.from(new Set(msg.split(/\s+/).filter(Boolean)))

        // 게시글 중 제목/내용에 키워드가 포함된 것 우선 선택
        let relevant = posts.filter((post) => {
          const title = (post.title || '').toLowerCase()
          const content = (post.content || '').toLowerCase()
          return words.some((w) => w.length > 1 && (title.includes(w) || content.includes(w)))
        })

        // 부족하면 최신 게시글로 보충
        if (relevant.length === 0) {
          relevant = posts.slice(0, 5)
        }

        // 최대 5개까지, 각 항목은 id, 제목, 내용(요약)
        return relevant
          .slice(0, 5)
          .map((post) => {
            const excerpt = (post.content || '').replace(/\n+/g, ' ').slice(0, 240)
            return `- [id:${post.id}] 제목: ${post.title || '(제목 없음)'}\n  요약: ${excerpt}`
          })
          .join('\n')
      })()
    : '현재 저장된 지역 게시글이 없습니다.'

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-5-mini',
      messages: [
        {
          role: 'system',
          content: `너는 LocalHub의 부산 하이퍼-로컬 챗봇이야.
          - 사용자 질문에 답할 때 가능한 경우 항상 제공된 지역 게시글(참고 게시글)을 근거로 사용하라.
          - 참고 게시글에서 인용하거나 내용을 요약할 때는 인용 뒤에 출처 표기(예: [게시글 id:123] 또는 (출처: 게시글 제목))를 반드시 붙여라.
          - 이전 대화에서 이미 추천한 장소는 중복해서 추천하지 말고, 대신 대안이나 추가 정보를 제공해라.
          - 정보가 불확실하거나 게시글에 근거가 없으면 추정하지 말고 "확인된 정보가 없습니다"라고 명확히 알려주고, 확인 가능한 방법(예: 게시글 검색, 전화 문의)을 제안하라.
          - 개인정보나 민감한 데이터는 제공하지 마라.
          - 답변 톤은 친절하고 간결하게, 20대 여행자가 이해하기 쉬운 문장으로 작성하라.
          - 답변 마지막에는 관련 참고 게시글이 있으면 '참고자료' 섹션을 만들어 id와 제목을 최대 3개까지 표기하라.`,
        },
        {
          role: 'user',
          content: `사용자 질문: ${message}\n\n참고 게시글(최대5):\n${contextText}`,
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
