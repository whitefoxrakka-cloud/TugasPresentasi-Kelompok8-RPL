// ============================================================
// Controller: sukuCadangController
// Menangani endpoint SukuCadang & pengecekan stok minimum (FR05).
// ============================================================

const sukuCadangModel = require('../models/sukuCadang.model');

// GET /api/sukucadang
// Opsional query ?idCabang=1 untuk menyertakan status stok minimum.
async function daftarSukuCadang(req, res, next) {
  try {
    const data = await sukuCadangModel.ambilSemua();
    const idCabang = req.query.idCabang ? Number(req.query.idCabang) : null;

    if (idCabang) {
      for (const item of data) {
        const cek = await sukuCadangModel.cekStokMinimum(item.id_suku_cadang, idCabang);
        item.cek_stok = cek;
      }
    }

    res.json({ sukses: true, jumlah: data.length, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { daftarSukuCadang };
