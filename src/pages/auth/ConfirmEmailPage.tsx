import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { authApi } from '../../api/authApi'
import { Alert } from '../../components/ui/Alert'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { getApiErrorMessage } from '../../utils/format'

export function ConfirmEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function confirm() {
      if (!token) {
        setError('Invalid verification link.')
        setLoading(false)
        return
      }
      try {
        const { data } = await authApi.confirmEmail(token)
        setMessage(data.message || 'Email verified successfully.')
      } catch (err) {
        setError(getApiErrorMessage(err, 'Email verification failed'))
      } finally {
        setLoading(false)
      }
    }
    confirm()
  }, [token])

  if (loading) {
    return (
      <div className="page-center">
        <LoadingSpinner size="lg" />
        <p>Verifying your email…</p>
      </div>
    )
  }

  return (
    <div className="auth-form-container">
      <h2>Email Verification</h2>
      {error ? (
        <Alert type="error" message={error} />
      ) : (
        <Alert type="success" message={message} />
      )}
      <p className="auth-footer">
        <Link to="/login">Proceed to login</Link>
      </p>
    </div>
  )
}
