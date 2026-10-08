import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { secretaryComplaintApi } from '../../api/complaintApi'
import { applicationApi } from '../../api/applicationApi'
import { Card } from '../../components/ui/Card'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import type { ComplaintSummary } from '../../types/complaint'
import { formatDate } from '../../utils/format'

export function SecretaryDashboard() {
  const [complaints, setComplaints] = useState<ComplaintSummary[]>([])
  const [pendingApps, setPendingApps] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [complaintsRes, appsRes] = await Promise.all([
        secretaryComplaintApi.getAll({ pageNumber: 1, pageSize: 5, status: 'Submitted' }),
        applicationApi.getAll({ pageNumber: 1, pageSize: 1, status: 'Pending' }),
      ])
      if (complaintsRes.data.success && complaintsRes.data.data) {
        setComplaints(complaintsRes.data.data.items)
      }
      if (appsRes.data.success && appsRes.data.data) {
        setPendingApps(appsRes.data.data.pagination.totalRecords)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <LoadingSpinner size="lg" />

  return (
    <div className="page">
      <div className="page-header">
        <h1>Secretary Dashboard</h1>
        <p>Manage village complaints and applications</p>
      </div>

      <div className="stats-grid">
        <Card title="New Complaints">
          <div className="stat-value">{complaints.length}</div>
        </Card>
        <Card title="Pending Applications">
          <div className="stat-value">{pendingApps}</div>
        </Card>
      </div>

      <Card title="Recent Submitted Complaints">
        {complaints.length === 0 ? (
          <p>No new complaints.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Title</th>
                  <th>Villager</th>
                  <th>Category</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c.complaintId}>
                    <td><Link to={`/secretary/complaints/${c.complaintId}`}>{c.complaintNumber}</Link></td>
                    <td>{c.title}</td>
                    <td>{c.villagerName}</td>
                    <td>{c.categoryName}</td>
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
