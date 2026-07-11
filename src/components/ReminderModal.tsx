import type { Task } from '../types'
import { dueLabel, formatDisplayDate } from '../utils/dates'

interface ReminderModalProps {
  tasks: Task[]
  onDismiss: () => void
  onToggle: (id: string) => void
}

export function ReminderModal({ tasks, onDismiss, onToggle }: ReminderModalProps) {
  if (tasks.length === 0) return null

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="reminder-title">
      <div className="modal">
        <div className="modal__header">
          <span className="board-label board-label--accent">On open</span>
          <h2 id="reminder-title">Reminders for today</h2>
          <p>You have {tasks.length} task{tasks.length !== 1 ? 's' : ''} that need your attention.</p>
        </div>

        <ul className="reminder-list">
          {tasks.map((task) => (
            <li key={task.id} className="reminder-item">
              <label className="reminder-item__check">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggle(task.id)}
                />
                <span className="reminder-item__title">{task.title}</span>
              </label>
              <div className="reminder-item__meta">
                {task.remindOn && (
                  <span className="chip chip--remind">Remind: {formatDisplayDate(task.remindOn)}</span>
                )}
                {task.dueDate && (
                  <span className={`chip ${task.dueDate && dueLabel(task.dueDate) === 'Overdue' ? 'chip--overdue' : 'chip--due'}`}>
                    {dueLabel(task.dueDate)}
                  </span>
                )}
              </div>
              {task.notes && <p className="reminder-item__notes">{task.notes}</p>}
            </li>
          ))}
        </ul>

        <button type="button" className="btn btn--primary" onClick={onDismiss}>
          Got it
        </button>
      </div>
    </div>
  )
}
