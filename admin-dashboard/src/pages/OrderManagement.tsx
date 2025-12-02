import React, { useEffect, useState } from 'react'
import { getOrders } from '../api/adminAPI'

export default function OrderManagement(){
  const [orders,setOrders]=useState<any[]>([])
  useEffect(()=>{ getOrders().then(o=>setOrders(o||[])).catch(()=>{}) },[])
  return (
    <div>
      <h2>Orders</h2>
      <div className="card">
        <table style={{width:'100%'}}>
          <thead><tr><th>ID</th><th>Customer</th><th>Restaurant</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>
            {orders.map((o,i)=>(<tr key={i}><td>{o.id}</td><td>{o.customerName}</td><td>{o.restaurantName}</td><td>R{o.total}</td><td>{o.status}</td></tr>))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
