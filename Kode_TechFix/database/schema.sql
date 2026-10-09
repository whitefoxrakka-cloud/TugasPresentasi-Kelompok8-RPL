-- ============================================================
-- TechFix - Skema Basis Data (MySQL 8)
-- Sistem Manajemen Servis Gadget - 2 Cabang di Semarang
-- Skeleton DASAR untuk tugas mata kuliah Rekayasa Perangkat Lunak
-- ============================================================

CREATE DATABASE IF NOT EXISTS techfix
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE techfix;

-- Urutan DROP dibalik agar tidak melanggar foreign key.
DROP TABLE IF EXISTS pesanan_pembelian;
DROP TABLE IF EXISTS garansi;
DROP TABLE IF EXISTS pembayaran;
DROP TABLE IF EXISTS stok;
DROP TABLE IF EXISTS estimasi;
DROP TABLE IF EXISTS tiket_servis;
DROP TABLE IF EXISTS suku_cadang;
DROP TABLE IF EXISTS teknisi;
DROP TABLE IF EXISTS perangkat;
DROP TABLE IF EXISTS pemasok;
DROP TABLE IF EXISTS pelanggan;
DROP TABLE IF EXISTS pengguna;
DROP TABLE IF EXISTS cabang;

-- 1. Cabang (class Cabang)
CREATE TABLE cabang (
  id_cabang    INT AUTO_INCREMENT PRIMARY KEY,
  nama_cabang  VARCHAR(100) NOT NULL,
  alamat       VARCHAR(255) NOT NULL,
  no_telepon   VARCHAR(20)
) ENGINE=InnoDB;

-- 2. Pengguna (class Pengguna)
CREATE TABLE pengguna (
  id_pengguna  INT AUTO_INCREMENT PRIMARY KEY,
  nama         VARCHAR(100) NOT NULL,
  username     VARCHAR(50)  NOT NULL UNIQUE,
  password     VARCHAR(255) NOT NULL,
  role         VARCHAR(30)  NOT NULL,
  status       VARCHAR(20)  NOT NULL DEFAULT 'aktif'
) ENGINE=InnoDB;

-- 3. Pelanggan (class Pelanggan)
CREATE TABLE pelanggan (
  id_pelanggan INT AUTO_INCREMENT PRIMARY KEY,
  nama         VARCHAR(100) NOT NULL,
  no_telepon   VARCHAR(20),
  email        VARCHAR(100),
  alamat       VARCHAR(255)
) ENGINE=InnoDB;

-- 4. Pemasok (class Pemasok)
CREATE TABLE pemasok (
  id_pemasok  INT AUTO_INCREMENT PRIMARY KEY,
  nama        VARCHAR(100) NOT NULL,
  no_telepon  VARCHAR(20),
  email       VARCHAR(100),
  alamat      VARCHAR(255)
) ENGINE=InnoDB;

-- 5. Perangkat (class Perangkat) - milik seorang pelanggan
CREATE TABLE perangkat (
  id_perangkat  INT AUTO_INCREMENT PRIMARY KEY,
  jenis         VARCHAR(50)  NOT NULL,
  merek         VARCHAR(50),
  model         VARCHAR(50),
  nomor_seri    VARCHAR(50) UNIQUE,
  kondisi_fisik TEXT,
  id_pelanggan  INT NOT NULL,
  CONSTRAINT fk_perangkat_pelanggan
    FOREIGN KEY (id_pelanggan) REFERENCES pelanggan (id_pelanggan)
) ENGINE=InnoDB;

-- 6. Teknisi (class Teknisi) - terdaftar di sebuah cabang
CREATE TABLE teknisi (
  id_teknisi    INT AUTO_INCREMENT PRIMARY KEY,
  nama          VARCHAR(100) NOT NULL,
  spesialisasi  VARCHAR(100),
  beban_kerja   INT NOT NULL DEFAULT 0,
  status        VARCHAR(20) NOT NULL DEFAULT 'tersedia',
  id_cabang     INT,
  CONSTRAINT fk_teknisi_cabang
    FOREIGN KEY (id_cabang) REFERENCES cabang (id_cabang)
) ENGINE=InnoDB;

