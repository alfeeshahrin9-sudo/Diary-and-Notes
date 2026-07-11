import { format, isBefore, isToday, isValid, parseISO, startOfDay } from 'date-fns'

export function todayString(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function formatDisplayDate(dateStr: string): string {
  const date = parseISO(dateStr)
  if (!isValid(date)) return dateStr
  return format(date, 'MMM d, yyyy')
}

export function isDueOrOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false
  const date = parseISO(dateStr)
  if (!isValid(date)) return false
  const today = startOfDay(new Date())
  return isBefore(startOfDay(date), today) || isToday(date)
}

export function isOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false
  const date = parseISO(dateStr)
  if (!isValid(date)) return false
  return isBefore(startOfDay(date), startOfDay(new Date()))
}

export function dueLabel(dateStr: string | null): string {
  if (!dateStr) return ''
  if (isToday(parseISO(dateStr))) return 'Due today'
  if (isOverdue(dateStr)) return 'Overdue'
  return `Due ${formatDisplayDate(dateStr)}`
}
