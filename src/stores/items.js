import { defineStore } from 'pinia'
import { http } from 'src/api/http'

export const useItemsStore = defineStore('items', {
  state: () => ({ items: [], loading: false }),
  actions: {
    async fetchAll () {
      this.loading = true
      try {
        const { data } = await http.get('/items')
        this.items = data.sort((a, b) => b.createdAt - a.createdAt)
      } catch (e) {
        if (e.response?.status === 404) this.items = []
        else throw e
      } finally {
        this.loading = false
      }
    },
    async fetchOne (id) {
      const { data } = await http.get(`/items/${id}`)
      return data
    },
    async create (payload) {
      const { data } = await http.post('/items', payload)
      this.items.unshift(data)
      return data
    },
    async update (id, payload) {
      const { data } = await http.put(`/items/${id}`, payload)
      const i = this.items.findIndex(x => x.id === id)
      if (i > -1) this.items[i] = data
      return data
    },
    async remove (id) {
      await http.delete(`/items/${id}`)
      this.items = this.items.filter(x => x.id !== id)
    }
  }
})
