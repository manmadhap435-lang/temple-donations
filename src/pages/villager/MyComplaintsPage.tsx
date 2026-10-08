import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { complaintApi } from '../../api/complaintApi'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input } from '../../components/ui/Input'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { Pagination } from '../../components/ui/Pagination'
import { Select } from '../../components/ui/Select'
import type { ComplaintCategory, ComplaintSummary } from '../../types/complaint'
import { COMPLAINT_STATUSES } from '../../utils/complaintStatus'
import { formatDate } from '../../utils/format'

export function MyComplaintsPage() {
  const [complaints, setComplaints] = useState<ComplaintSummary[]>([])
  const [categories, setCategories] = useState<ComplaintCategory[]>([])
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    complaintApi.getCategories().then(({ data }) => {
      if (data.success && data.data) setCategories(data.data)
    })
  }, [])

  useEffect(() => {
    setLoading(true)
    complaintApi
      .getMy({
        pageNumber,
        pageSize: 10,
        search: search || undefined,
        status: status || undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
      })
      .then(({ data }) => {
        if (data.success && data.data) {
          setComplaints(data.data.items)
          setTotalPages(data.data.pagination.totalPages)
        }
      })
      .finally(() => setLoading(false))
  }, [pageNumber, search, status, categoryId])

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>My Complaints</h1>
          <p>Track and manage your submitted complaints</p>
        </div>
        <Link to="/complaints/new"><Button>Raise Complaint</Button></Link>
      </div>

      <Card>
        <div className="filters-row">
          <Input
            label="Search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPageNumber(1) }}
            placeholder="Search by title or number"
          />
          <Select label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPageNumber(1) }}>
            <option value="">All statuses</option>
            {COMPLAINT_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
          <Select label="Category" value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPageNumber(1) }}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.complaintCategoryId} value={c.complaintCategoryId}>{c.categoryName}</option>
            ))}
          </Select>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : complaints.length === 0 ? (
          <EmptyState title="No complaints found" description="Raise a new complaint to get started." />
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Number</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Est. Resolution</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c) => (
                    <tr key={c.complaintId}>
                      <td><Link to={`/complaints/${c.complaintId}`}>{c.complaintNumber}</Link></td>
                      <td>{c.title}</td>
                      <td>{c.categoryName}</td>
                      <td><Badge label={c.status} /></td>
                      <td>{c.priority}</td>
                      <td>{formatDate(c.estimatedResolutionDate)}</td>
                      <td>{formatDate(c.createdDate)}</td>
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
