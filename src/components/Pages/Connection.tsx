import { useSelector } from 'react-redux'
import { useConnections } from '../../hooks/useApiHooks'
import { Link } from 'react-router-dom'

const Connection = () => {
  const connectiondata = useSelector((store: any) => store.connection)
  const { isLoading, isError } = useConnections()

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-text">Loading your matches…</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="empty-state" style={{ flex: 1, minHeight: 'calc(100dvh - 64px)' }}>
        <div className="empty-state-icon">😕</div>
        <div className="empty-state-title">Failed to load matches</div>
        <div className="empty-state-sub">Please check your connection and try again</div>
      </div>
    )
  }

  return (
    <div className="list-page">
      <div className="section-badge">💬 Matches</div>
      <div className="list-page-title">
        <span className="flame-text">Your Matches</span>
      </div>
      <div className="list-page-subtitle">
        {connectiondata?.length ?? 0} mutual {connectiondata?.length === 1 ? 'connection' : 'connections'}
      </div>

      {(!connectiondata || connectiondata.length === 0) ? (
        <div className="empty-state">
          <div className="empty-state-icon">💔</div>
          <div className="empty-state-title">No matches yet</div>
          <div className="empty-state-sub">Keep swiping — your matches will appear here</div>
        </div>
      ) : (
        connectiondata.map((item: any) => (
          <div key={item._id} className="person-card">
            <img
              className="person-avatar"
              src={item?.photoUrl ?? 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'}
              alt={item?.firstName}
            />
            <div className="person-info">
              <div className="person-name">{item?.firstName} {item?.lastName}</div>
              <div className="person-meta">
                {item?.age && <span>🎂 {item.age}</span>}
                {item?.gender && <span>⚧ {item.gender}</span>}
                {item?.about && (
                  <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                    {item.about}
                  </span>
                )}
              </div>
            </div>
            <div className="person-actions">
              <Link to={`/chat/${item._id}`}>
                <button className="btn-flame" style={{ padding: '8px 18px', fontSize: '13px' }}>
                  💬 Message
                </button>
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Connection