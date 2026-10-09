// ============================================================
// server.js - Titik masuk aplikasi TechFix.
// Menjalankan HTTP server pada PORT dari .env (default 3000).
// ============================================================

require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`TechFix Service berjalan di http://localhost:${PORT}`);
  console.log(`Basis data: ${process.env.DB_NAME || 'techfix'} @ ${process.env.DB_HOST || 'localhost'}`);
});
