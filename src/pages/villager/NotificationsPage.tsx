import { useEffect, useState } from 'react'
import { notificationApi } from '../../api/notificationApi'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { Pagination } from '../../components/ui/Pagination'
import type { Notification } from '../../types'
import { formatDateTime } from '../../utils/format'

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data } = await notificationApi.getMy(pageNumber, 10)
    if (data.success && data.data) {
      setNotifications(data.data.items)
      setTotalPages(data.data.pagination.totalPages)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [pageNumber])

  async function markRead(id: number) {
    await notificationApi.markAsRead(id)
    load()
  }

  async function markAllRead() {
    await notificationApi.markAllAsRead()
    load()
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p>Village updates and alerts</p>
        </div>
        <Button variant="secondary" onClick={markAllRead}>Mark all read</Button>
      </div>

      <Card>
        {loading ? (
          <LoadingSpinner />
        ) : notifications.length === 0 ? (
          <EmptyState title="No notifications" />
        ) : (
          <>
            <div className="notification-list">
              {notifications.map((n) => (
                <div key={n.notificationId} className={`notification-item ${n.isRead ? 'read' : 'unread'}`}>
                  <div className="notification-header">
                    <strong>{n.title}</strong>
                    <span>{formatDateTime(n.createdDate)}</span>
                  </div>
                  <p>{n.message}</p>
                  {!n.isRead && (
                    <Button size="sm" variant="ghost" onClick={() => markRead(n.notificationId)}>
                      Mark as read
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Pagination pageNumber={pageNumber} totalPages={totalPages} onPageChange={setPageNumber} />
          </>
        )}
      </Card>
    </div>
  )
}
