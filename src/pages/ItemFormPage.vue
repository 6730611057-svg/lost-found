<template>
  <q-page padding class="flex flex-center">
    <q-card style="width: 520px; max-width: 100%" class="q-pa-md">
      <q-card-section>
        <div class="text-h6">{{ isEdit ? 'แก้ไขรายการ (Admin)' : 'แจ้งของหาย / แจ้งพบของ' }}</div>
      </q-card-section>

      <q-form @submit="onSubmit">
        <q-card-section class="q-gutter-md">
          <q-option-group v-model="form.type" inline :options="[
            { label: 'ของหาย', value: 'lost' },
            { label: 'พบของ', value: 'found' }
          ]" />
          <q-input v-model="form.title" outlined label="ชื่อสิ่งของ" :rules="[v => !!v || 'กรุณากรอก']" />
          <q-input v-model="form.description" outlined type="textarea" label="รายละเอียด (สี ยี่ห้อ ตำหนิ)" :rules="[v => !!v || 'กรุณากรอก']" />
          <q-input v-model="form.location" outlined label="สถานที่ (เช่น อาคาร 5 โรงอาหาร)" :rules="[v => !!v || 'กรุณากรอก']" />
          <q-input v-model="form.date" outlined type="date" label="วันที่" :rules="[v => !!v || 'กรุณาเลือกวันที่']" />
          <q-input v-model="form.contact" outlined label="ช่องทางติดต่อ (เบอร์ / LINE)" :rules="[v => !!v || 'กรุณากรอก']" />
          <q-select v-if="isEdit" v-model="form.status" outlined emit-value map-options label="สถานะ"
            :options="[{ label: 'ยังหาอยู่', value: 'open' }, { label: 'ติดตามเจอแล้ว', value: 'resolved' }]" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="ยกเลิก" :to="{ name: 'items' }" />
          <q-btn type="submit" color="primary" label="บันทึก" :loading="loading" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useItemsStore } from 'src/stores/items'
import { useAuthStore } from 'src/stores/auth'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const store = useItemsStore()
const auth = useAuthStore()

const isEdit = computed(() => route.name === 'item-edit')
const loading = ref(false)

const form = reactive({
  type: 'lost', title: '', description: '', location: '',
  date: new Date().toISOString().slice(0, 10), contact: '', status: 'open'
})

onMounted(async () => {
  if (!isEdit.value) return
  try {
    Object.assign(form, await store.fetchOne(route.params.id))
  } catch {
    $q.notify({ type: 'negative', message: 'ไม่พบรายการ' })
    router.push({ name: 'items' })
  }
})

async function onSubmit () {
  loading.value = true
  try {
    if (isEdit.value) {
      await store.update(route.params.id, { ...form })
    } else {
      await store.create({
        ...form,
        status: 'open',
        ownerId: auth.user.id,
        ownerName: auth.user.name,
        createdAt: Date.now()
      })
    }
    $q.notify({ type: 'positive', message: 'บันทึกสำเร็จ' })
    router.push({ name: 'items' })
  } catch {
    $q.notify({ type: 'negative', message: 'บันทึกไม่สำเร็จ' })
  } finally {
    loading.value = false
  }
}
</script>
