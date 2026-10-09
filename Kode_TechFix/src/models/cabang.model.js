// ============================================================
// Model: Cabang
// Atribut: idCabang, namaCabang, alamat, noTelepon
// ============================================================

const { pool } = require('../config/database');

// Cabang.lihatDataServis() -> lihatDataServis()
// Menampilkan seluruh tiket servis pada sebuah cabang.
async function lihatDataServis(idCabang) {
  const sql = `
    SELECT t.nomor_tiket, t.tanggal_masuk, t.status, t.keluhan,
           p.nama AS nama_pelanggan, k.nama AS nama_teknisi
    FROM tiket_servis t
    JOIN pelanggan p ON p.id_pelanggan = t.id_pelanggan
    LEFT JOIN teknisi k ON k.id_teknisi = t.id_teknisi
    WHERE t.id_cabang = ?
    ORDER BY t.tanggal_masuk DESC`;
  const [baris] = await pool.execute(sql, [idCabang]);
  return baris;
}

// Cabang.lihatStok() -> lihatStok()
// Menampilkan stok suku cadang milik sebuah cabang.
async function lihatStok(idCabang) {
  const sql = `
    SELECT s.id_stok, s.jumlah, s.stok_minimum, s.lokasi,
           sc.nama AS nama_suku_cadang, sc.harga
    FROM stok s
    JOIN suku_cadang sc ON sc.id_suku_cadang = s.id_suku_cadang
    WHERE s.id_cabang = ?`;
  const [baris] = await pool.execute(sql, [idCabang]);
  return baris;
}

// Cabang.lihatLaporan() -> lihatLaporan()
// Ringkasan jumlah tiket per status untuk sebuah cabang.
async function lihatLaporan(idCabang) {
  const sql = `
    SELECT status, COUNT(*) AS jumlah
    FROM tiket_servis
    WHERE id_cabang = ?
    GROUP BY status`;
  const [baris] = await pool.execute(sql, [idCabang]);
  return baris;
}

async function ambilSemua() {
  const sql = 'SELECT * FROM cabang ORDER BY nama_cabang';
  const [baris] = await pool.execute(sql);
  return baris;
}

module.exports = { lihatDataServis, lihatStok, lihatLaporan, ambilSemua };
