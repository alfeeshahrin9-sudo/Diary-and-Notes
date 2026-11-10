import { useCallback, useEffect, useState } from 'react'
import { loadData, saveData } from '../storage'
import type { AppData, DiaryEntry, DiaryMood, Task, TaskPriority } from '../types'
import { todayString } from '../utils/dates'

function createId(): string {
  return crypto.randomUUID()
}

export function useStore() {
  const [data, setData] = useState<AppData>(() => loadData())

  useEffect(() => {
    saveData(data)
  }, [data])

  const addDiaryEntry = useCallback(
    (title: string, content: string, date: string, mood?: DiaryMood) => {
      const now = new Date().toISOString()
      const entry: DiaryEntry = {
        id: createId(),
        title,
        content,
        date,
        mood,
        createdAt: now,
        updatedAt: now,
      }
      setData((prev) => ({
        ...prev,
        diaryEntries: [entry, ...prev.diaryEntries],
      }))
    },
    [],
  )

  const updateDiaryEntry = useCallback(
    (id: string, title: string, content: string, date: string, mood?: DiaryMood) => {
      setData((prev) => ({
        ...prev,
        diaryEntries: prev.diaryEntries.map((entry) =>
          entry.id === id
            ? { ...entry, title, content, date, mood, updatedAt: new Date().toISOString() }
            : entry,
        ),
      }))
    },
    [],
  )

  const deleteDiaryEntry = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      diaryEntries: prev.diaryEntries.filter((entry) => entry.id !== id),
    }))
  }, [])

  const addTask = useCallback(
    (
      title: string,
      notes: string,
      dueDate: string | null,
      remindOn: string | null,
      priority: TaskPriority = 'medium',
    ) => {
      const now = new Date().toISOString()
      const task: Task = {
        id: createId(),
        title,
        notes,
        dueDate,
        remindOn,
        priority,
        completed: false,
        createdAt: now,
        updatedAt: now,
      }
      setData((prev) => ({
        ...prev,
        tasks: [task, ...prev.tasks],
      }))
    },
    [],
  )

  const updateTask = useCallback(
    (
      id: string,
      title: string,
      notes: string,
      dueDate: string | null,
      remindOn: string | null,
      priority: TaskPriority = 'medium',
    ) => {
      setData((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) =>
          task.id === id
            ? {
                ...task,
                title,
                notes,
                dueDate,
                remindOn,
                priority,
                updatedAt: new Date().toISOString(),
              }
            : task,
        ),
      }))
    },
    [],
  )

  const toggleTask = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
          : task,
      ),
    }))
  }, [])

  const deleteTask = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.id !== id),
    }))
  }, [])

  const clearCompletedTasks = useCallback(() => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => !task.completed),
    }))
  }, [])

  const dismissReminders = useCallback(() => {
    setData((prev) => ({
      ...prev,
      lastReminderShown: todayString(),
    }))
  }, [])

  return {
    data,
    addDiaryEntry,
    updateDiaryEntry,
    deleteDiaryEntry,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    clearCompletedTasks,
    dismissReminders,
  }
}
