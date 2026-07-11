import { useState } from 'react'
import type { Task } from '../types'
import { dueLabel, formatDisplayDate, todayString } from '../utils/dates'

interface TaskSectionProps {
  tasks: Task[]
  onAdd: (title: string, notes: string, dueDate: string | null, remindOn: string | null) => void
  onUpdate: (
    id: string,
    title: string,
    notes: string,
    dueDate: string | null,
    remindOn: string | null,
  ) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskSection({ tasks, onAdd, onUpdate, onToggle, onDelete }: TaskSectionProps) {
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [remindOn, setRemindOn] = useState(todayString())
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const due = dueDate || null
    const remind = remindOn || null

    if (editingId) {
      onUpdate(editingId, title.trim(), notes.trim(), due, remind)
      setEditingId(null)
    } else {
      onAdd(title.trim(), notes.trim(), due, remind)
    }

    resetForm()
  }

  const resetForm = () => {
    setTitle('')
    setNotes('')
    setDueDate('')
    setRemindOn(todayString())
    setEditingId(null)
  }

  const startEdit = (task: Task) => {
    setEditingId(task.id)
    setTitle(task.title)
    setNotes(task.notes)
    setDueDate(task.dueDate ?? '')
    setRemindOn(task.remindOn ?? todayString())
  }

  const activeTasks = tasks.filter((t) => !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)

  return (
    <section className="board-card board-card--tasks">
      <div className="board-card__header">
        <span className="board-label">Section 02</span>
        <h2>Tasks</h2>
        <p>Manage to-dos with due dates and reminders.</p>
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

      <div className="task-groups">
        <div className="task-group">
          <h3 className="task-group__title">
            Active <span className="count">{activeTasks.length}</span>
          </h3>
          <ul className="entry-list">
            {activeTasks.length === 0 && (
              <li className="empty-state">No active tasks. Add one above.</li>
            )}
            {activeTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onEdit={startEdit}
                onDelete={onDelete}
              />
            ))}
          </ul>
        </div>

        {completedTasks.length > 0 && (
          <div className="task-group task-group--done">
            <h3 className="task-group__title">
              Completed <span className="count">{completedTasks.length}</span>
            </h3>
            <ul className="entry-list">
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onEdit={startEdit}
                  onDelete={onDelete}
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
  return (
    <li className={`entry-card entry-card--task ${task.completed ? 'entry-card--completed' : ''}`}>
      <label className="task-check">
        <input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} />
        <span className="task-check__title">{task.title}</span>
      </label>
      {task.notes && <p>{task.notes}</p>}
      <div className="entry-card__chips">
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
