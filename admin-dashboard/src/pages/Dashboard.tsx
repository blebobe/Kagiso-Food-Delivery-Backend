import React, { useEffect, useState } from 'react'
import { getStats } from '../api/adminAPI'

export default function Dashboard(){
  const [stats,setStats]=useState<any>(null)
  useEffect(()=>{ getStats().then(s=>setStats(s)).catch(()=>{}) },[])
  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
        <div className="card">Total Orders<br/><strong>{stats?.totalOrders ?? '—'}</strong></div>
        <div className="card">Revenue<br/><strong>R{stats?.revenue ?? '—'}</strong></div>
        <div className="card">Active Drivers<br/><strong>{stats?.activeDrivers ?? '—'}</strong></div>
      </div>
      <div style={{marginTop:12}} className="card">
        <h3>Quick Actions</h3>
        <div style={{display:'flex',gap:8}}>
          <a href="/restaurants">Restaurants</a>
          <a href="/drivers">Drivers</a>
          <a href="/orders">Orders</a>
          <a href="/analytics">Analytics</a>
        </div>
      </div>
    </div>
  )
}
