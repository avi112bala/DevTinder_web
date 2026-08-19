import { useSendConnectionRequest } from '../../hooks/useApiHooks'

const Feed = ({ feedData }: any) => {
  const { mutate: sendRequest, isPending } = useSendConnectionRequest()

  if (!feedData) {
    return (
      <div className="empty-state" style={{ minHeight: '460px' }}>
        <div className="empty-state-icon">🎉</div>
        <div className="empty-state-title">You're all caught up!</div>
        <div className="empty-state-sub">Come back later to discover more developers</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      {/* Card */}
      <div className="swipe-card">
        <img
          className="swipe-card-img"
          src={feedData?.photoUrl ?? 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'}
          alt={feedData?.firstName}
        />
        <div className="swipe-card-overlay" />

        {/* Info overlay */}
        <div className="swipe-card-info">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="swipe-card-name">{feedData?.firstName}</span>
            {feedData?.age && <span className="swipe-card-age">{feedData.age}</span>}
          </div>

          {feedData?.gender && (
            <span className="swipe-card-tag">
              {feedData.gender === 'male' ? '♂' : feedData.gender === 'female' ? '♀' : '⚧'} {feedData.gender}
            </span>
          )}

          {feedData?.about && (
            <p className="swipe-card-bio">{feedData.about}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="action-bar">
          <button
            className="action-btn nope"
            disabled={isPending}
            onClick={() => sendRequest({ status: 'ignored', userId: feedData._id })}
            title="Pass"
          >
            ✕
          </button>

          <button
            className="action-btn super-like"
            disabled={isPending}
            title="Super Like"
            style={{ fontSize: '18px' }}
          >
            ⭐
          </button>

          <button
            className="action-btn like"
            disabled={isPending}
            onClick={() => sendRequest({ status: 'interested', userId: feedData._id })}
            title="Like"
          >
            ♥
          </button>
        </div>
      </div>

      {/* Keyboard hint */}
      <div style={{ display: 'flex', gap: '24px', color: 'var(--text-muted)', fontSize: '12px' }}>
        <span>← Pass</span>
        <span>→ Like</span>
      </div>
    </div>
  )
}

export default Feed