import React, { useEffect, useState } from 'react'
import { getDrivers } from '../api/adminAPI'

export default function DriverManagement(){
  const [drivers,setDrivers]=useState<any[]>([])
  useEffect(()=>{ getDrivers().then(d=>setDrivers(d||[])).catch(()=>{}) },[])
  return (
    <div>
      <h2>Drivers</h2>
      <div className="card">
        <table style={{width:'100%'}}>
          <thead><tr><th>Name</th><th>Email</th><th>Earnings</th></tr></thead>
          <tbody>
            {drivers.map((d,i)=>(<tr key={i}><td>{d.name}</td><td>{d.email}</td><td>R{d.earnings ?? 0}</td></tr>))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
