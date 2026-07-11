import { format } from 'date-fns'

export function Header() {
  const today = format(new Date(), 'EEEE, MMMM d, yyyy')

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__tag">Personal</span>
        <h1>Diary &amp; Notes</h1>
        <p className="app-header__subtitle">Track your thoughts, tasks, and reminders</p>
      </div>
      <div className="app-header__date">
        <span className="board-label">Today</span>
        <time>{today}</time>
      </div>
    </header>
  )
}
