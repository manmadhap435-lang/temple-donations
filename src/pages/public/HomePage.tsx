import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { announcementApi } from '../../api/applicationApi'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import type { Announcement } from '../../types'
import { formatDate } from '../../utils/format'

export function HomePage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    announcementApi
      .getPublished(1, 5)
      .then(({ data }) => {
        if (data.success && data.data) {
          setAnnouncements(data.data.items)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page public-home">
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">Ravivalasa Gram Panchayat</span>
          <h1>Digital Governance for Our Village</h1>
          <p>
            Raise complaints, track resolutions, apply for government schemes, donate for village
            development, and stay informed — all through one portal.
          </p>
          <div className="hero-actions">
            <Link to="/register">
              <Button>Register as Villager</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary">Login</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>Village Services</h2>
        <div className="features-grid">
          <Card title="Complaint Management">
            Report issues like roads, water, electricity, sanitation and track resolution.
          </Card>
          <Card title="Schemes & Applications">
            Browse available government schemes and apply online.
          </Card>
          <Card title="Donations">
            Contribute to rural development and sports initiatives.
          </Card>
          <Card title="Announcements">
            Stay updated with village and government notifications.
          </Card>
        </div>
      </section>

      <section className="announcements-section">
        <h2>Latest Announcements</h2>
        {loading ? (
          <LoadingSpinner />
        ) : announcements.length === 0 ? (
          <p>No announcements at this time.</p>
        ) : (
          <div className="announcement-list">
            {announcements.map((a) => (
              <Card key={a.announcementId} title={a.title} subtitle={formatDate(a.publishedDate)}>
                <p>{a.content.slice(0, 200)}{a.content.length > 200 ? '…' : ''}</p>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
