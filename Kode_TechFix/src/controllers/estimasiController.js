// ============================================================
// Controller: estimasiController
// Mengorkestrasi UC-03 "Mendiagnosis dan Menyusun Estimasi".
// ============================================================

const tiketModel = require('../models/tiketServis.model');
const estimasiModel = require('../models/estimasi.model');
const estimasiService = require('../services/estimasiService');
const notifikasiService = require('../services/notifikasiService');

// POST /api/tiket/:nomorTiket/diagnosis
// UC-03 langkah 3: simpanHasilDiagnosis() -> status "Didiagnosis".
async function simpanDiagnosis(req, res, next) {
  try {
    const { nomorTiket } = req.params;
    const { hasilDiagnosis } = req.body;

    if (!hasilDiagnosis) {
      return res.status(400).json({ sukses: false, pesan: 'Field hasilDiagnosis wajib diisi' });
    }

    const terpengaruh = await tiketModel.simpanHasilDiagnosis(nomorTiket, hasilDiagnosis);
    if (!terpengaruh) {
      return res.status(404).json({ sukses: false, pesan: 'Tiket tidak ditemukan' });
    }

    res.json({
      sukses: true,
      pesan: 'Hasil diagnosis tersimpan',
      data: { nomorTiket, status: 'didiagnosis' }
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/tiket/:nomorTiket/estimasi/kirim
// UC-03 langkah 4-7: ambil tarif & stok -> hitung -> kirim -> notifikasi.
async function kirimEstimasi(req, res, next) {
  try {
    const { nomorTiket } = req.params;
    const { idTeknisi, idCabang, daftarSukuCadang } = req.body;

    // Langkah 4 & 5: ambilTarifDanStok() lalu hitungEstimasi().
    const estimasi = await estimasiService.susunEstimasi(
      nomorTiket,
      idTeknisi || null,
      Array.isArray(daftarSukuCadang) ? daftarSukuCadang : [],
      idCabang || 1
    );

    // Simpan estimasi ke basis data.
    const idEstimasi = await estimasiModel.tambah({
      biaya_jasa: estimasi.biayaJasa,
      biaya_sparepart: estimasi.biayaSparepart,
      total_biaya: estimasi.totalBiaya,
      estimasi_waktu: estimasi.estimasiWaktu,
      nomor_tiket: nomorTiket
    });

    // Langkah 6: ubah status tiket menjadi "Menunggu Persetujuan".
    await tiketModel.ubahStatus(nomorTiket, 'menunggu_persetujuan');

    // Langkah 7: kirim notifikasi ASYNCHRONOUS ke pelanggan (FR09).
    // Tidak di-await agar respons ke teknisi tidak tertahan (NFR-07/NFR-09).
    const tiket = await tiketModel.cariByNomor(nomorTiket);
    const pelanggan = { nama: tiket ? tiket.nama_pelanggan : 'Pelanggan' };
    notifikasiService
      .kirimNotifikasiEstimasi(pelanggan, estimasi)
      .then((hasil) => console.log('[estimasiController] Notifikasi terkirim:', hasil.pesan))
      .catch((errNotif) => console.error('[estimasiController] Gagal kirim notifikasi:', errNotif.message));

    // konfirmasiEstimasiTerkirim()
    res.status(201).json({
      sukses: true,
      pesan: 'Estimasi berhasil disusun dan dikirim',
      data: {
        idEstimasi,
        ...estimasi,
        statusTiket: 'menunggu_persetujuan',
        catatanNotifikasi: 'Notifikasi pelanggan diproses secara asynchronous'
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { simpanDiagnosis, kirimEstimasi };
