import API from './client'

export const login = async (email:string, password:string) => {
  // backend expects /admin/login or /auth/login; try /auth/login then /admin/login
  try { const r = await API.post('/auth/login', { email, password }); return r.data } catch (e) {}
  const r = await API.post('/admin/login', { email, password }); return r.data
}

export const getStats = async () => {
  const r = await API.get('/admin/stats'); return r.data
}

export const getRestaurants = async () => { const r=await API.get('/admin/restaurants'); return r.data }
export const getDrivers = async () => { const r=await API.get('/admin/drivers'); return r.data }
export const getOrders = async () => { const r=await API.get('/admin/orders'); return r.data }
export const getRevenue = async () => { const r=await API.get('/admin/revenue'); return r.data }

export default { login, getStats, getRestaurants, getDrivers, getOrders, getRevenue }
