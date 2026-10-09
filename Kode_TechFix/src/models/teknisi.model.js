// ============================================================
// Model: Teknisi
// Atribut: idTeknisi, nama, spesialisasi, bebanKerja, status
// ============================================================

const { pool } = require('../config/database');

// Teknisi.lihatTugas() -> lihatTugas()
async function lihatTugas(idTeknisi) {
  const sql = `
    SELECT nomor_tiket, tanggal_masuk, keluhan, status
    FROM tiket_servis
    WHERE id_teknisi = ?
    ORDER BY tanggal_masuk ASC`;
  const [baris] = await pool.execute(sql, [idTeknisi]);
  return baris;
}

// Teknisi.diagnosaPerangkat() -> diagnosaPerangkat()
// Menyimpan hasil diagnosis dan mengubah status tiket (UC-03 langkah 3).
async function diagnosaPerangkat(nomorTiket, hasilDiagnosis) {
  const sql = `
    UPDATE tiket_servis
    SET hasil_diagnosis = ?, status = 'didiagnosis'
    WHERE nomor_tiket = ?`;
  const [hasil] = await pool.execute(sql, [hasilDiagnosis, nomorTiket]);
  return hasil.affectedRows;
}

// Teknisi.buatEstimasi() -> buatEstimasi()
// Struktur data estimasi dibuat oleh service, model ini hanya menyimpan.
async function buatEstimasi(dataEstimasi) {
  const {
    biaya_jasa,
    biaya_sparepart,
    total_biaya,
    estimasi_waktu,
    nomor_tiket
  } = dataEstimasi;

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

// Teknisi.ubahStatusServis() -> ubahStatusServis()
async function ubahStatusServis(nomorTiket, status) {
  const sql = 'UPDATE tiket_servis SET status = ? WHERE nomor_tiket = ?';
  const [hasil] = await pool.execute(sql, [status, nomorTiket]);
  return hasil.affectedRows;
}

// Teknisi.catatSukuCadang() -> catatSukuCadang()
// Mengurangi stok suku cadang pada cabang tertentu.
async function catatSukuCadang(idSukuCadang, idCabang, jumlah) {
  const sql = `
    UPDATE stok
    SET jumlah = GREATEST(jumlah - ?, 0), tanggal_update = NOW()
    WHERE id_suku_cadang = ? AND id_cabang = ?`;
  const [hasil] = await pool.execute(sql, [jumlah, idSukuCadang, idCabang]);
  return hasil.affectedRows;
}

async function cariById(idTeknisi) {
  const sql = 'SELECT * FROM teknisi WHERE id_teknisi = ? LIMIT 1';
  const [baris] = await pool.execute(sql, [idTeknisi]);
  return baris[0] || null;
}

module.exports = {
  lihatTugas,
  diagnosaPerangkat,
  buatEstimasi,
  ubahStatusServis,
  catatSukuCadang,
  cariById
};
