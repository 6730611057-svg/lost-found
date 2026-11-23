<template>
  <q-page padding>
    <div class="row items-center q-col-gutter-sm q-mb-md">
      <div class="col-12 col-md">
        <q-input v-model="search" dense outlined clearable placeholder="ค้นหาชื่อ / สถานที่ / รายละเอียด">
          <template #prepend><q-icon name="search" /></template>
        </q-input>
      </div>
      <div class="col-auto">
        <q-btn-toggle v-model="filter" no-caps unelevated toggle-color="primary" color="white" text-color="primary"
          :options="[
            { label: 'ทั้งหมด', value: 'all' },
            { label: 'ของหาย', value: 'lost' },
            { label: 'ของที่พบ', value: 'found' }
          ]" />
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="add" label="แจ้งใหม่" :to="{ name: 'item-new' }" />
      </div>
    </div>

    <q-inner-loading :showing="store.loading" />

    <div v-if="!store.loading && !filtered.length" class="text-center text-grey-6 q-mt-xl">ไม่พบรายการ</div>

    <div class="row q-col-gutter-md">
      <div v-for="it in filtered" :key="it.id" class="col-12 col-sm-6 col-md-4">
        <q-card :class="{ 'bg-grey-3': it.status === 'resolved' }">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="text-h6 col ellipsis">{{ it.title }}</div>
              <q-badge :color="it.type === 'lost' ? 'negative' : 'positive'" :label="it.type === 'lost' ? 'ของหาย' : 'พบของ'" />
            </div>
            <div class="text-body2 q-mt-sm">{{ it.description }}</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="text-caption text-grey-8">
            <div><q-icon name="place" /> {{ it.location }}</div>
            <div><q-icon name="event" /> {{ it.date }}</div>
            <div><q-icon name="phone" /> {{ it.contact }}</div>
            <div><q-icon name="person" /> โดย {{ it.ownerName }}</div>
            <q-badge v-if="it.status === 'resolved'" color="grey-7" class="q-mt-xs">ติดตามเจอแล้ว</q-badge>
          </q-card-section>

          <!-- เฉพาะ admin ที่แก้ไข/ลบได้ -->
          <q-card-actions v-if="auth.isAdmin" align="right">
            <q-btn flat dense color="primary" icon="edit" :to="{ name: 'item-edit', params: { id: it.id } }" />
            <q-btn flat dense color="negative" icon="delete" @click="confirmDelete(it)" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useItemsStore } from 'src/stores/items'
import { useAuthStore } from 'src/stores/auth'

const $q = useQuasar()
const store = useItemsStore()
const auth = useAuthStore()

const search = ref('')
const filter = ref('all')

const filtered = computed(() => {
  const q = (search.value || '').toLowerCase()
  return store.items.filter(it =>
    (filter.value === 'all' || it.type === filter.value) &&
    [it.title, it.location, it.description].join(' ').toLowerCase().includes(q)
  )
})

onMounted(() => store.fetchAll().catch(() => $q.notify({ type: 'negative', message: 'โหลดข้อมูลไม่สำเร็จ' })))

function confirmDelete (it) {
  $q.dialog({ title: 'ยืนยันการลบ', message: `ลบ "${it.title}" ?`, cancel: true })
    .onOk(async () => {
      await store.remove(it.id)
      $q.notify({ type: 'positive', message: 'ลบแล้ว' })
    })
}
</script>
