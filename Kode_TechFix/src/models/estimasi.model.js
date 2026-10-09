// ============================================================
// Model: Estimasi
// Atribut: idEstimasi, biayaJasa, biayaSparepart, totalBiaya,
//          estimasiWaktu, statusPersetujuan
// ============================================================

const { pool } = require('../config/database');

// Estimasi.hitungTotal() -> hitungTotalEstimasi()
// Fungsi murni: menjumlahkan biaya jasa dan biaya sparepart.
function hitungTotalEstimasi(biayaJasa, biayaSparepart) {
  const jasa = Number(biayaJasa) || 0;
  const sparepart = Number(biayaSparepart) || 0;
  return jasa + sparepart;
}

// Menyimpan estimasi baru untuk sebuah tiket.
async function tambah(data) {
  const {
    biaya_jasa,
    biaya_sparepart,
    total_biaya,
    estimasi_waktu,
    nomor_tiket
  } = data;

  const sql = `
    INSERT INTO estimasi
      (biaya_jasa, biaya_sparepart, total_biaya, estimasi_waktu, status_persetujuan, nomor_tiket)
    VALUES (?, ?, ?, ?, 'menunggu', ?)`;
  const [hasil] = await pool.execute(sql, [
    biaya_jasa,
    biaya_sparepart,
    total_biaya,
    estimasi_waktu,
    nomor_tiket
  ]);
  return hasil.insertId;
}

// Estimasi.setujui() -> setujui()
async function setujui(idEstimasi) {
  const sql = "UPDATE estimasi SET status_persetujuan = 'disetujui' WHERE id_estimasi = ?";
  const [hasil] = await pool.execute(sql, [idEstimasi]);
  return hasil.affectedRows;
}

// Estimasi.tolak() -> tolak()
async function tolak(idEstimasi) {
  const sql = "UPDATE estimasi SET status_persetujuan = 'ditolak' WHERE id_estimasi = ?";
  const [hasil] = await pool.execute(sql, [idEstimasi]);
  return hasil.affectedRows;
}

// Estimasi.ubahEstimasi() -> ubahEstimasi()
async function ubahEstimasi(idEstimasi, data) {
  const kolomDiizinkan = ['biaya_jasa', 'biaya_sparepart', 'total_biaya', 'estimasi_waktu', 'status_persetujuan'];
  const set = [];
  const nilai = [];

  for (const kolom of kolomDiizinkan) {
    if (data[kolom] !== undefined) {
      set.push(`${kolom} = ?`);
      nilai.push(data[kolom]);
    }
  }

  if (set.length === 0) return 0;

  nilai.push(idEstimasi);
  const sql = `UPDATE estimasi SET ${set.join(', ')} WHERE id_estimasi = ?`;
  const [hasil] = await pool.execute(sql, nilai);
  return hasil.affectedRows;
}

// Fungsi bantu: mengambil estimasi terbaru milik sebuah tiket.
async function cariByTiket(nomorTiket) {
  const sql = `
    SELECT * FROM estimasi
    WHERE nomor_tiket = ?
    ORDER BY id_estimasi DESC
    LIMIT 1`;
  const [baris] = await pool.execute(sql, [nomorTiket]);
  return baris[0] || null;
}

module.exports = {
  hitungTotalEstimasi,
  tambah,
  setujui,
  tolak,
  ubahEstimasi,
  cariByTiket
};
