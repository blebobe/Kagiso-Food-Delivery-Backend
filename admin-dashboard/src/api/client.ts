import axios from 'axios'

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000' })
API.interceptors.request.use(cfg=>{
  const token = localStorage.getItem('admin_token')
  if (token) cfg.headers = {...cfg.headers, Authorization: `Bearer ${token}`}
  return cfg
})
export default API
