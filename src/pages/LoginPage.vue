<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card style="width: 360px" class="q-pa-md">
          <q-card-section>
            <div class="text-h6">เข้าสู่ระบบ</div>
            <div class="text-caption text-grey-7">เว็บหาของหายในมหาวิทยาลัย</div>
          </q-card-section>

          <q-form @submit="onSubmit">
            <q-card-section class="q-gutter-md">
              <q-input v-model="username" label="ชื่อผู้ใช้" outlined :rules="[v => !!v || 'กรุณากรอกชื่อผู้ใช้']" />
              <q-input v-model="password" type="password" label="รหัสผ่าน" outlined :rules="[v => !!v || 'กรุณากรอกรหัสผ่าน']" />
            </q-card-section>
            <q-card-actions vertical>
              <q-btn type="submit" color="primary" label="เข้าสู่ระบบ" :loading="loading" />
              <q-btn flat no-caps label="ยังไม่มีบัญชี? สมัครสมาชิก" :to="{ name: 'register' }" />
            </q-card-actions>
          </q-form>

          <q-separator class="q-my-md" />
          <q-card-section class="q-pt-none">
            <div class="text-subtitle2 q-mb-sm">บัญชีทดลอง (กดเพื่อกรอกให้อัตโนมัติ)</div>
            <q-list bordered separator dense>
              <q-item v-for="a in demoAccounts" :key="a.username" clickable v-ripple @click="fill(a)">
                <q-item-section avatar>
                  <q-icon :name="a.role === 'admin' ? 'admin_panel_settings' : 'person'" :color="a.role === 'admin' ? 'primary' : 'grey-7'" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ a.role }}: {{ a.username }} / {{ a.password }}</q-item-label>
                  <q-item-label caption>{{ a.desc }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'

const $q = useQuasar()
const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)

const demoAccounts = [
  { role: 'admin', username: 'admin', password: 'admin1234', desc: 'แก้ไข ลบ และจัดการได้ทั้งหมด' },
  { role: 'user', username: 'user1', password: 'user1234', desc: 'ดูและเพิ่มรายการได้ แต่แก้ไข/ลบไม่ได้' }
]

function fill (a) {
  username.value = a.username
  password.value = a.password
}

async function onSubmit () {
  loading.value = true
  try {
    await auth.login(username.value, password.value)
    router.push({ name: 'items' })
  } catch (e) {
    $q.notify({ type: 'negative', message: e.message })
  } finally {
    loading.value = false
  }
}
</script>
