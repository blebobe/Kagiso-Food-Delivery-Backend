import React, { useEffect, useState } from 'react'
import { getRevenue } from '../api/adminAPI'

export default function Analytics(){
  const [rev,setRev]=useState<any>(null)
  useEffect(()=>{ getRevenue().then(r=>setRev(r)).catch(()=>{}) },[])
  return (
    <div>
      <h2>Analytics</h2>
      <div className="card">
        <div>Today: R{rev?.today ?? '—'}</div>
        <div>This Week: R{rev?.week ?? '—'}</div>
        <div>This Month: R{rev?.month ?? '—'}</div>
        <div>Total: R{rev?.total ?? '—'}</div>
      </div>
    </div>
  )
}
