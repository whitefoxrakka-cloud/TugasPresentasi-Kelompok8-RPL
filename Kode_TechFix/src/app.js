// ============================================================
// app.js - Konfigurasi utama aplikasi Express TechFix.
// ============================================================

require('dotenv').config();

const express = require('express');
const path = require('path');
const routes = require('./routes');

const app = express();

// --- View engine: EJS + folder views ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- Parser body: JSON + urlencoded (form HTML) ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Route "/" sederhana sebagai halaman sambutan ---
app.get('/', (req, res) => {
  res.type('html').send(`
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="utf-8" />
        <title>TechFix API</title>
      </head>
      <body style="font-family: sans-serif; padding: 2rem;">
        <h1>TechFix Service</h1>
        <p>Skeleton sistem manajemen servis gadget (2 cabang di Semarang).</p>
        <ul>
          <li><a href="/api/sukucadang">GET /api/sukucadang</a></li>
          <li><a href="/api/teknisi/1/tugas">GET /api/teknisi/1/tugas</a></li>
          <li><a href="/api/tiket/TFX-2026-0001">GET /api/tiket/TFX-2026-0001</a></li>
          <li><a href="/diagnosis">Halaman contoh diagnosis</a></li>
        </ul>
      </body>
    </html>
  `);
});

// --- Halaman contoh diagnosis & estimasi (murni tampilan Bootstrap 5) ---
app.get('/diagnosis', (req, res) => {
  res.render('diagnosis', {
    nomorTiket: req.query.nomorTiket || 'TFX-2026-0001',
    detailTiket: null,
    daftarSukuCadang: [],
    estimasi: null
  });
});

// --- Mount seluruh endpoint REST pada prefix /api ---
app.use('/api', routes);

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ sukses: false, pesan: 'Endpoint tidak ditemukan' });
});

// --- Error handler terpusat ---
app.use((err, req, res, next) => {
  console.error('[app] Kesalahan:', err.message);
  res.status(500).json({
    sukses: false,
    pesan: 'Terjadi kesalahan pada server',
    detail: err.message
  });
});

module.exports = app;
