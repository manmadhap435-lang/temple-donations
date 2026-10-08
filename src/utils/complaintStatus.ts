export const COMPLAINT_STATUSES = [
  'Registered',
  'Submitted',
  'Secretary Reviewing',
  'In Progress',
  'Resolved',
  'Closed',
  'Reopened',
  'Escalated',
] as const

export type ComplaintStatus = (typeof COMPLAINT_STATUSES)[number]

export function getStatusColor(status: string): string {
  const normalized = status.toLowerCase()
  if (normalized.includes('closed')) return 'success'
  if (normalized.includes('resolved')) return 'info'
  if (normalized.includes('progress') || normalized.includes('review')) return 'warning'
  if (normalized.includes('escalat') || normalized.includes('reopen')) return 'danger'
  if (normalized.includes('submit') || normalized.includes('register')) return 'neutral'
  return 'neutral'
}

export const COMPLAINT_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'] as const
