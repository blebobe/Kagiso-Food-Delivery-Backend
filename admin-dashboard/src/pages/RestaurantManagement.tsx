import React, { useEffect, useState } from 'react'
import { getRestaurants } from '../api/adminAPI'

export default function RestaurantManagement(){
  const [items,setItems]=useState<any[]>([])
  useEffect(()=>{ getRestaurants().then(r=>setItems(r||[])).catch(()=>{}) },[])
  return (
    <div>
      <h2>Restaurants</h2>
      <div className="card">
        <table style={{width:'100%'}}>
          <thead><tr><th>Name</th><th>Location</th></tr></thead>
          <tbody>
            {items.map((r,i)=>(<tr key={i}><td>{r.name}</td><td>{r.location}</td></tr>))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
