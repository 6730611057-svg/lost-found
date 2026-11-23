<template>
  <q-page padding>
    <div class="text-h6 q-mb-md">จัดการรายการทั้งหมด (Admin)</div>

    <q-table :rows="store.items" :columns="columns" row-key="id" :loading="store.loading" flat bordered
      :filter="filter" :pagination="{ rowsPerPage: 10 }">
      <template #top-right>
        <q-input v-model="filter" dense outlined placeholder="ค้นหา" clearable>
          <template #append><q-icon name="search" /></template>
        </q-input>
      </template>

      <template #body-cell-type="props">
        <q-td :props="props">
          <q-badge :color="props.value === 'lost' ? 'negative' : 'positive'" :label="props.value === 'lost' ? 'ของหาย' : 'พบของ'" />
        </q-td>
      </template>

      <template #body-cell-status="props">
        <q-td :props="props">
          <q-toggle :model-value="props.row.status === 'resolved'" label="เจอแล้ว" @update:model-value="toggle(props.row, $event)" />
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props" auto-width>
          <q-btn flat dense color="primary" icon="edit" :to="{ name: 'item-edit', params: { id: props.row.id } }" />
          <q-btn flat dense color="negative" icon="delete" @click="confirmDelete(props.row)" />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useItemsStore } from 'src/stores/items'

const $q = useQuasar()
const store = useItemsStore()
const filter = ref('')

const columns = [
  { name: 'type', label: 'ประเภท', field: 'type', align: 'left' },
  { name: 'title', label: 'สิ่งของ', field: 'title', align: 'left', sortable: true },
  { name: 'location', label: 'สถานที่', field: 'location', align: 'left' },
  { name: 'date', label: 'วันที่', field: 'date', align: 'left', sortable: true },
  { name: 'ownerName', label: 'ผู้แจ้ง', field: 'ownerName', align: 'left' },
  { name: 'status', label: 'สถานะ', field: 'status', align: 'left' },
  { name: 'actions', label: '', field: 'id' }
]

onMounted(() => store.fetchAll())

async function toggle (row, val) {
  await store.update(row.id, { ...row, status: val ? 'resolved' : 'open' })
  $q.notify({ type: 'positive', message: 'อัปเดตสถานะแล้ว' })
}

function confirmDelete (row) {
  $q.dialog({ title: 'ยืนยันการลบ', message: `ลบ "${row.title}" ?`, cancel: true })
    .onOk(async () => {
      await store.remove(row.id)
      $q.notify({ type: 'positive', message: 'ลบแล้ว' })
    })
}
</script>
