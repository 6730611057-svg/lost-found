import { defineStore } from 'pinia'
import { http } from 'src/api/http'


async function findUsers (username) {
  try {
    const { data } = await http.get('/users', { params: { username } })
    return data.filter(u => u.username === username)
  } catch (e) {
    if (e.response?.status === 404) return []
    throw e
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null')
  }),
  getters: {
    isLoggedIn: s => !!s.user,
    isAdmin: s => s.user?.role === 'admin'
  },
  actions: {
    async login (username, password) {
      const users = await findUsers(username)
      const u = users.find(x => x.password === password)
      if (!u) throw new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
      this.setUser(u)
    },
    async register ({ username, password, name }) {
      if ((await findUsers(username)).length) throw new Error('ชื่อผู้ใช้นี้ถูกใช้แล้ว')
  
      const { data } = await http.post('/users', { username, password, name, role: 'user' })
      this.setUser(data)
    },
    setUser (u) {
      const { password, ...safe } = u 
      this.user = safe
      localStorage.setItem('user', JSON.stringify(safe))
    },
    logout () {
      this.user = null
      localStorage.removeItem('user')
    }
  }
})
