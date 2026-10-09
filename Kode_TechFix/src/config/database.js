// ============================================================
// Konfigurasi basis data TechFix.
// Membuat satu connection pool mysql2/promise dari variabel
// lingkungan, dipakai bersama oleh seluruh model dan service.
// ============================================================

require('dotenv').config();
const mysql = require('mysql2/promise');

// Pool dibuat sekali saja (singleton) agar koneksi tidak dibuka
// berulang-ulang pada setiap query.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'techfix',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true
});

module.exports = { pool };
