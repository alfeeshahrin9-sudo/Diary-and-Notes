import { useMemo, useState } from 'react'
import { Header } from './components/Header'
import { DiarySection } from './components/DiarySection'
import { TaskSection } from './components/TaskSection'
import { ReminderModal } from './components/ReminderModal'
import { useStore } from './hooks/useStore'
import { isDueOrOverdue, todayString } from './utils/dates'
import './App.css'

function App() {
  const {
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
  } = useStore()

  const [initialReminderIds] = useState<string[]>(() => {
    const today = todayString()
    if (data.lastReminderShown === today) return []

    return data.tasks
      .filter((task) => {
        if (task.completed) return false
        const remindToday = task.remindOn ? isDueOrOverdue(task.remindOn) : false
        const dueToday = task.dueDate ? isDueOrOverdue(task.dueDate) : false
        return remindToday || dueToday
      })
      .map((task) => task.id)
  })

  const reminderTasks = useMemo(() => {
    const today = todayString()
    if (data.lastReminderShown === today || initialReminderIds.length === 0) return []

    const idSet = new Set(initialReminderIds)
    return data.tasks.filter((task) => idSet.has(task.id))
  }, [data.tasks, data.lastReminderShown, initialReminderIds])

  const showReminders = reminderTasks.length > 0

  return (
    <div className="app">
      <Header />

      <main className="board">
        <DiarySection
          entries={data.diaryEntries}
          onAdd={addDiaryEntry}
          onUpdate={updateDiaryEntry}
          onDelete={deleteDiaryEntry}
        />
        <TaskSection
          tasks={data.tasks}
          onAdd={addTask}
          onUpdate={updateTask}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onClearCompleted={clearCompletedTasks}
        />
      </main>

      {showReminders && (
        <ReminderModal
          tasks={reminderTasks}
          onDismiss={dismissReminders}
          onToggle={toggleTask}
        />
      )}
    </div>
  )
}

export default App
