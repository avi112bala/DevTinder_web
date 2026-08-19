import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useLogout, useNavProfile } from '../hooks/useApiHooks'
import { useDispatch } from 'react-redux'
import { addUser } from '../utils/userSlice'
import { useEffect, useState, useRef } from 'react'
import DevTinderLogo from './DevTinderLogo'

const NavBar = () => {
  const user = useSelector((store: any) => store.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const { data: profileData } = useNavProfile()
  const { mutate: logout, isPending: isLoggingOut } = useLogout()

  useEffect(() => {
    if (profileData) dispatch(addUser(profileData))
  }, [profileData, dispatch])

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const navLinks = [
    { to: '/', icon: null, label: 'Discover' },
    { to: '/connection', icon: '💬', label: 'Matches' },
    { to: '/request', icon: '⭐', label: 'Requests' },
    { to: '/profile', icon: '👤', label: 'Profile' },
  ]

  return (
    <nav className="tinder-navbar">
      {/* Logo */}
      <div className="logo" onClick={() => navigate(user ? '/' : '/login')}>
        <DevTinderLogo size={30} />
        <span className="flame-text">DevTinder</span>
      </div>

      {/* Center nav links (desktop) */}
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {navLinks.map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                padding: '6px 14px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '11px',
                fontWeight: '600',
                color: 'var(--text-muted)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.background = 'var(--bg-glass)'
                el.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.background = 'transparent'
                el.style.color = 'var(--text-muted)'
              }}
            >
              <span style={{ fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon === null ? <DevTinderLogo size={20} /> : icon}
              </span>
              <span>{label}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Right side */}
      <div className="nav-actions">
        {user ? (
          <>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
              {user.firstName}
            </span>
            <div className="tinder-dropdown" ref={menuRef}>
              <img
                className="nav-avatar"
                src={user?.photoUrl ?? 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'}
                alt="avatar"
                onClick={() => setMenuOpen(v => !v)}
              />
              <div className={`tinder-dropdown-menu${menuOpen ? ' open' : ''}`}>
                {/* User info header */}
                <div style={{ padding: '10px 12px 8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{user.firstName} {user.lastName}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{user.emailId}</div>
                </div>

                <Link to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                  <span>👤</span> My Profile
                </Link>
                <Link to="/connection" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                  <span>💬</span> Matches
                </Link>
                <Link to="/request" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                  <span>⭐</span> Requests
                </Link>
                <Link to="/primium" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                  <span>👑</span> <span>Premium <span className="premium-badge" style={{ marginLeft: 4 }}>GOLD</span></span>
                </Link>
                <div className="dropdown-divider" />
                <button
                  className="dropdown-item danger"
                  disabled={isLoggingOut}
                  onClick={() => { setMenuOpen(false); logout() }}
                >
                  <span>🚪</span> {isLoggingOut ? 'Logging out…' : 'Sign Out'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <button className="btn-flame" style={{ padding: '8px 20px', fontSize: '14px' }} onClick={() => navigate('/login')}>
            Sign In
          </button>
        )}
      </div>
    </nav>
  )
}

export default NavBar