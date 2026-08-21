import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Body from './Body'
import Login from './components/Pages/Login'
import { Provider } from 'react-redux'
import appStore from './utils/appStore'
import Profile from './components/Pages/Profile'
import Connection from './components/Pages/Connection'
import RequestReceive from './components/Pages/RequestReceive'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import Primium from './components/Pages/Primium'
import Chat from './components/Pages/Chat'

// Create QueryClient outside component so it is not recreated on every render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <QueryClientProvider client={queryClient}>
        <Provider store={appStore}>
          <BrowserRouter basename="/">
            <Routes>
              <Route path="/" element={<Body />}>
                <Route
                  path="/login"
                  element={
                    <div className="flex item-center justify-center mt-4">
                      <Login />
                    </div>
                  }
                />
                <Route path="/profile" element={<Profile />} />
                <Route path="/connection" element={<Connection />} />
                <Route path="/request" element={<RequestReceive />} />
                <Route path="/primium" element={<Primium />} />
                <Route path="/chat/:id" element={<Chat />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </Provider>
      </QueryClientProvider>
    </>
  )
}

export default App
