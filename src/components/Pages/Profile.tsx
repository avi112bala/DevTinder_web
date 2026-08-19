import { useEffect, useState } from 'react'
import { useProfile, useUpdateProfile } from '../../hooks/useApiHooks'

const Profile = () => {
  const [firstName, setfirstName] = useState('')
  const [lastName, setlastName] = useState('')
  const [emailId, setemailId] = useState('')
  const [about, setabout] = useState('')
  const [photoUrl, setphotoUrl] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [userId, setuserId] = useState('')

  const { data, isLoading } = useProfile()
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile()

  useEffect(() => {
    if (!data) return
    setfirstName(data.firstName ?? '')
    setlastName(data.lastName ?? '')
    setemailId(data.emailId ?? '')
    setabout(data.about ?? '')
    setphotoUrl(data.photoUrl ?? '')
    setAge(data.age ?? '')
    setGender(data.gender ?? '')
    setuserId(data._id ?? '')
  }, [data])

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-text">Loading your profile…</div>
      </div>
    )
  }

  const formFields = [
    { label: 'First Name', value: firstName, setter: setfirstName, type: 'text', placeholder: 'First name' },
    { label: 'Last Name', value: lastName, setter: setlastName, type: 'text', placeholder: 'Last name' },
    { label: 'About', value: about, setter: setabout, type: 'text', placeholder: 'Tell developers about yourself…' },
    { label: 'Photo URL', value: photoUrl, setter: setphotoUrl, type: 'url', placeholder: 'https://…' },
    { label: 'Email', value: emailId, setter: setemailId, type: 'email', placeholder: 'you@example.com' },
    { label: 'Age', value: age, setter: setAge, type: 'text', placeholder: 'e.g. 26' },
    { label: 'Gender', value: gender, setter: setGender, type: 'text', placeholder: 'e.g. Male / Female / Other' },
  ]

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="section-badge">✏️ Edit Profile</div>
      <div className="profile-page-title">
        <span className="flame-text">Your Profile</span>
      </div>

      <div className="profile-grid">
        {/* Form */}
        <div className="profile-form-card">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {formFields.slice(0, 2).map(f => (
              <div key={f.label} className="form-group">
                <label>{f.label}</label>
                <input
                  type={f.type}
                  className="form-input"
                  placeholder={f.placeholder}
                  value={f.value}
                  onChange={e => f.setter(e.target.value)}
                />
              </div>
            ))}
          </div>

          {formFields.slice(2).map(f => (
            <div key={f.label} className="form-group">
              <label>{f.label}</label>
              <input
                type={f.type}
                className="form-input"
                placeholder={f.placeholder}
                value={f.value}
                onChange={e => f.setter(e.target.value)}
              />
            </div>
          ))}

          <div style={{ marginTop: '8px', display: 'flex', gap: '12px' }}>
            <button
              className="btn-flame"
              style={{ flex: 1 }}
              disabled={isUpdating}
              onClick={() => updateProfile({ firstName, lastName, emailId, about, photoUrl, age, gender, userId })}
            >
              {isUpdating ? (
                <>
                  <div className="flame-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  Saving…
                </>
              ) : '💾 Save Changes'}
            </button>
          </div>
        </div>

        {/* Preview Card */}
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
            Preview
          </div>
          <div className="swipe-card" style={{ width: '100%', height: '500px' }}>
            <img
              className="swipe-card-img"
              src={photoUrl || 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'}
              alt="Preview"
            />
            <div className="swipe-card-overlay" />
            <div className="swipe-card-info" style={{ paddingBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span className="swipe-card-name">{firstName || 'Your Name'}</span>
                {age && <span className="swipe-card-age">{age}</span>}
              </div>
              {gender && <span className="swipe-card-tag">{gender}</span>}
              {about && <p className="swipe-card-bio">{about}</p>}
              {emailId && (
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>
                  ✉️ {emailId}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
