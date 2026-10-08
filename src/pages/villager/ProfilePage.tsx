import { useEffect, useState } from 'react'
import { userApi } from '../../api/userApi'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import type { UserProfile } from '../../types/user'
import { getApiErrorMessage } from '../../utils/format'

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    userApi
      .getProfile()
      .then(({ data }) => {
        if (data.success && data.data) setProfile(data.data)
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return
    setSaving(true)
    setError('')
    setMessage('')
    try {
      await userApi.updateProfile({
        fullName: profile.fullName,
        mobileNumber: profile.mobileNumber,
        street: profile.street,
        doorNumber: profile.doorNumber,
        village: profile.village,
        mandal: profile.mandal,
        district: profile.district,
        state: profile.state,
        pincode: profile.pincode,
      })
      setMessage('Profile updated successfully')
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner size="lg" />
  if (!profile) return <Alert type="error" message="Profile not found" />

  function update(field: keyof UserProfile, value: string) {
    setProfile((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Profile</h1>
      </div>

      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <Card title="Personal Information">
        <form onSubmit={handleSave} className="form-grid">
          <Input label="Full Name" value={profile.fullName} onChange={(e) => update('fullName', e.target.value)} required />
          <Input label="Email" value={profile.email} disabled />
          <Input label="Mobile" value={profile.mobileNumber} onChange={(e) => update('mobileNumber', e.target.value)} required />
          <Input label="Door Number" value={profile.doorNumber} onChange={(e) => update('doorNumber', e.target.value)} />
          <Input label="Street / Ward" value={profile.street} onChange={(e) => update('street', e.target.value)} required />
          <Input label="Village" value={profile.village} onChange={(e) => update('village', e.target.value)} />
          <Input label="Mandal" value={profile.mandal} onChange={(e) => update('mandal', e.target.value)} />
          <Input label="District" value={profile.district} onChange={(e) => update('district', e.target.value)} />
          <Input label="State" value={profile.state} onChange={(e) => update('state', e.target.value)} />
          <Input label="Pincode" value={profile.pincode} onChange={(e) => update('pincode', e.target.value)} />
          <div className="form-actions">
            <Button type="submit" loading={saving}>Save Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
