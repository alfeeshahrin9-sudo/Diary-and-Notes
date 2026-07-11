import { useState } from 'react'
import type { DiaryEntry } from '../types'
import { formatDisplayDate, todayString } from '../utils/dates'

interface DiarySectionProps {
  entries: DiaryEntry[]
  onAdd: (title: string, content: string, date: string) => void
  onUpdate: (id: string, title: string, content: string, date: string) => void
  onDelete: (id: string) => void
}

export function DiarySection({ entries, onAdd, onUpdate, onDelete }: DiarySectionProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [date, setDate] = useState(todayString())
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    if (editingId) {
      onUpdate(editingId, title.trim(), content.trim(), date)
      setEditingId(null)
    } else {
      onAdd(title.trim(), content.trim(), date)
    }

    setTitle('')
    setContent('')
    setDate(todayString())
  }

  const startEdit = (entry: DiaryEntry) => {
    setEditingId(entry.id)
    setTitle(entry.title)
    setContent(entry.content)
    setDate(entry.date)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setTitle('')
    setContent('')
    setDate(todayString())
  }

  return (
    <section className="board-card board-card--diary">
      <div className="board-card__header">
        <span className="board-label">Section 01</span>
        <h2>Diary</h2>
        <p>Write down your thoughts and daily reflections.</p>
      </div>

      <form className="entry-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Entry title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input input--date"
        />
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="textarea"
          rows={4}
        />
        <div className="form-actions">
          <button type="submit" className="btn btn--primary">
            {editingId ? 'Save entry' : 'Add entry'}
          </button>
          {editingId && (
            <button type="button" className="btn btn--ghost" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <ul className="entry-list">
        {entries.length === 0 && (
          <li className="empty-state">No diary entries yet. Start writing above.</li>
        )}
        {entries.map((entry) => (
          <li key={entry.id} className="entry-card">
            <div className="entry-card__top">
              <h3>{entry.title}</h3>
              <time>{formatDisplayDate(entry.date)}</time>
            </div>
            {entry.content && <p>{entry.content}</p>}
            <div className="entry-card__actions">
              <button type="button" className="btn btn--small" onClick={() => startEdit(entry)}>
                Edit
              </button>
              <button
                type="button"
                className="btn btn--small btn--danger"
                onClick={() => onDelete(entry.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
