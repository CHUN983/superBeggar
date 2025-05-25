import { ref } from 'vue'

const FAVORITE_KEY = 'favoriteStores'
const favoriteMap = ref(new Map())

// 初始化：從 localStorage 還原
try {
  const raw = JSON.parse(localStorage.getItem(FAVORITE_KEY) || '[]')
  for (const item of raw) {
    favoriteMap.value.set(item.id, item)
  }
} catch (e) {
  console.error('Failed to parse favorites:', e)
}

function saveToStorage() {
  localStorage.setItem(FAVORITE_KEY, JSON.stringify([...favoriteMap.value.values()]))
}

export function useFavorites() {

  function toggleFavorite(store) {
    const id = store.id
    if (favoriteMap.value.has(id)) {
      favoriteMap.value.delete(id)
    } else {
  
      favoriteMap.value.set(id, {
        ...store,
      })
    }
    saveToStorage()
  }

  function isFavorited(id) {
    return favoriteMap.value.has(id)
  }

  function getAllFavorites() {
    return [...favoriteMap.value.values()]
  }

  return { toggleFavorite, isFavorited, getAllFavorites }
}
