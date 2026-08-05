import axios from 'axios'

const quoteApi = axios.create({
  baseURL: 'https://korean-advice-open-api.vercel.app/api',
  timeout: 8000,
})

const STORAGE_KEY = 'daily-quote'

const todayKey = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date())

const readCache = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed.date === todayKey() ? parsed.quote : null
  } catch {
    return null
  }
}

const writeCache = (quote) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: todayKey(), quote }))
  } catch {
    // localStorage unavailable (private mode, storage full, etc.) — skip caching
  }
}

export const fetchDailyQuote = async () => {
  const cached = readCache()
  if (cached) return cached

  const { data } = await quoteApi.get('/advice')
  const quote = {
    message: data.message,
    author: data.author,
    authorProfile: data.authorProfile,
  }
  writeCache(quote)
  return quote
}
