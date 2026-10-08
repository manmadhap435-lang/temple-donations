import { getStatusColor } from '../../utils/complaintStatus'

interface BadgeProps {
  label: string
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
}

export function Badge({ label, variant }: BadgeProps) {
  const resolvedVariant = variant || getStatusColor(label)
  return <span className={`badge badge-${resolvedVariant}`}>{label}</span>
}
