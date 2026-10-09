// ============================================================
// Model: Pelanggan
// Atribut: idPelanggan, nama, noTelepon, email, alamat
// ============================================================

const { pool } = require('../config/database');

// Pelanggan.lihatStatus() -> lihatStatusTiket()
// Menampilkan status sebuah tiket servis milik pelanggan.
async function lihatStatusTiket(nomorTiket) {
  const sql = `
    SELECT t.nomor_tiket, t.status, t.tanggal_masuk, t.tanggal_selesai, t.keluhan
    FROM tiket_servis t
    WHERE t.nomor_tiket = ?
    LIMIT 1`;
  const [baris] = await pool.execute(sql, [nomorTiket]);
  return baris[0] || null;
}

// Pelanggan.setujuiEstimasi() -> setujuiEstimasi()
async function setujuiEstimasi(idEstimasi) {
  const sql = "UPDATE estimasi SET status_persetujuan = 'disetujui' WHERE id_estimasi = ?";
  const [hasil] = await pool.execute(sql, [idEstimasi]);
  return hasil.affectedRows;
}

// Pelanggan.tolakEstimasi() -> tolakEstimasi()
async function tolakEstimasi(idEstimasi) {
  const sql = "UPDATE estimasi SET status_persetujuan = 'ditolak' WHERE id_estimasi = ?";
  const [hasil] = await pool.execute(sql, [idEstimasi]);
  return hasil.affectedRows;
}

// Pelanggan.lakukanPembayaran() -> lakukanPembayaran()
// Mencatat pembayaran baru untuk sebuah tiket.
async function lakukanPembayaran(dataPembayaran) {
  const { jumlah, metode, nomor_invoice, nomor_tiket } = dataPembayaran;
  const sql = `
    INSERT INTO pembayaran (jumlah, metode, status, nomor_invoice, nomor_tiket)
    VALUES (?, ?, 'menunggu verifikasi', ?, ?)`;
  const [hasil] = await pool.execute(sql, [jumlah, metode, nomor_invoice, nomor_tiket]);
  return hasil.insertId;
}

// Pelanggan.ajukanKlaimGaransi() -> ajukanKlaimGaransi()
async function ajukanKlaimGaransi(idGaransi, keterangan) {
  const sql = `
    UPDATE garansi
    SET status = 'klaim diajukan'
    WHERE id_garansi = ?`;
  const [hasil] = await pool.execute(sql, [idGaransi]);
  return { affectedRows: hasil.affectedRows, keterangan };
}

// Fungsi bantu: mengambil data pelanggan berdasarkan id.
async function cariById(idPelanggan) {
  const sql = 'SELECT * FROM pelanggan WHERE id_pelanggan = ? LIMIT 1';
  const [baris] = await pool.execute(sql, [idPelanggan]);
  return baris[0] || null;
}

module.exports = {
  lihatStatusTiket,
  setujuiEstimasi,
  tolakEstimasi,
  lakukanPembayaran,
  ajukanKlaimGaransi,
  cariById
};
