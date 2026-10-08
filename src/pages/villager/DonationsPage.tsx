import { useEffect, useState } from 'react'
import { donationApi } from '../../api/donationApi'
import { Alert } from '../../components/ui/Alert'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { Select } from '../../components/ui/Select'
import type { Donation, DonationCategory } from '../../types'
import { formatCurrency, formatDate, getApiErrorMessage } from '../../utils/format'

export function DonationsPage() {
  const [categories, setCategories] = useState<DonationCategory[]>([])
  const [donations, setDonations] = useState<Donation[]>([])
  const [categoryId, setCategoryId] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const [catRes, donRes] = await Promise.all([
        donationApi.getCategories(),
        donationApi.getMy(1, 10),
      ])
      if (catRes.data.success && catRes.data.data) setCategories(catRes.data.data)
      if (donRes.data.success && donRes.data.data) setDonations(donRes.data.data.items)
      setLoading(false)
    }
    load()
  }, [])

  async function handleDonate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const { data } = await donationApi.create(Number(categoryId), Number(amount))
      setMessage(data.message || 'Donation recorded successfully')
      setCategoryId('')
      setAmount('')
      const donRes = await donationApi.getMy(1, 10)
      if (donRes.data.success && donRes.data.data) setDonations(donRes.data.data.items)
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
        <h1>Donations</h1>
        <p>Support rural and sports development in our village</p>
      </div>

      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="detail-grid">
        <Card title="Make a Donation">
          <form onSubmit={handleDonate} className="form-grid">
            <Select label="Category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
              <option value="">Select category</option>
              {categories.filter((c) => c.isActive).map((c) => (
                <option key={c.donationCategoryId} value={c.donationCategoryId}>{c.categoryName}</option>
              ))}
            </Select>
            <Input label="Amount (INR)" type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <div className="form-actions span-2">
              <Button type="submit" loading={submitting}>Donate</Button>
            </div>
          </form>
        </Card>

        <Card title="Donation Categories">
          <ul className="simple-list">
            {categories.map((c) => (
              <li key={c.donationCategoryId}>
                <strong>{c.categoryName}</strong>
                {c.description && <span>{c.description}</span>}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="My Donation History">
        {donations.length === 0 ? (
          <p>No donations yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Status</th>
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
        )}
      </Card>
    </div>
  )
}
