import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { complaintApi } from '../../api/complaintApi'
import { notificationApi } from '../../api/notificationApi'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'
import type { ComplaintSummary } from '../../types/complaint'
import { formatDate } from '../../utils/format'

export function VillagerDashboard() {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState<ComplaintSummary[]>([])
  const [pendingCount, setPendingCount] = useState(0)
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [complaintsRes, pendingRes, notifRes] = await Promise.all([
          complaintApi.getMy({ pageNumber: 1, pageSize: 5 }),
          complaintApi.getResolutionPending(1, 1),
          notificationApi.getUnreadCount(),
        ])
        if (complaintsRes.data.success && complaintsRes.data.data) {
          setComplaints(complaintsRes.data.data.items)
        }
        if (pendingRes.data.success && pendingRes.data.data) {
          setPendingCount(pendingRes.data.data.pagination.totalRecords)
        }
        if (notifRes.data.success && notifRes.data.data) {
          setUnreadCount(notifRes.data.data.unreadCount)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <LoadingSpinner size="lg" />

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Welcome, {user?.fullName}</h1>
          <p>Your village services dashboard</p>
        </div>
        <Link to="/complaints/new">
          <Button>Raise Complaint</Button>
        </Link>
      </div>

      <div className="stats-grid">
        <Card title="Unread Notifications">
          <div className="stat-value">{unreadCount}</div>
        </Card>
        <Card title="Awaiting Confirmation">
          <div className="stat-value">{pendingCount}</div>
        </Card>
        <Card title="Recent Complaints">
          <div className="stat-value">{complaints.length}</div>
        </Card>
      </div>

      <Card title="Recent Complaints" subtitle="Your latest submitted complaints">
        {complaints.length === 0 ? (
          <p>No complaints yet. <Link to="/complaints/new">Raise your first complaint</Link></p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c.complaintId}>
                    <td>
                      <Link to={`/complaints/${c.complaintId}`}>{c.complaintNumber}</Link>
                    </td>
                    <td>{c.title}</td>
                    <td>{c.categoryName}</td>
                    <td><Badge label={c.status} /></td>
                    <td>{formatDate(c.createdDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
