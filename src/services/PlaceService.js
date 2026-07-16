// src/services/PlaceService.js

// 정적 import로 모든 데이터 파일을 미리 로드 (배포 환경 호환성)
import 관광지Data from '../data/places/부산_관광지.json';
import 레포츠Data from '../data/places/부산_레포츠.json';
import 문화시설Data from '../data/places/부산_문화시설.json';
import 쇼핑Data from '../data/places/부산_쇼핑.json';
import 숙박Data from '../data/places/부산_숙박.json';
import 여행코스Data from '../data/places/부산_여행코스.json';
import 축제공연행사Data from '../data/places/부산_축제공연행사.json';

/**
 * 카테고리 정의 (정적 데이터와 매핑)
 */
const CATEGORIES = {
  TOURIST: { id: 'tourist', label: '관광지', data: 관광지Data },
  SPORTS: { id: 'sports', label: '레포츠', data: 레포츠Data },
  CULTURE: { id: 'culture', label: '문화시설', data: 문화시설Data },
  SHOPPING: { id: 'shopping', label: '쇼핑', data: 쇼핑Data },
  ACCOMMODATION: { id: 'accommodation', label: '숙박', data: 숙박Data },
  COURSE: { id: 'course', label: '여행코스', data: 여행코스Data },
  FESTIVAL: { id: 'festival', label: '축제공연행사', data: 축제공연행사Data }
}

/**
 * 가공된 데이터 캐시
 */
const dataCache = new Map()

/**
 * 카테고리 데이터 로드 및 가공 (정적 데이터 사용)
 * @param {string} categoryId - 카테고리 ID
 * @returns {Array} 가게 데이터 배열
 */
function loadCategoryData(categoryId) {
  // 캐시에 있으면 반환
  if (dataCache.has(categoryId)) {
    return dataCache.get(categoryId)
  }

  const category = CATEGORIES[categoryId.toUpperCase()] || CATEGORIES.SHOPPING
  const items = category.data.items || []
  
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
 * 특정 카테고리의 모든 가게 조회
 * @param {string} categoryId - 카테고리 ID (기본값: 'SHOPPING')
 * @param {number} limit - 최대 개수 (기본값: 20)
 * @returns {Array} 가게 배열
 */
export function getPlacesByCategory(categoryId = 'SHOPPING', limit = 20) {
  const places = loadCategoryData(categoryId)
  return places.slice(0, limit)
}

/**
 * 모든 카테고리에서 가게 조회
 * @param {number} limit - 카테고리당 최대 개수
 * @returns {Array} 모든 카테고리의 가게들
 */
export function getAllPlaces(limit = 5) {
  const allPlaces = []
  
  for (const category of Object.keys(CATEGORIES)) {
    const places = loadCategoryData(category)
    allPlaces.push(...places.slice(0, limit))
  }
  
  return allPlaces
}

/**
 * ID로 가게 조회 (모든 카테고리에서 검색)
 * @param {string} id - 가게 ID
 * @returns {Object|null}
 */
export function getPlaceById(id) {
  for (const categoryKey of Object.keys(CATEGORIES)) {
    const places = loadCategoryData(categoryKey)
    // 타입 불일치 문제 해결: 문자열로 변환하여 비교
    const place = places.find(p => String(p.id) === String(id))
    if (place) return place
  }
  return null
}

/**
 * 키워드로 가게 검색 (특정 카테고리)
 * @param {string} keyword - 검색 키워드
 * @param {string} categoryId - 카테고리 ID (선택사항: 공백이면 전체 검색)
 * @returns {Array} 검색 결과
 */
export function searchPlaces(keyword, categoryId = '') {
  const lowerKeyword = keyword.toLowerCase()
  let searchData = []

  if (categoryId) {
    // 특정 카테고리에서만 검색
    searchData = loadCategoryData(categoryId)
  } else {
    // 모든 카테고리에서 검색
    for (const key of Object.keys(CATEGORIES)) {
      const places = loadCategoryData(key)
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
 * @returns {Object} { categoryId: count }
 */
export function getCategoryCounts() {
  const counts = {}
  
  for (const categoryKey of Object.keys(CATEGORIES)) {
    const places = loadCategoryData(categoryKey)
    counts[categoryKey] = places.length
  }
  
  return counts
}