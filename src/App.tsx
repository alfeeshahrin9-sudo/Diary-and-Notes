import { useMemo } from 'react'
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
    dismissReminders,
  } = useStore()

  const reminderTasks = useMemo(() => {
    const today = todayString()
    const shouldShow = data.lastReminderShown !== today

    if (!shouldShow) return []

    return data.tasks.filter((task) => {
      if (task.completed) return false
      const remindToday = task.remindOn ? isDueOrOverdue(task.remindOn) : false
      const dueToday = task.dueDate ? isDueOrOverdue(task.dueDate) : false
      return remindToday || dueToday
    })
  }, [data.tasks, data.lastReminderShown])

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
