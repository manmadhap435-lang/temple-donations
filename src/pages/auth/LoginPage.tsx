import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../../context/AuthContext'
import { getApiErrorMessage } from '../../utils/format'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const loggedInUser = await login({ email, password })
      const defaultHome =
        loggedInUser.role === 'ADMIN'
          ? '/admin'
          : loggedInUser.role === 'SECRETARY'
            ? '/secretary'
            : '/dashboard'
      navigate(from || defaultHome, { replace: true })
    } catch (err) {
      setError(getApiErrorMessage(err, 'Login failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-form-container">
      <h2>Welcome back</h2>
      <p className="auth-subtitle">Sign in to your Panchayat account</p>

      <div className="demo-credentials">
        <strong>Demo access</strong>
        <span>Villager: villager@ravivalasa.local / Villager@123</span>
        <span>Secretary: secretary@ravivalasa.local / Secretary@123</span>
        <span>Admin: admin@ravivalasa.local / Admin@123</span>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <form onSubmit={handleSubmit} className="auth-form">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <Button type="submit" loading={loading} className="w-full">
          Sign In
        </Button>
      </form>

      <p className="auth-footer">
        Don&apos;t have an account? <Link to="/register">Register as villager</Link>
      </p>
    </div>
  )
}
