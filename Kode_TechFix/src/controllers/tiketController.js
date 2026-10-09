// ============================================================
// Controller: tiketController
// Menangani endpoint terkait TiketServis.
// ============================================================

const tiketModel = require('../models/tiketServis.model');

// GET /api/teknisi/:idTeknisi/tugas  -> bukaDaftarTugas() (UC-03 langkah 1)
async function daftarTugas(req, res, next) {
  try {
    const data = await tiketModel.ambilTugasTeknisi(req.params.idTeknisi);
    res.json({ sukses: true, jumlah: data.length, data });
  } catch (err) {
    next(err);
  }
}

// GET /api/tiket/:nomorTiket  -> tampilkanDetailTiket() (UC-03 langkah 2)
async function detailTiket(req, res, next) {
  try {
    const detail = await tiketModel.cariByNomor(req.params.nomorTiket);
    if (!detail) {
      return res.status(404).json({ sukses: false, pesan: 'Tiket tidak ditemukan' });
    }
    res.json({ sukses: true, data: detail });
  } catch (err) {
    next(err);
  }
}

module.exports = { daftarTugas, detailTiket };
