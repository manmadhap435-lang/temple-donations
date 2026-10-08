import { useEffect, useState } from 'react'
import { adminApi } from '../../api/adminApi'
import { Card } from '../../components/ui/Card'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import type { DashboardSummary } from '../../types'
import { formatCurrency } from '../../utils/format'

export function AdminDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getDashboard().then(({ data }) => {
      if (data.success && data.data) setSummary(data.data)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner size="lg" />
  if (!summary) return <p>Unable to load dashboard</p>

  return (
    <div className="page">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>System overview and reports</p>
      </div>

      <div className="stats-grid wide">
        <Card title="Total Villagers"><div className="stat-value">{summary.totalVillagers}</div></Card>
        <Card title="Active Users"><div className="stat-value">{summary.activeUsers}</div></Card>
        <Card title="Total Complaints"><div className="stat-value">{summary.totalComplaints}</div></Card>
        <Card title="Pending Complaints"><div className="stat-value">{summary.pendingComplaints}</div></Card>
        <Card title="Escalated"><div className="stat-value">{summary.escalatedComplaints}</div></Card>
        <Card title="Resolved"><div className="stat-value">{summary.resolvedComplaints}</div></Card>
        <Card title="Applications"><div className="stat-value">{summary.totalApplications}</div></Card>
        <Card title="Pending Applications"><div className="stat-value">{summary.pendingApplications}</div></Card>
        <Card title="Donations"><div className="stat-value">{summary.totalDonations}</div></Card>
        <Card title="Donation Amount"><div className="stat-value">{formatCurrency(summary.totalDonationAmount)}</div></Card>
        <Card title="Active Schemes"><div className="stat-value">{summary.activeSchemes}</div></Card>
        <Card title="Notifications"><div className="stat-value">{summary.totalPublishedNotifications}</div></Card>
      </div>
    </div>
  )
}
