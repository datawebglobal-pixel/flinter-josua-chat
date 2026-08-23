# Manifest Media Flinter & Josua

Aset foto dan video dari folder pengguna telah diunggah ke storage WebDev dan dipetakan pada `client/src/pages/Home.tsx` melalui `bundledMedia`. Galeri memuat seluruh foto yang dikirim, sedangkan Kenangan memuat foto pada urutan yang mengikuti `inteng.html`.

Untuk hosting di luar WebDev seperti Render atau Hostinger, unggah ulang file asli ke object storage S3-compatible dan ganti URL `/manus-storage/...` pada `bundledMedia` dengan URL publik bucket/CDN Anda. File `legacy/inteng.html` disimpan hanya sebagai referensi sumber lama dan tidak dipakai sebagai entrypoint aplikasi React.
