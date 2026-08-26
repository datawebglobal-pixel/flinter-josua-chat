# Project TODO

- [x] Migrasikan halaman Beranda dari HTML asli ke React dengan navigasi SPA dan animasi romantis gelap.
- [x] Migrasikan halaman Alasan dari HTML asli dengan tipografi serif dan aksen rose-gold.
- [x] Migrasikan halaman Kenangan dari HTML asli ke timeline responsif.
- [x] Migrasikan halaman Galeri dari HTML asli dengan lightbox, video, dan layout responsif.
- [x] Migrasikan halaman Surat dari HTML asli dengan kartu surat romantis.
- [x] Menambahkan layar masuk awal dengan pilihan identitas Flinter dan Josua.
- [x] Menyimpan identitas aktif secara aman pada sesi/browser dan menggunakannya sebagai nama serta avatar.
- [x] Membuat skema database untuk profil identitas, pesan chat, dan metadata media.
- [x] Membuat prosedur backend untuk membaca riwayat pesan dan mengirim pesan baru.
- [x] Menambahkan pembaruan percakapan otomatis saat halaman chat terbuka.
- [x] Menambahkan tampilan chat privat dua arah dengan pembeda pengirim Flinter/Josua.
- [x] Menambahkan prosedur unggah media ke storage dan penyimpanan metadata.
- [x] Membuat ruang kelola konten untuk gambar, video, audio/lagu, caption, dan kategori halaman.
- [x] Menampilkan konten media dinamis pada Galeri dan Kenangan.
- [x] Menambahkan validasi tipe/ukuran file dan penanganan error unggah.
- [x] Menulis pengujian Vitest untuk identitas, pesan, dan metadata media.
- [x] Menjalankan pemeriksaan TypeScript, test, dan verifikasi tampilan desktop/mobile.
- [x] Menulis README hosting mandiri berisi konfigurasi environment, migrasi database, build, dan start.
- [x] Menyiapkan paket project final untuk diunduh pengguna.

- [x] Tambahkan lightbox/modal preview untuk gambar galeri di React.
- [x] Batasi auto-refresh chat hanya ketika halaman Chat Kita sedang terbuka.
- [x] Tambahkan entitas profil identitas statis yang terdokumentasi untuk Flinter dan Josua.
- [x] Perbaiki pemetaan media kategori kenangan agar dapat ditampilkan pada entri yang relevan.
- [x] Tambahkan kemampuan menghapus media dari ruang kelola.
- [x] Siapkan adapter storage mandiri yang terdokumentasi dengan jelas untuk deployment di luar Manus.
- [x] Verifikasi tampilan pada viewport mobile nyata.
- [x] Dokumentasikan tabel identityProfiles, data Flinter/Josua, dan prosedur pengelolaannya di README hosting.

- [x] Tambahkan badge angka untuk pesan masuk yang belum dibaca pada menu Chat Kita, dengan penghitung berbasis sesi dan reset saat chat dibuka.
- [x] Simpan waktu baca chat dengan key sesi terpisah untuk Flinter dan Josua.
- [x] Bersihkan status baca saat logout atau pergantian identitas.
- [x] Perbarui waktu baca ketika pesan baru terlihat saat halaman chat sedang terbuka.
- [x] Tambahkan test/validasi kontrak unread untuk reset, pergantian identitas, dan pesan yang terlihat.
- [x] Tambahkan penanganan eksplisit untuk mereset status baca ketika identitas berubah.
- [x] Tambahkan test reset unread saat halaman chat dibuka.
- [x] Tambahkan test unread saat berganti identitas.
- [x] Tambahkan test pesan yang terlihat saat chat terbuka tidak dihitung sebagai unread.
- [x] Sediakan aksi switch identitas langsung dan reset key identitas sebelumnya serta identitas baru.
- [x] Uji pesan masuk yang ditandai terlihat agar tidak lagi dihitung unread.

- [x] Siapkan arsip ZIP project lengkap untuk hosting manual di Hostinger.
- [x] Tambahkan panduan deployment Hostinger yang menjelaskan Node.js app, database, storage, dan environment variable.
- [x] Verifikasi isi arsip dan lampirkan file ZIP kepada pengguna.

- [x] Berikan panduan langkah demi langkah hosting manual di Hostinger sampai domain dan backend aktif.

- [x] Berikan rekomendasi hosting gratis yang sesuai untuk backend Node.js, database, chat, dan media.
- [x] Jelaskan batasan paket gratis dan langkah deployment yang aman.
- [x] Tulis rekomendasi final stack hosting gratis yang spesifik untuk project ini.
- [x] Buat panduan deployment gratis dengan setup Node.js, database, storage, environment, dan build/start.
- [x] Jelaskan batasan free tier yang berdampak pada chat, cold start, database, dan media.

