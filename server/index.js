/* global process */
import express from 'express'
import cors from 'cors'

const app = express()
const port = process?.env?.PORT || 5000

app.use(cors())
app.use(express.json())

// Sample sales data store
const defaultPharmacySales = [
  { order_id: 'SALES-8839', medicine_name: 'Panadol Advance', date: '2026-05-16T10:00:00Z', quantity: 3, total_price: 45.0, status: 'تم التوصيل' },
  { order_id: 'SALES-8830', medicine_name: 'City Care Pharmacy', date: '2026-05-16T11:00:00Z', quantity: 2, total_price: 15.0, status: 'قيد المعالجة' },
  { order_id: 'SALES-8831', medicine_name: 'Amoxicillin', date: '2026-05-16T12:00:00Z', quantity: 1, total_price: 12.5, status: 'ملغي' },
  { order_id: 'SALES-8832', medicine_name: 'Panadol Inhalter', date: '2026-05-16T13:00:00Z', quantity: 12, total_price: 15.0, status: 'ملغي' },
  { order_id: 'SALES-8833', medicine_name: 'Panadol Advance', date: '2026-05-16T14:00:00Z', quantity: 3, total_price: 45.0, status: 'تم التوصيل' },
  { order_id: 'SALES-8834', medicine_name: 'Ibuprofen', date: '2026-05-16T15:00:00Z', quantity: 2, total_price: 55.0, status: 'قيد المعالجة' },
  { order_id: 'SALES-8835', medicine_name: 'Panadol Advance', date: '2026-05-16T16:00:00Z', quantity: 3, total_price: 45.0, status: 'تم التوصيل' }
]

const sampleSales = {
  'PHARM-1': defaultPharmacySales,
  '5': defaultPharmacySales,
}

const sampleMedications = [
  { medication_id: 101, medication_name: 'Panadol Advance', medication_type: 'مسكن', manufacturer: 'جلاكسو', category: 'أدوية عامة' },
  { medication_id: 102, medication_name: 'Augmentin', medication_type: 'مضاد حيوي', manufacturer: 'GSK', category: 'مضاد حيوي' },
  { medication_id: 103, medication_name: 'Vitamin C', medication_type: 'فيتامينات', manufacturer: 'Sanofi', category: 'فيتامينات' },
  { medication_id: 104, medication_name: 'Amoxicillin', medication_type: 'مضاد حيوي', manufacturer: 'Pfizer', category: 'مضاد حيوي' },
  { medication_id: 105, medication_name: 'Panadol Inhalter', medication_type: 'مسكن', manufacturer: 'Novartis', category: 'أدوية عامة' },
]

app.get('/api/sales/pharmacy/:id', (req, res) => {
  const id = req.params.id
  const data = sampleSales[id] || []
  // simulate small delay
  setTimeout(() => res.json(data), 300)
})

app.get('/sales', (req, res) => {
  const id = req.query.id || req.query.pharmacyId
  const data = sampleSales[id] || []
  setTimeout(() => res.json(data), 300)
})

app.get('/medications', (req, res) => {
  setTimeout(() => res.json(sampleMedications), 300)
})

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`)
})
