// ============================================================
// Model: Stok
// Atribut: idStok, jumlah, stokMinimum, lokasi, tanggalUpdate
// ============================================================

const { pool } = require('../config/database');

// Stok.barangMasuk() -> barangMasuk()
async function barangMasuk(idStok, jumlah) {
  const sql = `
    UPDATE stok
    SET jumlah = jumlah + ?, tanggal_update = NOW()
    WHERE id_stok = ?`;
  const [hasil] = await pool.execute(sql, [jumlah, idStok]);
  return hasil.affectedRows;
}

// Stok.barangKeluar() -> barangKeluar()
async function barangKeluar(idStok, jumlah) {
  const sql = `
    UPDATE stok
    SET jumlah = GREATEST(jumlah - ?, 0), tanggal_update = NOW()
    WHERE id_stok = ?`;
  const [hasil] = await pool.execute(sql, [jumlah, idStok]);
  return hasil.affectedRows;
}

// Stok.cekStokMinimum() -> cekStokMinimum()
async function cekStokMinimum(idStok) {
  const sql = 'SELECT id_stok, jumlah, stok_minimum FROM stok WHERE id_stok = ? LIMIT 1';
  const [baris] = await pool.execute(sql, [idStok]);
  const data = baris[0];
  if (!data) return { ada: false, diBawahMinimum: false, data: null };
  return {
    ada: true,
    diBawahMinimum: data.jumlah <= data.stok_minimum,
    data
  };
}

// Stok.lihatJumlah() -> lihatJumlah()
async function lihatJumlah(idStok) {
  const sql = 'SELECT jumlah FROM stok WHERE id_stok = ? LIMIT 1';
  const [baris] = await pool.execute(sql, [idStok]);
  return baris[0] ? baris[0].jumlah : null;
}

// Fungsi bantu: mencari baris stok berdasarkan cabang & suku cadang.
async function cariByCabangDanSukuCadang(idCabang, idSukuCadang) {
  const sql = `
    SELECT * FROM stok
    WHERE id_cabang = ? AND id_suku_cadang = ?
    LIMIT 1`;
  const [baris] = await pool.execute(sql, [idCabang, idSukuCadang]);
  return baris[0] || null;
}

module.exports = {
  barangMasuk,
  barangKeluar,
  cekStokMinimum,
  lihatJumlah,
  cariByCabangDanSukuCadang
};
