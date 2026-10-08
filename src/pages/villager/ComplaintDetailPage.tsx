import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { complaintApi } from '../../api/complaintApi'
import { Alert } from '../../components/ui/Alert'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { Modal } from '../../components/ui/Modal'
import { TextArea } from '../../components/ui/TextArea'
import type { ComplaintDetail } from '../../types/complaint'
import { formatDate, formatDateTime, getApiErrorMessage } from '../../utils/format'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

export function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [complaint, setComplaint] = useState<ComplaintDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [modal, setModal] = useState<'escalate' | 'reopen' | 'confirm' | null>(null)
  const [remarks, setRemarks] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  async function loadComplaint() {
    if (!id) return
    setLoading(true)
    try {
      const { data } = await complaintApi.getById(Number(id))
      if (data.success && data.data) setComplaint(data.data)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadComplaint() }, [id])

  async function handleEscalate() {
    if (!id) return
    setActionLoading(true)
    try {
      await complaintApi.escalate(Number(id), remarks)
      setMessage('Complaint escalated successfully')
      setModal(null)
      setRemarks('')
      await loadComplaint()
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setActionLoading(false)
    }
  }

  async function handleReopen() {
    if (!id) return
    setActionLoading(true)
    try {
      await complaintApi.reopen(Number(id), remarks)
      setMessage('Complaint reopened successfully')
      setModal(null)
      setRemarks('')
      await loadComplaint()
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setActionLoading(false)
    }
  }

  async function handleConfirm(isResolved: boolean) {
    if (!id) return
    setActionLoading(true)
    try {
      await complaintApi.confirmResolution(Number(id), isResolved, remarks || undefined)
      setMessage(isResolved ? 'Resolution confirmed. Complaint will be closed.' : 'Complaint reopened for review.')
      setModal(null)
      setRemarks('')
      await loadComplaint()
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setActionLoading(false)
    }
  }

  async function handleClose() {
    if (!id) return
    setActionLoading(true)
    try {
      await complaintApi.close(Number(id))
      setMessage('Complaint closed successfully')
      await loadComplaint()
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <LoadingSpinner size="lg" />
  if (!complaint) return <Alert type="error" message={error || 'Complaint not found'} />

  const statusLower = complaint.status.toLowerCase()
  const canEscalate = !statusLower.includes('closed') && !statusLower.includes('escalat')
  const canConfirm = complaint.requiresUserConfirmation || statusLower.includes('resolved')
  const canReopen = statusLower.includes('resolved') || statusLower.includes('closed')
  const canClose = statusLower.includes('resolved')

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <Link to="/complaints" className="back-link">← Back to complaints</Link>
          <h1>{complaint.complaintNumber}</h1>
          <p>{complaint.title}</p>
        </div>
        <Badge label={complaint.status} />
      </div>

      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="detail-grid">
        <Card title="Complaint Information">
          <dl className="detail-list">
            <div><dt>Category</dt><dd>{complaint.categoryName}</dd></div>
            <div><dt>Priority</dt><dd>{complaint.priority}</dd></div>
            <div><dt>Street</dt><dd>{complaint.street || '—'}</dd></div>
            <div><dt>Location</dt><dd>{complaint.location || '—'}</dd></div>
            <div><dt>Estimated Resolution</dt><dd>{formatDate(complaint.estimatedResolutionDate)}</dd></div>
            <div><dt>Created</dt><dd>{formatDateTime(complaint.createdDate)}</dd></div>
            <div className="span-2"><dt>Description</dt><dd>{complaint.description}</dd></div>
          </dl>
        </Card>

        <Card title="Actions">
          <div className="action-buttons">
            {canConfirm && (
              <>
                <Button onClick={() => setModal('confirm')}>Confirm Resolution</Button>
                <Button variant="danger" onClick={() => { setRemarks(''); setModal('reopen') }}>
                  Not Resolved
                </Button>
              </>
            )}
            {canClose && !canConfirm && (
              <Button onClick={handleClose} loading={actionLoading}>Close Complaint</Button>
            )}
            {canEscalate && (
              <Button variant="secondary" onClick={() => setModal('escalate')}>Escalate</Button>
            )}
            {canReopen && !canConfirm && (
              <Button variant="secondary" onClick={() => setModal('reopen')}>Reopen</Button>
            )}
          </div>
        </Card>
      </div>

      {complaint.responses.length > 0 && (
        <Card title="Secretary Responses">
          <div className="timeline">
            {complaint.responses.map((r) => (
              <div key={r.responseId} className="timeline-item">
                <div className="timeline-meta">
                  <strong>{r.respondedByName || 'Secretary'}</strong>
                  <span>{formatDateTime(r.createdDate)}</span>
                </div>
                <p>{r.responseText}</p>
                {r.estimatedResolutionDate && (
                  <p className="muted">Est. resolution: {formatDate(r.estimatedResolutionDate)}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {complaint.attachments.length > 0 && (
        <Card title="Attachments">
          <ul className="attachment-list">
            {complaint.attachments.map((a) => (
              <li key={a.attachmentId}>
                <a href={`${API_BASE}/${a.filePath}`} target="_blank" rel="noreferrer">{a.fileName}</a>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {complaint.statusHistory.length > 0 && (
        <Card title="Status History">
          <div className="timeline">
            {complaint.statusHistory.map((h) => (
              <div key={h.statusHistoryId} className="timeline-item">
                <div className="timeline-meta">
                  <Badge label={h.newStatus} />
                  <span>{formatDateTime(h.changedDate)}</span>
                </div>
                {h.remarks && <p>{h.remarks}</p>}
                {h.changedByName && <p className="muted">By {h.changedByName}</p>}
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal
        open={modal === 'escalate'}
        title="Escalate Complaint"
        onClose={() => setModal(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
            <Button loading={actionLoading} onClick={handleEscalate}>Escalate</Button>
          </>
        }
      >
        <TextArea label="Reason for escalation" value={remarks} onChange={(e) => setRemarks(e.target.value)} required rows={4} />
      </Modal>

      <Modal
        open={modal === 'reopen'}
        title="Reopen Complaint"
        onClose={() => setModal(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
            <Button variant="danger" loading={actionLoading} onClick={handleReopen}>Reopen</Button>
          </>
        }
      >
        <TextArea label="Reason" value={remarks} onChange={(e) => setRemarks(e.target.value)} required rows={4} />
      </Modal>

      <Modal
        open={modal === 'confirm'}
        title="Confirm Resolution"
        onClose={() => setModal(null)}
        footer={
          <>
            <Button variant="danger" loading={actionLoading} onClick={() => handleConfirm(false)}>Not Resolved</Button>
            <Button loading={actionLoading} onClick={() => handleConfirm(true)}>Yes, Resolved</Button>
          </>
        }
      >
        <p>Has your complaint been resolved satisfactorily?</p>
        <TextArea label="Remarks (optional)" value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={3} />
      </Modal>
    </div>
  )
}
