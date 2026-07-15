import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Body from './Body'
import Login from './components/Pages/Login'
import { Provider } from 'react-redux'
import appStore from './utils/appStore'
import Profile from './components/Pages/Profile'
import Connection from './components/Pages/Connection'
import RequestReceive from './components/Pages/RequestReceive'
function App() {

  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename='/'>
          <Routes>
            <Route path='/' element={<Body />}>
              <Route path='/login' element={<div className='flex item-center justify-center mt-4'><Login /></div>} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/connection' element={<Connection />} />
              <Route path='/request' element={<RequestReceive />} />
            </Route>

          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
