import axios, { AxiosError } from 'axios'


const API_URL = 'https://6b0401139e7cafb37dbfc47a.mockapi.io/api'


const SEED = {
  users: [
    { id: '1', username: 'admin', password: 'admin1234', name: 'ผู้ดูแลระบบ', role: 'admin' },
    { id: '2', username: 'user1', password: 'user1234', name: 'นักศึกษาตัวอย่าง', role: 'user' }
  ],
  items: [
    {
      id: '1', type: 'lost', title: 'กระเป๋าสตางค์สีดำ', description: 'ยี่ห้อ Levi’s มีบัตรนักศึกษาอยู่ข้างใน',
      location: 'โรงอาหารกลาง', date: new Date().toISOString().slice(0, 10), contact: 'LINE: demo01',
      status: 'open', ownerId: '2', ownerName: 'นักศึกษาตัวอย่าง', createdAt: Date.now() - 1000
    },
    {
      id: '2', type: 'found', title: 'กุญแจรถมอเตอร์ไซค์', description: 'พวงกุญแจรูปหมีสีน้ำตาล',
      location: 'ห้องสมุด ชั้น 2', date: new Date().toISOString().slice(0, 10), contact: 'โทร 081-234-5678',
      status: 'open', ownerId: '2', ownerName: 'นักศึกษาตัวอย่าง', createdAt: Date.now()
    }
  ]
}

function table (name) {
  const key = 'lf_' + name
  if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(SEED[name]))
  return {
    all: () => JSON.parse(localStorage.getItem(key)),
    save: rows => localStorage.setItem(key, JSON.stringify(rows))
  }
}

async function localAdapter (config) {
  const respond = (data, status = 200) => ({ data, status, statusText: 'OK', headers: {}, config, request: {} })
  const fail = status => Promise.reject(new AxiosError(
    'Request failed with status code ' + status, 'ERR_BAD_REQUEST', config, {},
    { data: null, status, statusText: 'Error', headers: {}, config }
  ))

  const [, resource, id] = config.url.split('?')[0].split('/')
  if (!SEED[resource]) return fail(404)

  const t = table(resource)
  const rows = t.all()
  const method = config.method.toLowerCase()
  const body = config.data ? JSON.parse(config.data) : {}

  await new Promise(r => setTimeout(r, 250)) // จำลองความหน่วงของเครือข่าย

  if (method === 'get' && !id) {
    const params = config.params || {}
    const res = rows.filter(r => Object.keys(params).every(k => String(r[k]) === String(params[k])))
    return res.length ? respond(res) : fail(404) // เลียนแบบ MockAPI: ไม่เจอ = 404
  }
  if (method === 'post') {
    const row = { ...body, id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6) }
    t.save([...rows, row])
    return respond(row, 201)
  }
  const idx = rows.findIndex(r => r.id === id)
  if (idx < 0) return fail(404)
  if (method === 'get') return respond(rows[idx])
  if (method === 'put') {
    rows[idx] = { ...body, id }
    t.save(rows)
    return respond(rows[idx])
  }
  if (method === 'delete') {
    const [removed] = rows.splice(idx, 1)
    t.save(rows)
    return respond(removed)
  }
  return fail(405)
}

export const http = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  ...(API_URL ? {} : { adapter: localAdapter })
})
