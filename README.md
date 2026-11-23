# เว็บหาของหายในมหาวิทยาลัย (Quasar + Vue Router + Pinia)

## รันบนเครื่อง
ต้องมี Node.js 20 ขึ้นไป
```bash
npm install
npm run dev
```
เบราว์เซอร์จะเปิดให้เอง (http://localhost:9000)

## บัญชีทดลอง
| บทบาท | username | password |
|---|---|---|
| admin | admin | admin1234 |
| user | user1 | user1234 |

สมัครสมาชิกใหม่ผ่านหน้าเว็บได้ จะได้เป็น user

## สิทธิ์
| | user | admin |
|---|---|---|
| ดู / ค้นหา / เพิ่มรายการ | ✅ | ✅ |
| แก้ไข / ลบ / เปลี่ยนสถานะ | ❌ | ✅ |
| หน้า /admin และ /items/:id/edit | ❌ (Route Guard เด้งกลับ) | ✅ |

## เรื่อง API (ขั้นตอนละเอียดดูด้านล่าง)
ค่าเริ่มต้น `src/api/http.js` ใช้ Mock REST API จำลองใน localStorage (รันได้ทันที) แต่ข้อมูลอยู่ในเบราว์เซอร์ของแต่ละคน
ตอน deploy จริงให้ใช้ API บนอินเทอร์เน็ต:
1. สมัคร https://mockapi.io สร้าง resource `users` (username, password, name, role) และ `items` (type, title, description, location, date, contact, status, ownerId, ownerName, createdAt)
2. เพิ่ม admin 1 แถว: `{ "username":"admin","password":"admin1234","name":"ผู้ดูแล","role":"admin" }`
3. ใส่ URL ใน `const API_URL = '...'` ใน `src/api/http.js` (โค้ดส่วนอื่นไม่ต้องแก้)

## Deploy ขึ้น Cloud
```bash
npm run build      # ได้โฟลเดอร์ dist/spa
```
- Netlify: ลาก `dist/spa` ไปวางที่ https://app.netlify.com/drop
- Vercel: `npx vercel dist/spa --prod`
- Firebase Hosting: `firebase init hosting` (public = dist/spa, single-page = yes) แล้ว `firebase deploy`

> รหัสผ่านใน Mock API เป็น plain text เหมาะกับงานเรียนเท่านั้น
