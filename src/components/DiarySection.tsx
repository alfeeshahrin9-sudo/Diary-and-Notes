import { useMemo, useState } from 'react'
import type { DiaryEntry, DiaryMood } from '../types'
import { formatDisplayDate, todayString } from '../utils/dates'

const MOOD_OPTIONS: { value: DiaryMood; label: string; icon: string }[] = [
  { value: 'great', label: 'Great', icon: '★' },
  { value: 'good', label: 'Good', icon: '▲' },
  { value: 'okay', label: 'Okay', icon: '◆' },
  { value: 'tired', label: 'Tired', icon: '▼' },
  { value: 'stressed', label: 'Stressed', icon: '⚡' },
]

interface DiarySectionProps {
  entries: DiaryEntry[]
  onAdd: (title: string, content: string, date: string, mood?: DiaryMood) => void
  onUpdate: (id: string, title: string, content: string, date: string, mood?: DiaryMood) => void
  onDelete: (id: string) => void
}

export function DiarySection({ entries, onAdd, onUpdate, onDelete }: DiarySectionProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [date, setDate] = useState(todayString())
  const [mood, setMood] = useState<DiaryMood | undefined>(undefined)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [moodFilter, setMoodFilter] = useState<DiaryMood | 'all'>('all')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const entryDate = date || todayString()

    if (editingId) {
      onUpdate(editingId, title.trim(), content.trim(), entryDate, mood)
      setEditingId(null)
    } else {
      onAdd(title.trim(), content.trim(), entryDate, mood)
    }

    setTitle('')
    setContent('')
    setDate(todayString())
    setMood(undefined)
  }

  const startEdit = (entry: DiaryEntry) => {
    setEditingId(entry.id)
    setTitle(entry.title)
    setContent(entry.content)
    setDate(entry.date)
    setMood(entry.mood)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setTitle('')
    setContent('')
    setDate(todayString())
    setMood(undefined)
  }

  const handleDelete = (id: string) => {
    if (editingId === id) {
      cancelEdit()
    }
    onDelete(id)
  }

  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return entries.filter((entry) => {
      if (moodFilter !== 'all' && entry.mood !== moodFilter) return false
      if (!q) return true
      return (
        entry.title.toLowerCase().includes(q) || entry.content.toLowerCase().includes(q)
      )
    })
  }, [entries, searchQuery, moodFilter])

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
        <div className="field-label">
          <span>Mood (optional)</span>
          <div className="pill-group" role="group" aria-label="Select mood">
            {MOOD_OPTIONS.map((opt) => {
              const active = mood === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  className={`pill pill--mood-${opt.value} ${active ? 'pill--active' : ''}`}
                  onClick={() => setMood(active ? undefined : opt.value)}
                >
                  <span aria-hidden="true">{opt.icon}</span> {opt.label}
                </button>
              )
            })}
          </div>
        </div>
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

      {entries.length > 0 && (
        <div className="filter-bar">
          <input
            type="search"
            placeholder="Search diary entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input--small"
          />
          <div className="pill-group">
            <button
              type="button"
              className={`pill ${moodFilter === 'all' ? 'pill--active' : ''}`}
              onClick={() => setMoodFilter('all')}
            >
              All
            </button>
            {MOOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`pill pill--mood-${opt.value} ${moodFilter === opt.value ? 'pill--active' : ''}`}
                onClick={() => setMoodFilter(moodFilter === opt.value ? 'all' : opt.value)}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <ul className="entry-list">
        {entries.length === 0 && (
          <li className="empty-state">No diary entries yet. Start writing above.</li>
        )}
        {entries.length > 0 && filteredEntries.length === 0 && (
          <li className="empty-state">No diary entries match your filter.</li>
        )}
        {filteredEntries.map((entry) => {
          const moodInfo = MOOD_OPTIONS.find((m) => m.value === entry.mood)
          return (
            <li key={entry.id} className="entry-card">
              <div className="entry-card__top">
                <h3>{entry.title}</h3>
                <time>{formatDisplayDate(entry.date)}</time>
              </div>
              {moodInfo && (
                <div className="entry-card__chips">
                  <span className={`chip chip--mood chip--mood-${moodInfo.value}`}>
                    {moodInfo.icon} {moodInfo.label}
                  </span>
                </div>
              )}
              {entry.content && <p>{entry.content}</p>}
              <div className="entry-card__actions">
                <button type="button" className="btn btn--small" onClick={() => startEdit(entry)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn--small btn--danger"
                  onClick={() => handleDelete(entry.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
