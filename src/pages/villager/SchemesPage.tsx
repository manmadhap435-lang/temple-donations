import { useEffect, useState } from 'react'
import { applicationApi } from '../../api/applicationApi'
import { Alert } from '../../components/ui/Alert'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { TextArea } from '../../components/ui/TextArea'
import type { Application, Scheme } from '../../types'
import { formatDate, getApiErrorMessage } from '../../utils/format'

export function SchemesPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null)
  const [remarks, setRemarks] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const [schemesRes, appsRes] = await Promise.all([
        applicationApi.getSchemes(),
        applicationApi.getMy(1, 10),
      ])
      if (schemesRes.data.success && schemesRes.data.data) setSchemes(schemesRes.data.data)
      if (appsRes.data.success && appsRes.data.data) setApplications(appsRes.data.data.items)
      setLoading(false)
    }
    load()
  }, [])

  async function handleApply() {
    if (!selectedScheme) return
    setSubmitting(true)
    setError('')
    try {
      const { data } = await applicationApi.create(selectedScheme.schemeId, remarks || undefined)
      setMessage(data.message || 'Application submitted')
      setSelectedScheme(null)
      setRemarks('')
      const appsRes = await applicationApi.getMy(1, 10)
      if (appsRes.data.success && appsRes.data.data) setApplications(appsRes.data.data.items)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner size="lg" />

  return (
    <div className="page">
      <div className="page-header">
        <h1>Schemes & Applications</h1>
        <p>Browse available schemes and track your applications</p>
      </div>

      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="detail-grid">
        <Card title="Available Schemes">
          <div className="scheme-list">
            {schemes.filter((s) => s.isActive).map((s) => (
              <div key={s.schemeId} className={`scheme-item ${selectedScheme?.schemeId === s.schemeId ? 'selected' : ''}`}>
                <h3>{s.schemeName}</h3>
                <p>{s.description}</p>
                {s.eligibility && <p className="muted">Eligibility: {s.eligibility}</p>}
                <Button size="sm" onClick={() => setSelectedScheme(s)}>Apply</Button>
              </div>
            ))}
          </div>
        </Card>

        {selectedScheme && (
          <Card title={`Apply: ${selectedScheme.schemeName}`}>
            <TextArea label="Remarks (optional)" value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={4} />
            <div className="form-actions">
              <Button variant="secondary" onClick={() => setSelectedScheme(null)}>Cancel</Button>
              <Button loading={submitting} onClick={handleApply}>Submit Application</Button>
            </div>
          </Card>
        )}
      </div>

      <Card title="My Applications">
        {applications.length === 0 ? (
          <p>No applications yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Scheme</th>
                  <th>Status</th>
                  <th>Applied</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((a) => (
                  <tr key={a.applicationId}>
                    <td>{a.applicationNumber}</td>
                    <td>{a.schemeName}</td>
                    <td><Badge label={a.status} /></td>
                    <td>{formatDate(a.createdDate)}</td>
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
