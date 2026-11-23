<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card style="width: 360px" class="q-pa-md">
          <q-card-section><div class="text-h6">สมัครสมาชิก</div></q-card-section>

          <q-form @submit="onSubmit">
            <q-card-section class="q-gutter-md">
              <q-input v-model="form.name" label="ชื่อ-นามสกุล" outlined :rules="[v => !!v || 'กรุณากรอกชื่อ']" />
              <q-input v-model="form.username" label="ชื่อผู้ใช้" outlined :rules="[v => !!v || 'กรุณากรอกชื่อผู้ใช้']" />
              <q-input v-model="form.password" type="password" label="รหัสผ่าน (อย่างน้อย 4 ตัว)" outlined
                :rules="[v => (v && v.length >= 4) || 'รหัสผ่านอย่างน้อย 4 ตัว']" />
            </q-card-section>
            <q-card-actions vertical>
              <q-btn type="submit" color="primary" label="สมัครสมาชิก" :loading="loading" />
              <q-btn flat no-caps label="มีบัญชีแล้ว? เข้าสู่ระบบ" :to="{ name: 'login' }" />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'

const $q = useQuasar()
const router = useRouter()
const auth = useAuthStore()

const form = reactive({ name: '', username: '', password: '' })
const loading = ref(false)

async function onSubmit () {
  loading.value = true
  try {
    await auth.register({ ...form })
    $q.notify({ type: 'positive', message: 'สมัครสมาชิกสำเร็จ' })
    router.push({ name: 'items' })
  } catch (e) {
    $q.notify({ type: 'negative', message: e.message })
  } finally {
    loading.value = false
  }
}
</script>
