// ============================================================
// Model: Pembayaran
// Atribut: idPembayaran, tanggal, jumlah, metode, status, nomorInvoice
// ============================================================

const { pool } = require('../config/database');

// Pembayaran.prosesPembayaran() -> prosesPembayaran()
// Menyimpan pembayaran baru dengan status awal 'menunggu verifikasi'.
async function prosesPembayaran(data) {
  const { jumlah, metode, nomor_invoice, nomor_tiket } = data;
  const sql = `
    INSERT INTO pembayaran (jumlah, metode, status, nomor_invoice, nomor_tiket)
    VALUES (?, ?, 'menunggu verifikasi', ?, ?)`;
  const [hasil] = await pool.execute(sql, [jumlah, metode, nomor_invoice, nomor_tiket]);
  return hasil.insertId;
}

// Pembayaran.verifikasiPembayaran() -> verifikasiPembayaran()
async function verifikasiPembayaran(idPembayaran) {
  const sql = "UPDATE pembayaran SET status = 'terverifikasi' WHERE id_pembayaran = ?";
  const [hasil] = await pool.execute(sql, [idPembayaran]);
  return hasil.affectedRows;
}

// Pembayaran.cetakInvoice() -> cetakInvoice()
// Mengambil data yang diperlukan untuk mencetak invoice.
async function cetakInvoice(idPembayaran) {
  const sql = `
    SELECT pb.id_pembayaran, pb.tanggal, pb.jumlah, pb.metode, pb.status,
           pb.nomor_invoice, pb.nomor_tiket,
           pl.nama AS nama_pelanggan
    FROM pembayaran pb
    JOIN tiket_servis t ON t.nomor_tiket = pb.nomor_tiket
    JOIN pelanggan pl ON pl.id_pelanggan = t.id_pelanggan
    WHERE pb.id_pembayaran = ?
    LIMIT 1`;
  const [baris] = await pool.execute(sql, [idPembayaran]);
  return baris[0] || null;
}

// Pembayaran.simpanBukti() -> simpanBukti()
async function simpanBukti(idPembayaran, berkasBukti) {
  const sql = 'UPDATE pembayaran SET bukti = ? WHERE id_pembayaran = ?';
  const [hasil] = await pool.execute(sql, [berkasBukti, idPembayaran]);
  return hasil.affectedRows;
}

module.exports = {
  prosesPembayaran,
  verifikasiPembayaran,
  cetakInvoice,
  simpanBukti
};
