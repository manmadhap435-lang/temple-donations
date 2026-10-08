import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { secretaryComplaintApi } from '../../api/complaintApi'
import { Alert } from '../../components/ui/Alert'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { Select } from '../../components/ui/Select'
import { TextArea } from '../../components/ui/TextArea'
import type { ComplaintDetail } from '../../types/complaint'
import { COMPLAINT_STATUSES } from '../../utils/complaintStatus'
import { formatDateTime, getApiErrorMessage } from '../../utils/format'

export function SecretaryComplaintDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [complaint, setComplaint] = useState<ComplaintDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [statusRemarks, setStatusRemarks] = useState('')
  const [replyText, setReplyText] = useState('')
  const [estimatedDate, setEstimatedDate] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  async function load() {
    if (!id) return
    setLoading(true)
    try {
      const { data } = await secretaryComplaintApi.getById(Number(id))
      if (data.success && data.data) {
        setComplaint(data.data)
        setNewStatus(data.data.status)
      }
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  async function updateStatus() {
    if (!id) return
    setActionLoading(true)
    try {
      await secretaryComplaintApi.updateStatus(Number(id), newStatus, statusRemarks)
      setMessage('Status updated successfully')
      await load()
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setActionLoading(false)
    }
  }

  async function sendReply() {
    if (!id) return
    setActionLoading(true)
    try {
      await secretaryComplaintApi.reply(
        Number(id),
        replyText,
        estimatedDate || undefined,
      )
      setMessage('Response sent successfully')
      setReplyText('')
      setEstimatedDate('')
      await load()
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <LoadingSpinner size="lg" />
  if (!complaint) return <Alert type="error" message={error || 'Complaint not found'} />

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <Link to="/secretary/complaints" className="back-link">← Back</Link>
          <h1>{complaint.complaintNumber}</h1>
          <p>{complaint.title}</p>
        </div>
        <Badge label={complaint.status} />
      </div>

      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="detail-grid">
        <Card title="Complaint Details">
          <dl className="detail-list">
            <div><dt>Villager</dt><dd>{complaint.villagerName} ({complaint.villagerMobile})</dd></div>
            <div><dt>Category</dt><dd>{complaint.categoryName}</dd></div>
            <div><dt>Priority</dt><dd>{complaint.priority}</dd></div>
            <div><dt>Street</dt><dd>{complaint.street || '—'}</dd></div>
            <div className="span-2"><dt>Description</dt><dd>{complaint.description}</dd></div>
          </dl>
        </Card>

        <Card title="Update Status">
          <Select label="New Status" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            {COMPLAINT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
          <TextArea label="Remarks" value={statusRemarks} onChange={(e) => setStatusRemarks(e.target.value)} rows={3} />
          <Button loading={actionLoading} onClick={updateStatus}>Update Status</Button>
        </Card>
      </div>

      <Card title="Reply to Villager">
        <TextArea label="Response" value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={4} required />
        <Input label="Estimated Resolution Date" type="date" value={estimatedDate} onChange={(e) => setEstimatedDate(e.target.value)} />
        <Button loading={actionLoading} onClick={sendReply}>Send Reply</Button>
      </Card>

      {complaint.responses.length > 0 && (
        <Card title="Previous Responses">
          <div className="timeline">
            {complaint.responses.map((r) => (
              <div key={r.responseId} className="timeline-item">
                <div className="timeline-meta">
                  <strong>{r.respondedByName || 'Secretary'}</strong>
                  <span>{formatDateTime(r.createdDate)}</span>
                </div>
                <p>{r.responseText}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {complaint.statusHistory.length > 0 && (
        <Card title="Status History">
          <div className="timeline">
            {complaint.statusHistory.map((h) => (
              <div key={h.statusHistoryId} className="timeline-item">
                <Badge label={h.newStatus} />
                <span>{formatDateTime(h.changedDate)}</span>
                {h.remarks && <p>{h.remarks}</p>}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
