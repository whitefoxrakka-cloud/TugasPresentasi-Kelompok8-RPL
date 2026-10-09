// ============================================================
// Model: Perangkat
// Atribut: idPerangkat, jenis, merek, model, nomorSeri, kondisiFisik
// ============================================================

const { pool } = require('../config/database');

// Perangkat.catatKondisi() -> catatKondisi()
async function catatKondisi(idPerangkat, kondisiFisik) {
  const sql = 'UPDATE perangkat SET kondisi_fisik = ? WHERE id_perangkat = ?';
  const [hasil] = await pool.execute(sql, [kondisiFisik, idPerangkat]);
  return hasil.affectedRows;
}

// Perangkat.lihatRiwayatServis() -> lihatRiwayatServis()
async function lihatRiwayatServis(idPerangkat) {
  const sql = `
    SELECT nomor_tiket, tanggal_masuk, tanggal_selesai, keluhan, hasil_diagnosis, status
    FROM tiket_servis
    WHERE id_perangkat = ?
    ORDER BY tanggal_masuk DESC`;
  const [baris] = await pool.execute(sql, [idPerangkat]);
  return baris;
}

// Perangkat.cekGaransi() -> cekGaransi()
// Mengembalikan data garansi terbaru perangkat (bila ada).
async function cekGaransi(idPerangkat) {
  const sql = `
    SELECT id_garansi, tanggal_mulai, tanggal_berakhir, durasi, status
    FROM garansi
    WHERE id_perangkat = ?
    ORDER BY tanggal_berakhir DESC
    LIMIT 1`;
  const [baris] = await pool.execute(sql, [idPerangkat]);
  return baris[0] || null;
}

async function cariById(idPerangkat) {
  const sql = 'SELECT * FROM perangkat WHERE id_perangkat = ? LIMIT 1';
  const [baris] = await pool.execute(sql, [idPerangkat]);
  return baris[0] || null;
}

module.exports = { catatKondisi, lihatRiwayatServis, cekGaransi, cariById };
