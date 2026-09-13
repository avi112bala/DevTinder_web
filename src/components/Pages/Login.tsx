import { useState } from 'react'
import { useLogin, useSignup } from '../../hooks/useApiHooks'
import DevTinderLogo from '../DevTinderLogo'

const Login = () => {
  const [email, setEmail] = useState('Sarvani@gmail.com')
  const [password, setPassword] = useState('Dhoni@123456')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isLoginMode, setIsLoginMode] = useState(true)

  const { mutate: login, isPending: isLoginPending } = useLogin()
  const { mutate: signup, isPending: isSignupPending } = useSignup()
  const isPending = isLoginPending || isSignupPending

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoginMode) {
      login({ emailId: email, password })
    } else {
      signup({
        firstName,
        lastName,
        emailId: email,
        password,
        photoUrl: 'https://cdn.vectorstock.com/i/500p/81/62/grey-business-avatar-placeholder-vector-38508162.jpg',
      })
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <span style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            <DevTinderLogo size={52} />
          </span>
          <h1 className="flame-text">DevTinder</h1>
          <p>Connect with developers around the world</p>
        </div>

        {/* Mode Tabs */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab${isLoginMode ? ' active' : ''}`}
            onClick={() => setIsLoginMode(true)}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab${!isLoginMode ? ' active' : ''}`}
            onClick={() => setIsLoginMode(false)}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Sign-up only fields */}
          {!isLoginMode && (
            <div className="auth-name-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="First name"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Last name"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label>Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-flame" style={{ width: '100%' }} disabled={isPending}>
            {isPending ? (
              <>
                <div className="flame-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                {isLoginMode ? 'Signing in…' : 'Creating account…'}
              </>
            ) : (
              isLoginMode ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
          {isLoginMode ? "Don't have an account? " : 'Already have an account? '}
          <span
            style={{ color: 'var(--flame-start)', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => setIsLoginMode(v => !v)}
          >
            {isLoginMode ? 'Create one' : 'Sign in'}
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login