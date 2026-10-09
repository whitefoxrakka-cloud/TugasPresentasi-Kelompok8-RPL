// ============================================================
// Model: TiketServis
// Atribut: nomorTiket, tanggalMasuk, keluhan, status, tanggalSelesai
// ============================================================

const { pool } = require('../config/database');

// TiketServis.buatTiket() -> buatTiket()
async function buatTiket(data) {
  const {
    nomor_tiket,
    keluhan,
    id_pelanggan,
    id_perangkat,
    id_cabang,
    id_teknisi
  } = data;

  const sql = `
    INSERT INTO tiket_servis
      (nomor_tiket, keluhan, status, id_pelanggan, id_perangkat, id_cabang, id_teknisi)
    VALUES (?, ?, 'baru', ?, ?, ?, ?)`;
  const [hasil] = await pool.execute(sql, [
    nomor_tiket,
    keluhan,
    id_pelanggan,
    id_perangkat,
    id_cabang,
    id_teknisi || null
  ]);
  return hasil.insertId;
}

// TiketServis.ubahStatus() -> ubahStatus()
async function ubahStatus(nomorTiket, status) {
  const sql = 'UPDATE tiket_servis SET status = ? WHERE nomor_tiket = ?';
  const [hasil] = await pool.execute(sql, [status, nomorTiket]);
  return hasil.affectedRows;
}

// TiketServis.lihatStatus() -> lihatStatus()
async function lihatStatus(nomorTiket) {
  const sql = 'SELECT nomor_tiket, status, tanggal_masuk, tanggal_selesai FROM tiket_servis WHERE nomor_tiket = ? LIMIT 1';
  const [baris] = await pool.execute(sql, [nomorTiket]);
  return baris[0] || null;
}

// TiketServis.tutupTiket() -> tutupTiket()
async function tutupTiket(nomorTiket, tanggalSelesai) {
  const sql = `
    UPDATE tiket_servis
    SET status = 'selesai', tanggal_selesai = ?
    WHERE nomor_tiket = ?`;
  const [hasil] = await pool.execute(sql, [tanggalSelesai, nomorTiket]);
  return hasil.affectedRows;
}

// TiketServis.simpanHasilDiagnosis() (langkah UC-03: simpan hasil diagnosis)
async function simpanHasilDiagnosis(nomorTiket, hasilDiagnosis) {
  const sql = `
    UPDATE tiket_servis
    SET hasil_diagnosis = ?, status = 'didiagnosis'
    WHERE nomor_tiket = ?`;
  const [hasil] = await pool.execute(sql, [hasilDiagnosis, nomorTiket]);
  return hasil.affectedRows;
}

// Fungsi bantu untuk UC-03: daftar tugas milik seorang teknisi.
async function ambilTugasTeknisi(idTeknisi) {
  const sql = `
    SELECT t.nomor_tiket, t.tanggal_masuk, t.status, t.keluhan,
           p.nama AS nama_pelanggan, pl.jenis, pl.merek, pl.model
    FROM tiket_servis t
    JOIN pelanggan p ON p.id_pelanggan = t.id_pelanggan
    JOIN perangkat pl ON pl.id_perangkat = t.id_perangkat
    WHERE t.id_teknisi = ?
    ORDER BY t.tanggal_masuk ASC`;
  const [baris] = await pool.execute(sql, [idTeknisi]);
  return baris;
}

// Fungsi bantu untuk UC-03: detail lengkap sebuah tiket.
async function cariByNomor(nomorTiket) {
  const sql = `
    SELECT t.nomor_tiket, t.tanggal_masuk, t.keluhan, t.hasil_diagnosis,
           t.status, t.tanggal_selesai,
           p.nama AS nama_pelanggan, p.no_telepon, p.email,
           pl.jenis, pl.merek, pl.model, pl.nomor_seri, pl.kondisi_fisik,
           c.nama_cabang, k.nama AS nama_teknisi
    FROM tiket_servis t
    JOIN pelanggan p ON p.id_pelanggan = t.id_pelanggan
    JOIN perangkat pl ON pl.id_perangkat = t.id_perangkat
    JOIN cabang c ON c.id_cabang = t.id_cabang
    LEFT JOIN teknisi k ON k.id_teknisi = t.id_teknisi
    WHERE t.nomor_tiket = ?
    LIMIT 1`;
  const [baris] = await pool.execute(sql, [nomorTiket]);
  return baris[0] || null;
}

module.exports = {
  buatTiket,
  ubahStatus,
  lihatStatus,
  tutupTiket,
  simpanHasilDiagnosis,
  ambilTugasTeknisi,
  cariByNomor
};