-- 7. SukuCadang (class SukuCadang)
CREATE TABLE suku_cadang (
  id_suku_cadang INT AUTO_INCREMENT PRIMARY KEY,
  nama           VARCHAR(100) NOT NULL,
  jenis          VARCHAR(50),
  harga          DECIMAL(12,2) NOT NULL DEFAULT 0,
  stok_minimum   INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- 8. TiketServis (class TiketServis)
CREATE TABLE tiket_servis (
  nomor_tiket      VARCHAR(20) PRIMARY KEY,
  tanggal_masuk    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  keluhan          TEXT,
  hasil_diagnosis  TEXT,
  status           VARCHAR(30) NOT NULL DEFAULT 'baru',
  tanggal_selesai  DATETIME NULL,
  id_pelanggan     INT NOT NULL,
  id_perangkat     INT NOT NULL,
  id_cabang        INT NOT NULL,
  id_teknisi       INT NULL,
  CONSTRAINT fk_tiket_pelanggan
    FOREIGN KEY (id_pelanggan) REFERENCES pelanggan (id_pelanggan),
  CONSTRAINT fk_tiket_perangkat
    FOREIGN KEY (id_perangkat) REFERENCES perangkat (id_perangkat),
  CONSTRAINT fk_tiket_cabang
    FOREIGN KEY (id_cabang) REFERENCES cabang (id_cabang),
  CONSTRAINT fk_tiket_teknisi
    FOREIGN KEY (id_teknisi) REFERENCES teknisi (id_teknisi)
) ENGINE=InnoDB;

-- 9. Estimasi (class Estimasi) - milik sebuah tiket
CREATE TABLE estimasi (
  id_estimasi        INT AUTO_INCREMENT PRIMARY KEY,
  biaya_jasa         DECIMAL(12,2) NOT NULL DEFAULT 0,
  biaya_sparepart    DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_biaya        DECIMAL(12,2) NOT NULL DEFAULT 0,
  estimasi_waktu     VARCHAR(50),
  status_persetujuan VARCHAR(30) NOT NULL DEFAULT 'menunggu',
  nomor_tiket        VARCHAR(20) NOT NULL,
  CONSTRAINT fk_estimasi_tiket
    FOREIGN KEY (nomor_tiket) REFERENCES tiket_servis (nomor_tiket)
) ENGINE=InnoDB;

-- 10. Stok (class Stok) - persediaan per cabang & suku cadang
CREATE TABLE stok (
  id_stok        INT AUTO_INCREMENT PRIMARY KEY,
  jumlah         INT NOT NULL DEFAULT 0,
  stok_minimum   INT NOT NULL DEFAULT 0,
  lokasi         VARCHAR(100),
  tanggal_update DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_cabang      INT NOT NULL,
  id_suku_cadang INT NOT NULL,
  CONSTRAINT fk_stok_cabang
    FOREIGN KEY (id_cabang) REFERENCES cabang (id_cabang),
  CONSTRAINT fk_stok_suku_cadang
    FOREIGN KEY (id_suku_cadang) REFERENCES suku_cadang (id_suku_cadang)
) ENGINE=InnoDB;

-- 11. Pembayaran (class Pembayaran)
CREATE TABLE pembayaran (
  id_pembayaran  INT AUTO_INCREMENT PRIMARY KEY,
  tanggal        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  jumlah         DECIMAL(12,2) NOT NULL DEFAULT 0,
  metode         VARCHAR(30),
  status         VARCHAR(20) NOT NULL DEFAULT 'belum dibayar',
  nomor_invoice  VARCHAR(30) UNIQUE,
  bukti          VARCHAR(255),
  nomor_tiket    VARCHAR(20) NOT NULL,
  CONSTRAINT fk_pembayaran_tiket
    FOREIGN KEY (nomor_tiket) REFERENCES tiket_servis (nomor_tiket)
) ENGINE=InnoDB;

-- 12. Garansi (class Garansi)
CREATE TABLE garansi (
  id_garansi     INT AUTO_INCREMENT PRIMARY KEY,
  tanggal_mulai  DATE NOT NULL,
  tanggal_berakhir DATE,
  durasi         INT COMMENT 'Durasi garansi dalam bulan',
  status         VARCHAR(20) NOT NULL DEFAULT 'aktif',
  id_perangkat   INT NOT NULL,
  nomor_tiket    VARCHAR(20),
  CONSTRAINT fk_garansi_perangkat
    FOREIGN KEY (id_perangkat) REFERENCES perangkat (id_perangkat),
  CONSTRAINT fk_garansi_tiket
    FOREIGN KEY (nomor_tiket) REFERENCES tiket_servis (nomor_tiket)
) ENGINE=InnoDB;

-- 13. PesananPembelian (class PesananPembelian)
CREATE TABLE pesanan_pembelian (
  id_pesanan     INT AUTO_INCREMENT PRIMARY KEY,
  tanggal_pesanan DATE NOT NULL,
  status         VARCHAR(20) NOT NULL DEFAULT 'draft',
  total          DECIMAL(12,2) NOT NULL DEFAULT 0,
  id_pemasok     INT NOT NULL,
  CONSTRAINT fk_pesanan_pemasok
    FOREIGN KEY (id_pemasok) REFERENCES pemasok (id_pemasok)
) ENGINE=InnoDB;

-- ============================================================
-- Data contoh (2 cabang, 2 teknisi, 1 pelanggan, 3 suku cadang,
-- 1 tiket, 1 estimasi)
-- ============================================================

INSERT INTO cabang (nama_cabang, alamat, no_telepon) VALUES
  ('TechFix Semarang Pusat', 'Jl. Pemuda No. 10, Semarang', '024-111111'),
  ('TechFix Semarang Barat', 'Jl. Sultan Agung No. 25, Semarang', '024-222222');

INSERT INTO pengguna (nama, username, password, role, status) VALUES
  ('Admin TechFix', 'admin', 'admin123', 'admin', 'aktif'),
  ('Budi Teknisi', 'budi', 'teknisi123', 'teknisi', 'aktif');

INSERT INTO pelanggan (nama, no_telepon, email, alamat) VALUES
  ('Andi Pratama', '0812-3456-7890', 'andi@example.com', 'Jl. Pandanaran No. 5, Semarang');

INSERT INTO pemasok (nama, no_telepon, email, alamat) VALUES
  ('PT Sparepart Nusantara', '024-333333', 'sales@sparepart-nusantara.co.id', 'Kawasan Industri Candi, Semarang');

INSERT INTO perangkat (jenis, merek, model, nomor_seri, kondisi_fisik, id_pelanggan) VALUES
  ('Smartphone', 'Samsung', 'Galaxy A54', 'SN-A54-0001', 'Layar retak, bodi lecet', 1);

INSERT INTO teknisi (nama, spesialisasi, beban_kerja, status, id_cabang) VALUES
  ('Budi Santoso', 'Hardware Smartphone', 2, 'tersedia', 1),
  ('Rina Wulandari', 'Software & Motherboard', 1, 'sibuk', 2);

INSERT INTO suku_cadang (nama, jenis, harga, stok_minimum) VALUES
  ('LCD Samsung Galaxy A54', 'Layar', 750000.00, 3),
  ('Baterai Universal 4000mAh', 'Baterai', 120000.00, 5),
  ('Konektor Charger Type-C', 'Konektor', 45000.00, 4);

INSERT INTO stok (jumlah, stok_minimum, lokasi, id_cabang, id_suku_cadang) VALUES
  (5, 3, 'Rak A-1', 1, 1),
  (2, 5, 'Rak B-2', 1, 2),
  (10, 4, 'Rak C-1', 2, 3);

INSERT INTO tiket_servis
  (nomor_tiket, tanggal_masuk, keluhan, hasil_diagnosis, status, id_pelanggan, id_perangkat, id_cabang, id_teknisi)
VALUES
  ('TFX-2026-0001', '2026-10-01 09:30:00', 'Layar tidak menyala setelah terjatuh', 'LCD rusak, perlu penggantian', 'didiagnosis', 1, 1, 1, 1);

INSERT INTO estimasi
  (biaya_jasa, biaya_sparepart, total_biaya, estimasi_waktu, status_persetujuan, nomor_tiket)
VALUES
  (100000.00, 750000.00, 850000.00, '2 hari kerja', 'menunggu', 'TFX-2026-0001');

INSERT INTO garansi
  (tanggal_mulai, tanggal_berakhir, durasi, status, id_perangkat, nomor_tiket)
VALUES
  ('2026-10-03', '2027-04-03', 6, 'aktif', 1, 'TFX-2026-0001');
