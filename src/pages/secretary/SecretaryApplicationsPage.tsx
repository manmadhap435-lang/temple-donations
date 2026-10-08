import { useEffect, useState } from 'react'
import { applicationApi } from '../../api/applicationApi'
import { Alert } from '../../components/ui/Alert'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { Pagination } from '../../components/ui/Pagination'
import { Select } from '../../components/ui/Select'
import type { Application } from '../../types'
import { formatDate, getApiErrorMessage } from '../../utils/format'

const APP_STATUSES = ['Pending', 'Under Review', 'Approved', 'Rejected']

export function SecretaryApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    const { data } = await applicationApi.getAll({
      pageNumber,
      pageSize: 10,
      status: status || undefined,
    })
    if (data.success && data.data) {
      setApplications(data.data.items)
      setTotalPages(data.data.pagination.totalPages)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [pageNumber, status])

  async function updateStatus(id: number, newStatus: string) {
    try {
      await applicationApi.updateStatus(id, newStatus)
      setMessage('Application status updated')
      load()
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Applications</h1>
        <p>Review villager scheme applications</p>
      </div>

      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <Card>
        <div className="filters-row">
          <Select label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPageNumber(1) }}>
            <option value="">All</option>
            {APP_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : applications.length === 0 ? (
          <EmptyState title="No applications" />
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Number</th>
                    <th>Applicant</th>
                    <th>Scheme</th>
                    <th>Status</th>
                    <th>Applied</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((a) => (
                    <tr key={a.applicationId}>
                      <td>{a.applicationNumber}</td>
                      <td>{a.applicantName}</td>
                      <td>{a.schemeName}</td>
                      <td><Badge label={a.status} /></td>
                      <td>{formatDate(a.createdDate)}</td>
                      <td>
                        <Select
                          value={a.status}
                          onChange={(e) => updateStatus(a.applicationId, e.target.value)}
                        >
                          {APP_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination pageNumber={pageNumber} totalPages={totalPages} onPageChange={setPageNumber} />
          </>
        )}
      </Card>
    </div>
  )
}
