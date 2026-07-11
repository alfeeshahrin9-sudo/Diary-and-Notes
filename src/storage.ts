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
    const parsed = JSON.parse(raw) as AppData
    return {
      diaryEntries: parsed.diaryEntries ?? [],
      tasks: parsed.tasks ?? [],
      lastReminderShown: parsed.lastReminderShown ?? null,
    }
  } catch {
    return { ...defaultData }
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
