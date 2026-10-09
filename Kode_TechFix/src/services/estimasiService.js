// ============================================================
// Service: estimasiService
// Logika bisnis UC-03 "Mendiagnosis dan Menyusun Estimasi".
//
// Keterkaitan requirement:
//   FR03  - diagnosis & penyusunan estimasi
//   FR05  - pengecekan stok suku cadang
//   NFR-01/NFR-02 - perhitungan cepat & responsif
//   NFR-07/NFR-09 - notifikasi asynchronous
// ============================================================

const estimasiModel = require('../models/estimasi.model');
const sukuCadangModel = require('../models/sukuCadang.model');

// Tarif jasa resmi (rupiah). Pada implementasi penuh nilai ini dapat
// diambil dari tabel tarif atau konfigurasi per cabang.
const TARIF_JASA_RESMI = 100000;

// Estimasi.hitungTotal() -> hitungEstimasi()
// Langkah 5 UC-03: total = biayaJasa + biayaSparepart.
function hitungEstimasi(biayaJasa, biayaSparepart) {
  return estimasiModel.hitungTotalEstimasi(biayaJasa, biayaSparepart);
}

// susunEstimasi()
// Langkah 4-5 UC-03:
//   1. ambil tarif resmi (dataTarifDanStok)
//   2. hitung biaya sparepart dari daftar suku cadang
//   3. cek stok & kumpulkan peringatan stok minimum (FR05)
// Mengembalikan objek estimasi yang siap disimpan oleh controller.
async function susunEstimasi(nomorTiket, idTeknisi, daftarSukuCadang = [], idCabang = 1) {
  const rincianSukuCadang = [];
  const peringatanStok = [];
  let biayaSparepart = 0;

  for (const item of daftarSukuCadang) {
    const sukuCadang = await sukuCadangModel.cariById(item.idSukuCadang);

    if (!sukuCadang) {
      peringatanStok.push(`Suku cadang id ${item.idSukuCadang} tidak ditemukan.`);
      continue;
    }

    const jumlah = Number(item.jumlah) || 1;
    const subtotal = Number(sukuCadang.harga) * jumlah;
    biayaSparepart += subtotal;

    rincianSukuCadang.push({
      idSukuCadang: sukuCadang.id_suku_cadang,
      nama: sukuCadang.nama,
      hargaSatuan: Number(sukuCadang.harga),
      jumlah,
      subtotal
    });

    // FR05: pastikan stok mencukupi dan tidak di bawah batas minimum.
    const cek = await sukuCadangModel.cekStokMinimum(item.idSukuCadang, idCabang);
    if (!cek.ada) {
      peringatanStok.push(`Stok ${sukuCadang.nama} belum terdaftar di cabang ${idCabang}.`);
    } else if (cek.diBawahMinimum) {
      peringatanStok.push(
        `Stok ${sukuCadang.nama} berada di bawah/<= batas minimum ` +
        `(${cek.data.jumlah} dari minimum ${cek.data.stok_minimum}).`
      );
    }
  }

  const biayaJasa = TARIF_JASA_RESMI;
  const totalBiaya = hitungEstimasi(biayaJasa, biayaSparepart);

  return {
    nomorTiket,
    idTeknisi,
    biayaJasa,
    biayaSparepart,
    totalBiaya,
    estimasiWaktu: '2 hari kerja',
    rincianSukuCadang,
    peringatanStok
  };
}

module.exports = { hitungEstimasi, susunEstimasi, TARIF_JASA_RESMI };
