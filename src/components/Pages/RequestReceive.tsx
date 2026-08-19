import { useSelector } from 'react-redux'
import { useReceivedRequests, useReviewConnectionRequest } from '../../hooks/useApiHooks'

const RequestReceive = () => {
  const connectiondata = useSelector((store: any) => store.request)
  const { isLoading, isError } = useReceivedRequests()
  const { mutate: reviewRequest, isPending } = useReviewConnectionRequest()

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-text">Loading requests…</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="empty-state" style={{ flex: 1, minHeight: 'calc(100dvh - 64px)' }}>
        <div className="empty-state-icon">😕</div>
        <div className="empty-state-title">Failed to load requests</div>
        <div className="empty-state-sub">Please check your connection and try again</div>
      </div>
    )
  }

  return (
    <div className="list-page">
      <div className="section-badge">⭐ Requests</div>
      <div className="list-page-title">
        <span className="flame-text">Connection Requests</span>
      </div>
      <div className="list-page-subtitle">
        {connectiondata?.length ?? 0} pending {connectiondata?.length === 1 ? 'request' : 'requests'}
      </div>

      {(!connectiondata || connectiondata.length === 0) ? (
        <div className="empty-state">
          <div className="empty-state-icon">📬</div>
          <div className="empty-state-title">No pending requests</div>
          <div className="empty-state-sub">When someone swipes right on you, they'll show up here</div>
        </div>
      ) : (
        connectiondata.map((item: any) => {
          const from = item?.fromUserId
          return (
            <div key={item._id} className="person-card">
              <img
                className="person-avatar"
                src={from?.photoUrl ?? 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'}
                alt={from?.firstName}
              />
              <div className="person-info">
                <div className="person-name">{from?.firstName} {from?.lastName}</div>
                <div className="person-meta">
                  {from?.age && <span>🎂 {from.age}</span>}
                  {from?.gender && <span>⚧ {from.gender}</span>}
                  {from?.about && (
                    <span style={{
                      color: 'var(--text-muted)',
                      fontSize: '12px',
                      fontStyle: 'italic',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '180px'
                    }}>
                      {from.about}
                    </span>
                  )}
                </div>
              </div>
              <div className="person-actions">
                <button
                  className="btn-outline-flame"
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                  disabled={isPending}
                  onClick={() => reviewRequest({ status: 'rejected', requestId: item._id })}
                >
                  ✕ Pass
                </button>
                <button
                  className="btn-flame"
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                  disabled={isPending}
                  onClick={() => reviewRequest({ status: 'accepted', requestId: item._id })}
                >
                  ♥ Accept
                </button>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

export default RequestReceive