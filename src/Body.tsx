import { Outlet, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar'
import { useSelector } from 'react-redux'
import Feed from './components/Pages/Feed'
import { useFeed } from './hooks/useApiHooks'

const Body = () => {
  const userdata = useSelector((store: any) => store.user)
  const feedData = useSelector((store: any) => store.feed)
  const location = useLocation()

  const { isLoading: isFeedLoading } = useFeed()

  const isHome = location.pathname === '/'

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
      <NavBar />

      {userdata && isHome ? (
        <div className="feed-page">
          {isFeedLoading ? (
            <div className="loading-screen" style={{ minHeight: 'auto' }}>
              <div className="loading-text">Finding developers near you…</div>
            </div>
          ) : (
            <Feed feedData={feedData?.[0]} />
          )}
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  )
}

export default Body