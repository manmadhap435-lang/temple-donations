import { useEffect, useState } from 'react'
import { adminApi } from '../../api/adminApi'
import { Alert } from '../../components/ui/Alert'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { TextArea } from '../../components/ui/TextArea'
import type { Scheme } from '../../types'
import { getApiErrorMessage } from '../../utils/format'

export function AdminSchemesPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    schemeName: '',
    description: '',
    eligibility: '',
    startDate: '',
    endDate: '',
  })

  async function load() {
    setLoading(true)
    const { data } = await adminApi.getSchemes(true)
    if (data.success && data.data) setSchemes(data.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    try {
      await adminApi.createScheme({
        schemeName: form.schemeName,
        description: form.description,
        eligibility: form.eligibility || undefined,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      })
      setMessage('Scheme created')
      setForm({ schemeName: '', description: '', eligibility: '', startDate: '', endDate: '' })
      load()
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  async function toggleActive(scheme: Scheme) {
    try {
      await adminApi.updateScheme(scheme.schemeId, {
        schemeName: scheme.schemeName,
        description: scheme.description,
        eligibility: scheme.eligibility,
        isActive: !scheme.isActive,
        startDate: scheme.startDate,
        endDate: scheme.endDate,
      })
      load()
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  if (loading) return <LoadingSpinner size="lg" />

  return (
    <div className="page">
      <div className="page-header">
        <h1>Scheme Management</h1>
      </div>

      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <Card title="Add Scheme">
        <form onSubmit={handleCreate} className="form-grid">
          <Input label="Scheme Name" value={form.schemeName} onChange={(e) => setForm({ ...form, schemeName: e.target.value })} required />
          <Input label="Eligibility" value={form.eligibility} onChange={(e) => setForm({ ...form, eligibility: e.target.value })} />
          <TextArea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} className="span-2" />
          <Input label="Start Date" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          <Input label="End Date" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          <div className="form-actions span-2">
            <Button type="submit">Add Scheme</Button>
          </div>
        </form>
      </Card>

      <Card title="All Schemes">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schemes.map((s) => (
                <tr key={s.schemeId}>
                  <td>{s.schemeName}</td>
                  <td>{s.description.slice(0, 80)}{s.description.length > 80 ? '…' : ''}</td>
                  <td><Badge label={s.isActive ? 'Active' : 'Inactive'} variant={s.isActive ? 'success' : 'neutral'} /></td>
                  <td>
                    <Button size="sm" variant="secondary" onClick={() => toggleActive(s)}>
                      {s.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
