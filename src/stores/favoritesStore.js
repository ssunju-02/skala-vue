import { ref } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'skala-weather-favorites'

const loadFavoriteIds = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const useFavoritesStore = defineStore('favorites', () => {
  const favoriteIds = ref(loadFavoriteIds())

  const isFavorite = (cityId) => favoriteIds.value.includes(cityId)

  const toggleFavorite = (cityId) => {
    favoriteIds.value = isFavorite(cityId)
      ? favoriteIds.value.filter((id) => id !== cityId)
      : [...favoriteIds.value, cityId]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds.value))
  }

  return { favoriteIds, isFavorite, toggleFavorite }
})
