import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import Hero from './pages/Hero'
import UserProtectWrapper from './pages/UserProtectWrapper'
import UserLogout from './pages/UserLogout'
import SearchButtonSection from './pages/SearchButtonSection'
import SearchHistory from './pages/SearchHistory'


const App = () => {
  
 
  return (
    <div>
      
      <Routes>
        <Route path='/' element={<Hero/>}/>
        <Route path='/login' element={<UserLogin/>}/>
        <Route path='/signup' element={<UserSignup/>}/>
        <Route path='/home' element={
          <UserProtectWrapper>
            <Home/>
          </UserProtectWrapper>
        }/>
        <Route path="/search" element={
          <UserProtectWrapper>
            <SearchButtonSection />
          </UserProtectWrapper>
        } />
        <Route path='/user/logout' element={
          <UserProtectWrapper>
            <UserLogout/>
          </UserProtectWrapper>
        }/>

        <Route path='/search-history' element={
          <UserProtectWrapper>
            <SearchHistory/>
          </UserProtectWrapper>
        }/>
   
      </Routes>
    </div>
  )
}

export default App
