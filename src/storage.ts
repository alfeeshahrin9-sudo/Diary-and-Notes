import type { AppData } from './types'

const STORAGE_KEY = 'diary-and-notes-data'

const defaultData: AppData = {
  diaryEntries: [],
  tasks: [],
  lastReminderShown: null,
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultData }
    const parsed = JSON.parse(raw) as Partial<AppData> | null
    if (!parsed || typeof parsed !== 'object') return { ...defaultData }
    return {
      diaryEntries: Array.isArray(parsed.diaryEntries) ? parsed.diaryEntries : [],
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      lastReminderShown:
        typeof parsed.lastReminderShown === 'string' ? parsed.lastReminderShown : null,
    }
  } catch {
    return { ...defaultData }
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Ignore storage quota or private browsing errors
  }
}
