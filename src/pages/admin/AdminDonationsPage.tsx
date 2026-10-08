import { useEffect, useState } from 'react'
import { donationApi } from '../../api/donationApi'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { Pagination } from '../../components/ui/Pagination'
import type { Donation } from '../../types'
import { formatCurrency, formatDate } from '../../utils/format'

export function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    donationApi.getAll({ pageNumber, pageSize: 10 }).then(({ data }) => {
      if (data.success && data.data) {
        setDonations(data.data.items)
        setTotalPages(data.data.pagination.totalPages)
      }
    }).finally(() => setLoading(false))
  }, [pageNumber])

  return (
    <div className="page">
      <div className="page-header">
        <h1>Donation Management</h1>
        <p>View all village donations</p>
      </div>

      <Card>
        {loading ? (
          <LoadingSpinner />
        ) : donations.length === 0 ? (
          <EmptyState title="No donations" />
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Number</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Payment Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d) => (
                    <tr key={d.donationId}>
                      <td>{d.donationNumber}</td>
                      <td>{d.categoryName}</td>
                      <td>{formatCurrency(d.amount)}</td>
                      <td><Badge label={d.paymentStatus} /></td>
                      <td>{formatDate(d.createdDate)}</td>
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
