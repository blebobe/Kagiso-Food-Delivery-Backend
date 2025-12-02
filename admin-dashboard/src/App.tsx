import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import RestaurantManagement from './pages/RestaurantManagement'
import DriverManagement from './pages/DriverManagement'
import OrderManagement from './pages/OrderManagement'
import Analytics from './pages/Analytics'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <div>
      <header>
        <div style={{maxWidth:1100, margin:'0 auto'}}>
          <Link to="/" style={{color:'white', textDecoration:'none', fontWeight:700}}>Kagiso Admin</Link>
        </div>
      </header>
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
          <Route path="/restaurants" element={<ProtectedRoute><RestaurantManagement/></ProtectedRoute>} />
          <Route path="/drivers" element={<ProtectedRoute><DriverManagement/></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrderManagement/></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics/></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  )
}
