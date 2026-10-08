import { useState } from 'react'
import { notificationApi } from '../../api/notificationApi'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { TextArea } from '../../components/ui/TextArea'
import { getApiErrorMessage } from '../../utils/format'

export function PublishNotificationPage() {
  const [form, setForm] = useState({
    title: '',
    message: '',
    notificationType: 'GENERAL',
    targetType: 'ALL',
    expiryDate: '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await notificationApi.publish({
        ...form,
        expiryDate: form.expiryDate || undefined,
      })
      setMessage(data.message || 'Notification published')
      setForm({ title: '', message: '', notificationType: 'GENERAL', targetType: 'ALL', expiryDate: '' })
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Publish Notification</h1>
        <p>Send announcements to villagers</p>
      </div>

      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <Card title="New Notification">
        <form onSubmit={handleSubmit} className="form-grid">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="span-2" />
          <TextArea label="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={5} className="span-2" />
          <Select label="Type" value={form.notificationType} onChange={(e) => setForm({ ...form, notificationType: e.target.value })}>
            <option value="GENERAL">General</option>
            <option value="COMPLAINT">Complaint</option>
            <option value="SCHEME">Scheme</option>
            <option value="ANNOUNCEMENT">Announcement</option>
          </Select>
          <Select label="Target" value={form.targetType} onChange={(e) => setForm({ ...form, targetType: e.target.value })}>
            <option value="ALL">All Villagers</option>
            <option value="VILLAGER">Villagers Only</option>
          </Select>
          <Input label="Expiry Date (optional)" type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
          <div className="form-actions span-2">
            <Button type="submit" loading={loading}>Publish</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
