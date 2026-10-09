// ============================================================
// Model: Pengguna
// Atribut: idPengguna, nama, username, password, role, status
// ============================================================

const { pool } = require('../config/database');

// Pengguna.login() -> login()
// Memeriksa kredensial pengguna. Mengembalikan data pengguna
// (tanpa kolom password) bila cocok, atau null bila gagal.
async function login(username, password) {
  const sql = `
    SELECT id_pengguna, nama, username, role, status
    FROM pengguna
    WHERE username = ? AND password = ?
    LIMIT 1`;
  const [baris] = await pool.execute(sql, [username, password]);
  return baris[0] || null;
}

// Pengguna.logout() -> logout()
// Pada skeleton ini logout hanya menandai status sesi pengguna.
async function logout(idPengguna) {
  const sql = 'UPDATE pengguna SET status = ? WHERE id_pengguna = ?';
  const [hasil] = await pool.execute(sql, ['nonaktif', idPengguna]);
  return hasil.affectedRows;
}

// Pengguna.ubahData() -> ubahData()
// Mengubah sebagian kolom pengguna secara dinamis.
async function ubahData(idPengguna, data) {
  const kolomDiizinkan = ['nama', 'username', 'password', 'role', 'status'];
  const set = [];
  const nilai = [];

  for (const kolom of kolomDiizinkan) {
    if (data[kolom] !== undefined) {
      set.push(`${kolom} = ?`);
      nilai.push(data[kolom]);
    }
  }

  if (set.length === 0) return 0;

  nilai.push(idPengguna);
  const sql = `UPDATE pengguna SET ${set.join(', ')} WHERE id_pengguna = ?`;
  const [hasil] = await pool.execute(sql, nilai);
  return hasil.affectedRows;
}

module.exports = { login, logout, ubahData };
