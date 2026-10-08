import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { complaintApi } from '../../api/complaintApi'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { Select } from '../../components/ui/Select'
import { TextArea } from '../../components/ui/TextArea'
import type { ComplaintCategory } from '../../types/complaint'
import { COMPLAINT_PRIORITIES } from '../../utils/complaintStatus'
import { getApiErrorMessage } from '../../utils/format'

export function NewComplaintPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<ComplaintCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    complaintCategoryId: '',
    title: '',
    description: '',
    street: '',
    location: '',
    priority: 'Medium',
  })
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    complaintApi.getCategories().then(({ data }) => {
      if (data.success && data.data) setCategories(data.data)
    }).finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const { data } = await complaintApi.create({
        complaintCategoryId: Number(form.complaintCategoryId),
        title: form.title,
        description: form.description,
        street: form.street || undefined,
        location: form.location || undefined,
        priority: form.priority,
      })
      if (!data.success || !data.data) throw new Error(data.message)

      if (file) {
        await complaintApi.uploadAttachment(data.data.complaintId, file)
      }
      navigate(`/complaints/${data.data.complaintId}`)
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
        <h1>Raise Complaint</h1>
        <p>Report an issue in your village</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <Card title="Complaint Details">
        <form onSubmit={handleSubmit} className="form-grid">
          <Select
            label="Category"
            value={form.complaintCategoryId}
            onChange={(e) => setForm({ ...form, complaintCategoryId: e.target.value })}
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.complaintCategoryId} value={c.complaintCategoryId}>{c.categoryName}</option>
            ))}
          </Select>
          <Select
            label="Priority"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            {COMPLAINT_PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Select>
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="span-2"
          />
          <TextArea
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            rows={5}
            className="span-2"
          />
          <Input label="Street / Ward" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
          <Input label="Location details" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <div className="form-field span-2">
            <label htmlFor="attachment">Upload image (optional)</label>
            <input
              id="attachment"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <div className="form-actions span-2">
            <Button type="button" variant="secondary" onClick={() => navigate('/complaints')}>Cancel</Button>
            <Button type="submit" loading={submitting}>Submit Complaint</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
