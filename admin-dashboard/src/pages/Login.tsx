import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/adminAPI'
import useAuth from '../store/authStore'

export default function Login(){
  const [email,setEmail]=useState('admin@kasifood.com')
  const [password,setPassword]=useState('admin123')
  const [err,setErr]=useState('')
  const setToken = useAuth(state=>state.setToken)
  const nav = useNavigate()

  const submit = async(e?:any)=>{
    e?.preventDefault()
    try{
      const data = await login(email,password)
      const token = data?.token || data?.accessToken || 'demo-token'
      setToken(token)
      localStorage.setItem('admin_token', token)
      nav('/')
    }catch(err:any){ setErr(err?.message || 'Login failed') }
  }

  return (
    <div style={{maxWidth:480, margin:'40px auto'}} className="card">
      <h2>Admin Login</h2>
      <form onSubmit={submit}>
        <div style={{marginBottom:8}}>
          <label>Email</label><br/>
          <input value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:8}} />
        </div>
        <div style={{marginBottom:8}}>
          <label>Password</label><br/>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:8}} />
        </div>
        <div style={{color:'red'}}>{err}</div>
        <button type="submit" style={{background:'#d32f2f', color:'white', padding:'8px 12px', border:'none', borderRadius:4}}>Login</button>
      </form>
    </div>
  )
}
