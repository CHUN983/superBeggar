const FAVORITES_KEY = "favoriteStores";

export function getFavorites() {
  const data = localStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
}

export function isFavorite(storeId) {
  return getFavorites().includes(storeId);
}

export function toggleFavorite(storeId) {
  const favorites = getFavorites();
  const index = favorites.indexOf(storeId);
  if (index >= 0) {
    favorites.splice(index, 1);
  } else {
    favorites.push(storeId);
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}
