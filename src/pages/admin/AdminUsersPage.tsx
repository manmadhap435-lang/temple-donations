import { useEffect, useState } from 'react'
import { adminApi } from '../../api/adminApi'
import { Alert } from '../../components/ui/Alert'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input } from '../../components/ui/Input'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { Modal } from '../../components/ui/Modal'
import { Pagination } from '../../components/ui/Pagination'
import type { AdminUser } from '../../types'
import { formatDate, getApiErrorMessage } from '../../utils/format'

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [secretaryForm, setSecretaryForm] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
  })

  async function load() {
    setLoading(true)
    const { data } = await adminApi.getUsers({ pageNumber, pageSize: 10, search: search || undefined })
    if (data.success && data.data) {
      setUsers(data.data.items)
      setTotalPages(data.data.pagination.totalPages)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [pageNumber, search])

  async function toggleStatus(user: AdminUser) {
    try {
      await adminApi.updateUserStatus(user.userId, !user.isActive)
      setMessage('User status updated')
      load()
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  async function createSecretary(e: React.FormEvent) {
    e.preventDefault()
    try {
      await adminApi.createSecretary(secretaryForm)
      setMessage('Secretary account created')
      setShowCreate(false)
      setSecretaryForm({ fullName: '', email: '', mobileNumber: '', password: '' })
      load()
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>User Management</h1>
          <p>Manage villagers, secretaries, and admins</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>Create Secretary</Button>
      </div>

      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <Card>
        <div className="filters-row">
          <Input label="Search" value={search} onChange={(e) => { setSearch(e.target.value); setPageNumber(1) }} />
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : users.length === 0 ? (
          <EmptyState title="No users found" />
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.userId}>
                      <td>{u.fullName}</td>
                      <td>{u.email}</td>
                      <td>{u.mobileNumber}</td>
                      <td><Badge label={u.role} /></td>
                      <td><Badge label={u.isActive ? 'Active' : 'Inactive'} variant={u.isActive ? 'success' : 'danger'} /></td>
                      <td>{formatDate(u.createdDate)}</td>
                      <td>
                        <Button size="sm" variant="secondary" onClick={() => toggleStatus(u)}>
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
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

      <Modal
        open={showCreate}
        title="Create Secretary Account"
        onClose={() => setShowCreate(false)}
        footer={null}
      >
        <form onSubmit={createSecretary} className="form-grid">
          <Input label="Full Name" value={secretaryForm.fullName} onChange={(e) => setSecretaryForm({ ...secretaryForm, fullName: e.target.value })} required />
          <Input label="Email" type="email" value={secretaryForm.email} onChange={(e) => setSecretaryForm({ ...secretaryForm, email: e.target.value })} required />
          <Input label="Mobile" value={secretaryForm.mobileNumber} onChange={(e) => setSecretaryForm({ ...secretaryForm, mobileNumber: e.target.value })} required />
          <Input label="Password" type="password" value={secretaryForm.password} onChange={(e) => setSecretaryForm({ ...secretaryForm, password: e.target.value })} required minLength={8} />
          <div className="form-actions span-2">
            <Button type="button" variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
