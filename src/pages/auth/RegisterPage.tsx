import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../../context/AuthContext'
import { getApiErrorMessage } from '../../utils/format'

export function RegisterPage() {
  const { register } = useAuth()
  const [form, setForm] = useState({
    fullName: '',
    mobileNumber: '',
    street: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const message = await register(form)
      setSuccess(message)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Registration failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-form-container wide">
      <h2>Villager Registration</h2>
      <p className="auth-subtitle">Create your account to access village services</p>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} />}

      <form onSubmit={handleSubmit} className="auth-form grid-2">
        <Input
          label="Full Name"
          value={form.fullName}
          onChange={(e) => updateField('fullName', e.target.value)}
          required
        />
        <Input
          label="Mobile Number"
          value={form.mobileNumber}
          onChange={(e) => updateField('mobileNumber', e.target.value)}
          placeholder="10-digit mobile"
          required
        />
        <Input
          label="Street / Ward"
          value={form.street}
          onChange={(e) => updateField('street', e.target.value)}
          required
          className="span-2"
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => updateField('email', e.target.value)}
          required
          className="span-2"
        />
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => updateField('password', e.target.value)}
          required
          minLength={8}
        />
        <Input
          label="Confirm Password"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => updateField('confirmPassword', e.target.value)}
          required
        />
        <div className="span-2">
          <Button type="submit" loading={loading} className="w-full">
            Register
          </Button>
        </div>
      </form>

      <p className="auth-footer">
        Already registered? <Link to="/login">Sign in</Link>
      </p>
    </div>
  )
}
