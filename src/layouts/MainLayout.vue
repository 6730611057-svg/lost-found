<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="cursor-pointer" @click="$router.push({ name: 'items' })">
          <q-icon name="search" /> เว็บหาของหาย มหาวิทยาลัย
        </q-toolbar-title>

        <q-btn v-if="auth.isAdmin" flat no-caps icon="admin_panel_settings" label="จัดการ (Admin)" :to="{ name: 'admin' }" />
        <q-chip dense color="white" text-color="primary">
          {{ auth.user.name }} ({{ auth.isAdmin ? 'admin' : 'user' }})
        </q-chip>
        <q-btn flat round icon="logout" @click="logout"><q-tooltip>ออกจากระบบ</q-tooltip></q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'

const auth = useAuthStore()
const router = useRouter()

function logout () {
  auth.logout()
  router.push({ name: 'login' })
}
</script>
