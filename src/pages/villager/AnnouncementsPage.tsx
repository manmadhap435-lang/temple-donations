import { useEffect, useState } from 'react'
import { announcementApi } from '../../api/applicationApi'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { Pagination } from '../../components/ui/Pagination'
import type { Announcement } from '../../types'
import { formatDate } from '../../utils/format'

export function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    announcementApi.getPublished(pageNumber, 10).then(({ data }) => {
      if (data.success && data.data) {
        setAnnouncements(data.data.items)
        setTotalPages(data.data.pagination.totalPages)
      }
    }).finally(() => setLoading(false))
  }, [pageNumber])

  return (
    <div className="page">
      <div className="page-header">
        <h1>Announcements</h1>
        <p>Government and village announcements</p>
      </div>

      <Card>
        {loading ? (
          <LoadingSpinner />
        ) : announcements.length === 0 ? (
          <EmptyState title="No announcements" />
        ) : (
          <>
            <div className="announcement-list">
              {announcements.map((a) => (
                <article key={a.announcementId} className="announcement-item">
                  <h3>{a.title}</h3>
                  <p className="muted">{formatDate(a.publishedDate || a.createdDate)}</p>
                  <p>{a.content}</p>
                </article>
              ))}
            </div>
            <Pagination pageNumber={pageNumber} totalPages={totalPages} onPageChange={setPageNumber} />
          </>
        )}
      </Card>
    </div>
  )
}
