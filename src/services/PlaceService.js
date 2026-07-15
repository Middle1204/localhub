// src/services/PlaceService.js

/**
 * 카테고리 정의
 */
const CATEGORIES = {
  TOURIST: { id: 'tourist', label: '관광지', file: '부산_관광지.json' },
  SPORTS: { id: 'sports', label: '레포츠', file: '부산_레포츠.json' },
  CULTURE: { id: 'culture', label: '문화시설', file: '부산_문화시설.json' },
  SHOPPING: { id: 'shopping', label: '쇼핑', file: '부산_쇼핑.json' },
  ACCOMMODATION: { id: 'accommodation', label: '숙박', file: '부산_숙박.json' },
  COURSE: { id: 'course', label: '여행코스', file: '부산_여행코스.json' },
  FESTIVAL: { id: 'festival', label: '축제공연행사', file: '부산_축제공연행사.json' }
}

/**
 * 동적 데이터 로드 캐시
 */
const dataCache = new Map()

/**
 * JSON 파일 비동기 로드
 * @param {string} categoryId - 카테고리 ID
 * @returns {Promise<Array>} 가게 데이터 배열
 */
async function loadCategoryData(categoryId) {
  // 캐시에 있으면 반환
  if (dataCache.has(categoryId)) {
    return dataCache.get(categoryId)
  }

  const category = CATEGORIES[categoryId.toUpperCase()] || CATEGORIES.SHOPPING
  
  try {
    // Vite 경고 억제 - 런타임 시 동적으로 파일을 필요할 때만 로드
    const module = await import(/* @vite-ignore */ `../data/${category.file}`)
    const items = module.default.items || []
    
    // 가공된 데이터 저장
    const processedData = items.map(place => ({
      id: place.contentid,
      title: place.title,
      image: place.firstimage || place.firstimage2 || '',
      address: place.addr1,
      tel: place.tel || '정보 없음',
      category: category.id,
      categoryLabel: category.label
    }))
    
    // 캐시 저장
    dataCache.set(categoryId, processedData)
    
    return processedData
  } catch (error) {
    console.error(`Failed to load ${category.file}:`, error)
    return []
  }
}

/**
 * 모든 카테고리 목록 조회
 * @returns {Array} 카테고리 배열 [{ id, label }]
 */
export function getAllCategories() {
  return Object.values(CATEGORIES).map(cat => ({
    id: cat.id,
    label: cat.label
  }))
}

/**
 * 특정 카테고리의 모든 가게 조회 (비동기)
 * @param {string} categoryId - 카테고리 ID (기본값: 'SHOPPING')
 * @param {number} limit - 최대 개수 (기본값: 20)
 * @returns {Promise<Array>} 가게 배열
 */
export async function getPlacesByCategory(categoryId = 'SHOPPING', limit = 20) {
  const places = await loadCategoryData(categoryId)
  return places.slice(0, limit)
}

/**
 * 모든 카테고리에서 가게 조회
 * @param {number} limit - 카테고리당 최대 개수
 * @returns {Promise<Array>} 모든 카테고리의 가게들
 */
export async function getAllPlaces(limit = 5) {
  const allPlaces = []
  
  for (const category of Object.keys(CATEGORIES)) {
    const places = await loadCategoryData(category)
    allPlaces.push(...places.slice(0, limit))
  }
  
  return allPlaces
}

/**
 * ID로 가게 조회 (모든 카테고리에서 검색)
 * @param {string} id - 가게 ID
 * @returns {Promise<Object|null>}
 */
export async function getPlaceById(id) {
  for (const categoryKey of Object.keys(CATEGORIES)) {
    const places = await loadCategoryData(categoryKey)
    const place = places.find(p => p.id === id)
    if (place) return place
  }
  return null
}

/**
 * 키워드로 가게 검색 (특정 카테고리)
 * @param {string} keyword - 검색 키워드
 * @param {string} categoryId - 카테고리 ID (선택사항: 공백이면 전체 검색)
 * @returns {Promise<Array>} 검색 결과
 */
export async function searchPlaces(keyword, categoryId = '') {
  const lowerKeyword = keyword.toLowerCase()
  let searchData = []

  if (categoryId) {
    // 특정 카테고리에서만 검색
    searchData = await loadCategoryData(categoryId)
  } else {
    // 모든 카테고리에서 검색
    for (const key of Object.keys(CATEGORIES)) {
      const places = await loadCategoryData(key)
      searchData.push(...places)
    }
  }

  return searchData.filter(place =>
    place.title.toLowerCase().includes(lowerKeyword) ||
    place.address.toLowerCase().includes(lowerKeyword)
  )
}

/**
 * 카테고리별 가게 개수 조회
 * @returns {Promise<Object>} { categoryId: count }
 */
export async function getCategoryCounts() {
  const counts = {}
  
  for (const categoryKey of Object.keys(CATEGORIES)) {
    const places = await loadCategoryData(categoryKey)
    counts[categoryKey] = places.length
  }
  
  return counts
}