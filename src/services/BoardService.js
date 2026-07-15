const STORAGE_KEY = 'localhub_posts'

function _read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

function _write(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (e) {}
}

export default {
  getAll() {
    return _read()
  },
  get(id) {
    const items = _read()
    return items.find((i) => i.id === id)
  },
  create({ title, content, author, password }) {
    const items = _read()
    const id = Date.now().toString()
    const item = { id, title, content, author: author || '익명', password: password || '', createdAt: new Date().toISOString() }
    items.unshift(item)
    _write(items)
    return item
  },
  update(id, patch) {
    const items = _read()
    const idx = items.findIndex((i) => i.id === id)
    if (idx === -1) return null
    items[idx] = { ...items[idx], ...patch }
    _write(items)
    return items[idx]
  },
  remove(id) {
    let items = _read()
    items = items.filter((i) => i.id !== id)
    _write(items)
    return true
  },
  search(query) {
    if (!query || !query.trim()) return []
    const q = query.toLowerCase()
    const items = _read()
    return items.filter((i) => {
      return (i.title && i.title.toLowerCase().includes(q)) || (i.content && i.content.toLowerCase().includes(q))
    })
  },
}
