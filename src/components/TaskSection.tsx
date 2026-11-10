import { useMemo, useState } from 'react'
import type { Task, TaskPriority } from '../types'
import { dueLabel, formatDisplayDate, todayString } from '../utils/dates'

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

interface TaskSectionProps {
  tasks: Task[]
  onAdd: (
    title: string,
    notes: string,
    dueDate: string | null,
    remindOn: string | null,
    priority: TaskPriority,
  ) => void
  onUpdate: (
    id: string,
    title: string,
    notes: string,
    dueDate: string | null,
    remindOn: string | null,
    priority: TaskPriority,
  ) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onClearCompleted: () => void
}

export function TaskSection({
  tasks,
  onAdd,
  onUpdate,
  onToggle,
  onDelete,
  onClearCompleted,
}: TaskSectionProps) {
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [remindOn, setRemindOn] = useState(todayString())
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const due = dueDate || null
    const remind = remindOn || null

    if (editingId) {
      onUpdate(editingId, title.trim(), notes.trim(), due, remind, priority)
      setEditingId(null)
    } else {
      onAdd(title.trim(), notes.trim(), due, remind, priority)
    }

    resetForm()
  }

  const resetForm = () => {
    setTitle('')
    setNotes('')
    setDueDate('')
    setRemindOn(todayString())
    setPriority('medium')
    setEditingId(null)
  }

  const startEdit = (task: Task) => {
    setEditingId(task.id)
    setTitle(task.title)
    setNotes(task.notes)
    setDueDate(task.dueDate ?? '')
    setRemindOn(task.remindOn ?? '')
    setPriority(task.priority ?? 'medium')
  }

  const handleDelete = (id: string) => {
    if (editingId === id) {
      resetForm()
    }
    onDelete(id)
  }

  const handleClearCompleted = () => {
    if (editingId && tasks.some((t) => t.id === editingId && t.completed)) {
      resetForm()
    }
    onClearCompleted()
  }

  const filteredTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return tasks.filter((task) => {
      const taskPriority = task.priority ?? 'medium'
      if (priorityFilter !== 'all' && taskPriority !== priorityFilter) return false
      if (!q) return true
      return task.title.toLowerCase().includes(q) || task.notes.toLowerCase().includes(q)
    })
  }, [tasks, searchQuery, priorityFilter])

  const activeTasks = filteredTasks.filter((t) => !t.completed)
  const completedTasks = filteredTasks.filter((t) => t.completed)

  return (
    <section className="board-card board-card--tasks">
      <div className="board-card__header">
        <span className="board-label">Section 02</span>
        <h2>Tasks</h2>
        <p>Manage to-dos with due dates, priorities, and reminders.</p>
      </div>

      <form className="entry-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
        />
        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="textarea"
          rows={2}
        />
        <div className="form-row">
          <label className="field-label">
            Due date
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input input--date"
            />
          </label>
          <label className="field-label">
            Remind on
            <input
              type="date"
              value={remindOn}
              onChange={(e) => setRemindOn(e.target.value)}
              className="input input--date"
            />
          </label>
        </div>
        <div className="field-label">
          <span>Priority</span>
          <div className="pill-group" role="group" aria-label="Select priority">
            {PRIORITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`pill pill--priority-${opt.value} ${priority === opt.value ? 'pill--active' : ''}`}
                onClick={() => setPriority(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn--primary">
            {editingId ? 'Save task' : 'Add task'}
          </button>
          {editingId && (
            <button type="button" className="btn btn--ghost" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {tasks.length > 0 && (
        <div className="filter-bar">
          <input
            type="search"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input--small"
          />
          <div className="pill-group">
            <button
              type="button"
              className={`pill ${priorityFilter === 'all' ? 'pill--active' : ''}`}
              onClick={() => setPriorityFilter('all')}
            >
              All
            </button>
            {PRIORITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`pill pill--priority-${opt.value} ${priorityFilter === opt.value ? 'pill--active' : ''}`}
                onClick={() => setPriorityFilter(priorityFilter === opt.value ? 'all' : opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="task-groups">
        <div className="task-group">
          <h3 className="task-group__title">
            Active <span className="count">{activeTasks.length}</span>
          </h3>
          <ul className="entry-list">
            {activeTasks.length === 0 && (
              <li className="empty-state">
                {tasks.some((t) => !t.completed)
                  ? 'No active tasks match your filter.'
                  : 'No active tasks. Add one above.'}
              </li>
            )}
            {activeTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onEdit={startEdit}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        </div>

        {completedTasks.length > 0 && (
          <div className="task-group task-group--done">
            <div className="task-group__header">
              <h3 className="task-group__title">
                Completed <span className="count">{completedTasks.length}</span>
              </h3>
              <button
                type="button"
                className="btn btn--small btn--ghost"
                onClick={handleClearCompleted}
              >
                Clear completed
              </button>
            </div>
            <ul className="entry-list">
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onEdit={startEdit}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

function TaskItem({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}) {
  const priority = task.priority ?? 'medium'

  return (
    <li className={`entry-card entry-card--task ${task.completed ? 'entry-card--completed' : ''}`}>
      <label className="task-check">
        <input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} />
        <span className="task-check__title">{task.title}</span>
      </label>
      {task.notes && <p>{task.notes}</p>}
      <div className="entry-card__chips">
        <span className={`chip chip--priority-${priority}`}>
          {priority.toUpperCase()}
        </span>
        {task.dueDate && (
          <span
            className={`chip ${
              dueLabel(task.dueDate) === 'Overdue' ? 'chip--overdue' : 'chip--due'
            }`}
          >
            {dueLabel(task.dueDate)}
          </span>
        )}
        {task.remindOn && (
          <span className="chip chip--remind">Remind: {formatDisplayDate(task.remindOn)}</span>
        )}
      </div>
      <div className="entry-card__actions">
        <button type="button" className="btn btn--small" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button
          type="button"
          className="btn btn--small btn--danger"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </li>
  )
}
