// ============================================================
// Model: SukuCadang
// Atribut: idSukuCadang, nama, jenis, harga, stokMinimum
// ============================================================

const { pool } = require('../config/database');

// SukuCadang.tambahStok() -> tambahStok()
// Menambah stok suku cadang pada sebuah cabang.
async function tambahStok(idSukuCadang, idCabang, jumlah) {
  const sql = `
    UPDATE stok
    SET jumlah = jumlah + ?, tanggal_update = NOW()
    WHERE id_suku_cadang = ? AND id_cabang = ?`;
  const [hasil] = await pool.execute(sql, [jumlah, idSukuCadang, idCabang]);
  return hasil.affectedRows;
}

// SukuCadang.kurangiStok() -> kurangiStok()
async function kurangiStok(idSukuCadang, idCabang, jumlah) {
  const sql = `
    UPDATE stok
    SET jumlah = GREATEST(jumlah - ?, 0), tanggal_update = NOW()
    WHERE id_suku_cadang = ? AND id_cabang = ?`;
  const [hasil] = await pool.execute(sql, [jumlah, idSukuCadang, idCabang]);
  return hasil.affectedRows;
}

// SukuCadang.cekStokMinimum() -> cekStokMinimum()
// Mengembalikan true bila jumlah stok <= stok minimum.
async function cekStokMinimum(idSukuCadang, idCabang) {
  const sql = `
    SELECT s.id_stok, s.jumlah, s.stok_minimum, sc.nama
    FROM stok s
    JOIN suku_cadang sc ON sc.id_suku_cadang = s.id_suku_cadang
    WHERE s.id_suku_cadang = ? AND s.id_cabang = ?
    LIMIT 1`;
  const [baris] = await pool.execute(sql, [idSukuCadang, idCabang]);
  const data = baris[0];
  if (!data) return { ada: false, diBawahMinimum: false, data: null };
  return {
    ada: true,
    diBawahMinimum: data.jumlah <= data.stok_minimum,
    data
  };
}

// Fungsi bantu: daftar seluruh suku cadang.
async function ambilSemua() {
  const sql = 'SELECT * FROM suku_cadang ORDER BY nama';
  const [baris] = await pool.execute(sql);
  return baris;
}

// Fungsi bantu: mengambil satu suku cadang untuk perhitungan estimasi.
async function cariById(idSukuCadang) {
  const sql = 'SELECT * FROM suku_cadang WHERE id_suku_cadang = ? LIMIT 1';
  const [baris] = await pool.execute(sql, [idSukuCadang]);
  return baris[0] || null;
}

module.exports = {
  tambahStok,
  kurangiStok,
  cekStokMinimum,
  ambilSemua,
  cariById
};
