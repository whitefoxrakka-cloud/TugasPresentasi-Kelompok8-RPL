// ============================================================
// Routes: index
// Seluruh endpoint REST sederhana TechFix dipasang di sini
// kemudian di-mount oleh app.js pada prefix "/api".
// ============================================================

const express = require('express');
const router = express.Router();

const tiketController = require('../controllers/tiketController');
const estimasiController = require('../controllers/estimasiController');
const sukuCadangController = require('../controllers/sukuCadangController');

// --- TiketServis (UC-03 langkah 1 & 2) ---
router.get('/teknisi/:idTeknisi/tugas', tiketController.daftarTugas);
router.get('/tiket/:nomorTiket', tiketController.detailTiket);

// --- UC-03: Mendiagnosis dan Menyusun Estimasi ---
router.post('/tiket/:nomorTiket/diagnosis', estimasiController.simpanDiagnosis);
router.post('/tiket/:nomorTiket/estimasi/kirim', estimasiController.kirimEstimasi);

// --- SukuCadang (FR05: cek stok) ---
router.get('/sukucadang', sukuCadangController.daftarSukuCadang);

module.exports = router;
