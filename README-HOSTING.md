# Flinter & Josua — Panduan Hosting Mandiri

Project ini memigrasikan halaman romantis Beranda, Alasan, Kenangan, Galeri, dan Surat ke React, lalu menambahkan layar pemilihan identitas, chat dua arah tersimpan, polling otomatis, serta studio unggah media.

## Kebutuhan

Gunakan Node.js 20 atau lebih baru, pnpm 10 atau lebih baru, dan database MySQL atau TiDB. Database harus menyediakan connection string melalui environment variable `DATABASE_URL`. Untuk penyimpanan file, project ini memakai `server/storageAdapter.ts`. Jika `S3_BUCKET`, `S3_ACCESS_KEY_ID`, dan `S3_SECRET_ACCESS_KEY` tersedia, adapter mengunggah ke storage S3-compatible; jika tidak, adapter memakai storage bawaan Manus. Pada hosting mandiri, set environment berikut:

```bash
S3_BUCKET="nama-bucket"
S3_REGION="us-east-1"
S3_ENDPOINT="https://s3.example.com"       # opsional untuk AWS, wajib untuk sebagian provider
S3_ACCESS_KEY_ID="..."
S3_SECRET_ACCESS_KEY="..."
S3_FORCE_PATH_STYLE="false"
PUBLIC_STORAGE_URL="https://cdn.example.com" # URL publik bucket/CDN tanpa slash akhir
```

Bucket atau CDN harus dapat menyajikan object secara publik melalui `PUBLIC_STORAGE_URL`, atau Anda perlu menambahkan route signed URL sesuai provider. Jangan menaruh kredensial ini di frontend.

## Instalasi lokal

```bash
pnpm install
export DATABASE_URL="mysql://user:password@host:3306/database"
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
pnpm check
pnpm test
pnpm build
pnpm start
```

Server membaca port dari environment runtime yang disediakan platform. Jangan mengunci port secara manual pada konfigurasi deployment.

## Model identitas

Tabel `identityProfiles` menyimpan dua identitas aplikasi yang tersedia, yaitu `Flinter` dengan avatar awal `F` dan `Josua` dengan avatar awal `J`. Kolom `displayName` dan `subtitle` dipakai sebagai label tampilan, sedangkan nilai identitas yang sama digunakan sebagai enum pengirim pada `chatMessages` dan `uploadedBy` pada `mediaItems`. Data awal dibuat melalui migrasi SQL project. Jika ingin mengubah subtitle atau inisial avatar, jalankan query `UPDATE identityProfiles SET subtitle = '...', avatarInitial = 'F' WHERE identity = 'Flinter';` pada database Anda, lalu sesuaikan metadata visual frontend bila diperlukan. Jangan menambah nilai identitas baru tanpa memperbarui enum pada schema dan migrasi.

## Alur penggunaan

Saat pertama kali membuka web, pengguna memilih **Flinter** atau **Josua**. Pilihan tersebut disimpan pada browser dan digunakan sebagai nama, avatar, serta nilai `sender` pada pesan. Tombol keluar menghapus identitas lokal sehingga pengguna dapat memilih identitas lain pada perangkat yang sama.

Halaman **Chat Kita** mengambil 200 pesan terakhir dari backend dan melakukan pembaruan otomatis setiap tiga detik ketika halaman chat sedang dibuka. Halaman **Kelola** menerima gambar, video, dan audio hingga 25 MB per file, menyimpan bytes pada storage, serta menyimpan URL, kategori, caption, MIME type, dan identitas pengunggah pada database.

## Catatan keamanan

Pemilihan identitas pada versi ini adalah mekanisme identitas aplikasi, bukan autentikasi akun dengan password. Untuk penggunaan yang benar-benar privat di internet publik, tambahkan access code atau aktifkan autentikasi akun pada reverse proxy sebelum membuka URL ke umum. Jangan memasukkan file `.env`, password database, atau API key ke repository.

## Aset dari HTML asli

File HTML yang diterima merujuk pada file gambar dan video lokal seperti `IMG-20251216-WA0016.jpg` dan `VID-20260111-WA0021.mp4`, tetapi aset-aset tersebut belum ikut diunggah. Unggah ulang aset asli melalui **Kelola** agar tampil pada Galeri atau Kenangan. Dengan begitu, file besar tidak perlu dimasukkan ke folder build frontend.
