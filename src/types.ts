export type DiaryMood = 'great' | 'good' | 'okay' | 'tired' | 'stressed'

export type TaskPriority = 'low' | 'medium' | 'high'

export interface DiaryEntry {
  id: string
  title: string
  content: string
  date: string
  mood?: DiaryMood
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  title: string
  notes: string
  dueDate: string | null
  remindOn: string | null
  priority?: TaskPriority
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface AppData {
  diaryEntries: DiaryEntry[]
  tasks: Task[]
  lastReminderShown: string | null
}
