import create from 'zustand'

type State = {
  token: string | null
  setToken: (t: string | null) => void
}

const useAuth = create<State>((set)=>({
  token: localStorage.getItem('admin_token'),
  setToken: (t)=> set(state=>{ localStorage.setItem('admin_token', t || ''); return { token: t } })
}))

export default useAuth
