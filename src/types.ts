export interface DiaryEntry {
  id: string
  title: string
  content: string
  date: string
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  title: string
  notes: string
  dueDate: string | null
  remindOn: string | null
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface AppData {
  diaryEntries: DiaryEntry[]
  tasks: Task[]
  lastReminderShown: string | null
}