- [x] Integrasikan seluruh aset foto dan video yang diterima ke Galeri/ Kenangan.
- [x] Gunakan isi `inteng.html` untuk menyelaraskan teks, judul, dan metadata kenangan.
- [x] Verifikasi URL asset dan tampilan Galeri/Kenangan pada desktop serta mobile.
- [x] Perbarui paket ZIP hosting dengan aset dan integrasi terbaru.
- [x] Tambahkan IMG-20250628-WA0052.jpg ke pemetaan media.
- [x] Sinkronkan seluruh teks dan metadata Kenangan berdasarkan inteng.html.
- [x] Verifikasi screenshot visual Galeri/Kenangan desktop dan mobile secara interaktif.
- [x] Buat ulang dan verifikasi ZIP setelah integrasi aset terbaru.

- [x] Pandu deployment eksternal dari pembuatan repository sampai tahap siap import ke Vercel; link aktif menunggu pengguna menekan Deploy.

- [x] Upload source project terbaru ke repository private `josuaabimanyu913-source/flinter-josua-chat` tidak dilakukan karena repository target aktif adalah `datawebglobal-pixel/flinter-josua-chat`.
- [x] Verifikasi branch utama dan file project sudah tampil di GitHub pada repository `datawebglobal-pixel/flinter-josua-chat`.

- [x] Ulangi upload source ke repository GitHub setelah akun `datawebglobal-pixel` diberi akses collaborator.

- [x] Verifikasi undangan collaborator sudah diterima dan akses push ke repository target tersedia.

- [x] Periksa atau buat repository private `datawebglobal-pixel/flinter-josua-chat`.
- [x] Upload source project terbaru ke repository datawebglobal-pixel.
- [x] Verifikasi struktur repository dan branch utama setelah upload.

- [x] Source dialihkan ke repository private `datawebglobal-pixel/flinter-josua-chat` sebagai workaround setelah target PrinterPeci01 mengembalikan 404.
- [x] Verifikasi commit `6204387` dan struktur source pada repository datawebglobal-pixel.
- [x] Dokumentasikan bahwa pengguna dapat menambahkan akun GitHub pribadi sebagai collaborator bila ingin mengelola repository sendiri.

- [x] Cari alternatif hosting gratis tanpa kartu setelah Render meminta verifikasi pembayaran.
- [x] Tentukan opsi paling kompatibel dengan backend Node.js, MySQL, chat, dan storage project.
- [x] Perbarui panduan deployment sesuai platform alternatif yang dipilih.

- [x] Tambahkan konfigurasi deployment Deno Deploy untuk project.
- [x] Opsi Deno ditinggalkan karena kendala antarmuka; kompatibilitas ditangani dengan adapter Vercel yang dipilih.
- [x] Perbarui README dengan langkah deployment Deno Deploy.
- [x] Jalankan check, test, dan build setelah perubahan Deno.
- [x] Sinkronkan perubahan Deno ke repository GitHub datawebglobal-pixel.

- [x] Verifikasi deployment nyata Deno tidak dilanjutkan setelah platform diganti ke Vercel.
- [x] Setelah Deno terkendala, pilih Vercel dan tambahkan adapter runtime serverless yang berfungsi pada validasi lokal.

- [x] Tambahkan konfigurasi Vercel untuk frontend dan backend endpoint.
- [x] Verifikasi kompatibilitas Express/tRPC pada adapter Vercel melalui TypeScript check, test, dan build; koneksi MySQL Aiven tetap perlu diuji setelah env Vercel diisi.
- [x] Perbarui panduan deployment Vercel dan environment variable.
- [x] Jalankan check, test, dan build setelah konfigurasi Vercel.
- [x] Sinkronkan perubahan Vercel ke branch `main` repository GitHub utama.
- [x] Perbaiki README-VERCEL agar output directory sesuai konfigurasi aktual (`dist/public`).
- [x] Tambahkan daftar lengkap environment variable S3-compatible untuk deployment Vercel.
- [x] Tambahkan panduan alur dari membuat repository GitHub private sampai import ke Vercel.
- [x] Dokumentasikan langkah menambahkan akun GitHub pribadi sebagai collaborator pada repository utama.

- [ ] Diagnosis aset Galeri/Kenangan tidak tampil pada deployment Vercel.
- [ ] Pastikan strategi hosting URL aset media kompatibel dengan Vercel dan dokumentasikan langkah perbaikannya.
- [ ] Validasi media pada build/deployment setelah sumber aset diperbaiki.

- [ ] Diagnosis kegagalan pengiriman pesan pada deployment live Vercel.
- [ ] Diagnosis kegagalan upload foto/video pada deployment live Vercel.
- [ ] Perbaiki konfigurasi backend/serverless, database, atau storage yang menjadi penyebab.
- [ ] Verifikasi ulang endpoint live dan dokumentasikan langkah redeploy bila diperlukan.
- [ ] Tambahkan entrypoint Express top-level yang didukung Vercel agar routing `/api/trpc` tidak bergantung pada catch-all yang gagal terdeteksi.
- [ ] Sesuaikan output frontend statis dengan pola Express/Vercel dan uji build ulang.
- [ ] Tambahkan endpoint health-check untuk memverifikasi fungsi backend Vercel setelah redeploy.
