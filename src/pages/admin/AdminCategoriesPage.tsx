import { useEffect, useState } from 'react'
import { adminApi } from '../../api/adminApi'
import { Alert } from '../../components/ui/Alert'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { TextArea } from '../../components/ui/TextArea'
import type { ComplaintCategory } from '../../types/complaint'
import { getApiErrorMessage } from '../../utils/format'

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ComplaintCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({ categoryName: '', description: '' })

  async function load() {
    setLoading(true)
    const { data } = await adminApi.getCategories(true)
    if (data.success && data.data) setCategories(data.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    try {
      await adminApi.createCategory(form.categoryName, form.description)
      setMessage('Category created')
      setForm({ categoryName: '', description: '' })
      load()
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  async function toggleActive(cat: ComplaintCategory) {
    try {
      await adminApi.updateCategory(cat.complaintCategoryId, {
        categoryName: cat.categoryName,
        description: cat.description,
        isActive: !cat.isActive,
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
        <h1>Complaint Categories</h1>
      </div>

      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <Card title="Add Category">
        <form onSubmit={handleCreate} className="form-grid">
          <Input label="Category Name" value={form.categoryName} onChange={(e) => setForm({ ...form, categoryName: e.target.value })} required />
          <TextArea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
          <div className="form-actions span-2">
            <Button type="submit">Add Category</Button>
          </div>
        </form>
      </Card>

      <Card title="All Categories">
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
              {categories.map((c) => (
                <tr key={c.complaintCategoryId}>
                  <td>{c.categoryName}</td>
                  <td>{c.description || '—'}</td>
                  <td><Badge label={c.isActive ? 'Active' : 'Inactive'} variant={c.isActive ? 'success' : 'neutral'} /></td>
                  <td>
                    <Button size="sm" variant="secondary" onClick={() => toggleActive(c)}>
                      {c.isActive ? 'Deactivate' : 'Activate'}
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
