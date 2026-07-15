// src/services/BoardService.js

const STORAGE_KEY = 'localhub_board'
const LIKES_KEY = 'localhub_likes'
const BOOKMARKS_KEY = 'localhub_bookmarks'
const VIEW_COUNTS_KEY = 'localhub_view_counts'
const BOOKMARKS_DETAIL_KEY = 'localhub_bookmarks_detail'

/**
 * 게시글 북마크 개수 조회
 */
export function getBookmarkCount(postId) {
  const bookmarksDetail = JSON.parse(localStorage.getItem(BOOKMARKS_DETAIL_KEY) || '{}')
  return bookmarksDetail[postId] || 0
}

/**
 * 북마크 추가 (수정)
 */
export function addBookmark(postId) {
  const bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]')
  
  if (!bookmarks.includes(postId)) {
    bookmarks.push(postId)
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
    
    // 북마크 개수 증가
    const bookmarksDetail = JSON.parse(localStorage.getItem(BOOKMARKS_DETAIL_KEY) || '{}')
    bookmarksDetail[postId] = (bookmarksDetail[postId] || 0) + 1
    localStorage.setItem(BOOKMARKS_DETAIL_KEY, JSON.stringify(bookmarksDetail))
  }
  
  return true
}

/**
 * 북마크 제거 (수정)
 */
export function removeBookmark(postId) {
  const bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]')
  const index = bookmarks.indexOf(postId)
  
  if (index > -1) {
    bookmarks.splice(index, 1)
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
    
    // 북마크 개수 감소
    const bookmarksDetail = JSON.parse(localStorage.getItem(BOOKMARKS_DETAIL_KEY) || '{}')
    bookmarksDetail[postId] = Math.max(0, (bookmarksDetail[postId] || 1) - 1)
    localStorage.setItem(BOOKMARKS_DETAIL_KEY, JSON.stringify(bookmarksDetail))
  }
  
  return true
}

export function getAllPosts() {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function getPostById(id) {
  const posts = getAllPosts()
  return posts.find(post => post.id === id) || null
}

export function createPost(title, content, password, placeId) {
  const posts = getAllPosts()
  
  const newPost = {
    id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
    title,
    content,
    password,
    placeId,
    timestamp: new Date().toISOString(),
    likes: 0
  }
  
  posts.push(newPost)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  
  return newPost
}

export function updatePost(id, title, content, password, placeId) {
  const posts = getAllPosts()
  const post = posts.find(p => p.id === id)
  
  if (!post) {
    console.error(`Post with id ${id} not found`)
    return false
  }
  
  if (post.password !== password) {
    console.error('Password mismatch')
    return false
  }
  
  post.title = title
  post.content = content
  post.placeId = placeId
  post.timestamp = new Date().toISOString()
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  
  return post
}

export function deletePost(id, password) {
  const posts = getAllPosts()
  const postIndex = posts.findIndex(p => p.id === id)
  
  if (postIndex === -1) {
    console.error(`Post with id ${id} not found`)
    return false
  }
  
  if (posts[postIndex].password !== password) {
    console.error('Password mismatch')
    return false
  }
  
  // 게시글 삭제
  posts.splice(postIndex, 1)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  
  // 게시글 관련 데이터 정리 (좋아요, 북마크, 조회수)
  // 1. 좋아요 제거
  const userLikes = JSON.parse(localStorage.getItem(LIKES_KEY) || '[]')
  const likeIndex = userLikes.indexOf(id)
  if (likeIndex > -1) {
    userLikes.splice(likeIndex, 1)
    localStorage.setItem(LIKES_KEY, JSON.stringify(userLikes))
  }
  
  // 2. 북마크 제거
  const bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]')
  const bookmarkIndex = bookmarks.indexOf(id)
  if (bookmarkIndex > -1) {
    bookmarks.splice(bookmarkIndex, 1)
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
  }
  
  // 3. 북마크 개수 제거
  const bookmarksDetail = JSON.parse(localStorage.getItem(BOOKMARKS_DETAIL_KEY) || '{}')
  delete bookmarksDetail[id]
  localStorage.setItem(BOOKMARKS_DETAIL_KEY, JSON.stringify(bookmarksDetail))
  
  // 4. 조회수 제거
  const viewCounts = JSON.parse(localStorage.getItem(VIEW_COUNTS_KEY) || '{}')
  delete viewCounts[id]
  localStorage.setItem(VIEW_COUNTS_KEY, JSON.stringify(viewCounts))
  
  return true
}

export function clearAllPosts() {
  localStorage.removeItem(STORAGE_KEY)
}

export function searchPosts(keyword) {
  const posts = getAllPosts()
  const lowerKeyword = keyword.toLowerCase()
  
  return posts.filter(post =>
    post.title.toLowerCase().includes(lowerKeyword) ||
    post.content.toLowerCase().includes(lowerKeyword)
  )
}

/**
 * 좋아요 관련 함수
 */
export function addLike(postId) {
  const posts = getAllPosts()
  const post = posts.find(p => p.id === postId)
  
  if (!post) return false
  
  post.likes = (post.likes || 0) + 1
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  
  // 사용자가 좋아요한 게시글 기록
  const userLikes = JSON.parse(localStorage.getItem(LIKES_KEY) || '[]')
  if (!userLikes.includes(postId)) {
    userLikes.push(postId)
    localStorage.setItem(LIKES_KEY, JSON.stringify(userLikes))
  }
  
  return true
}

export function removeLike(postId) {
  const posts = getAllPosts()
  const post = posts.find(p => p.id === postId)
  
  if (!post) return false
  
  post.likes = Math.max(0, (post.likes || 1) - 1)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  
  // 사용자가 좋아요한 게시글 기록에서 제거
  const userLikes = JSON.parse(localStorage.getItem(LIKES_KEY) || '[]')
  const index = userLikes.indexOf(postId)
  if (index > -1) {
    userLikes.splice(index, 1)
    localStorage.setItem(LIKES_KEY, JSON.stringify(userLikes))
  }
  
  return true
}

export function isLiked(postId) {
  const userLikes = JSON.parse(localStorage.getItem(LIKES_KEY) || '[]')
  return userLikes.includes(postId)
}

export function getLikes(postId) {
  const post = getPostById(postId)
  return post ? (post.likes || 0) : 0
}

export function isBookmarked(postId) {
  const bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]')
  return bookmarks.includes(postId)
}

/**
 * 조회수 관련 함수
 */
export function incrementViewCount(postId) {
  const viewCounts = JSON.parse(localStorage.getItem(VIEW_COUNTS_KEY) || '{}')
  viewCounts[postId] = (viewCounts[postId] || 0) + 1
  localStorage.setItem(VIEW_COUNTS_KEY, JSON.stringify(viewCounts))
  
  return viewCounts[postId]
}

export function getViewCount(postId) {
  const viewCounts = JSON.parse(localStorage.getItem(VIEW_COUNTS_KEY) || '{}')
  return viewCounts[postId] || 0
}