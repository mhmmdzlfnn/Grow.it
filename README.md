<div align="center">
  <h1>🌿 Grow.it</h1>
  <p><em>"Tumbuhkan kebiasaan baik dengan penuh kesabaran."</em></p>
</div>

<br />

**Grow.it** adalah aplikasi *habit tracker* bergaya *Cozy Game* yang menggabungkan produktivitas dengan elemen gamifikasi interaktif, desain *Earth-Tone Minimalist*, dan pengalaman yang menenangkan.

---

## ✨ Fitur Utama (Vibe Features)

- **🪴 Interactive 3D Garden**  
  Setiap kebiasaan yang kamu tanam akan direpresentasikan oleh sebuah tanaman virtual. Arahkan *mouse*-mu ke kartu tanaman untuk merasakan efek *parallax 3D* yang responsif.
  
- **🎧 Zen Focus Mode**  
  Lebih dari sekadar mencentang daftar, Grow.it menyediakan mode *Focus* (Pomodoro). Saat diaktifkan, layar akan meredup, suara desiran angin (*swoosh*) terdengar, dan tanaman akan beranimasi seolah-olah "bernapas" menemanimu fokus.

- **🌦️ Dynamic Weather & Time**  
  Suasana kebunmu akan berubah secara otomatis:
  - **Pagi (`day`)**: Sinar matahari pagi (*Sun rays*) yang menyegarkan layar.
  - **Sore (`evening`)**: Daun-daun berguguran perlahan ke bawah.
  - **Malam (`night`)**: Kunang-kunang (*Fireflies*) yang estetis.

- **🐛 Cozy Gamification (Weeds & Pests)**  
  Jika kamu lalai mengerjakan kebiasaanmu selama 2 hari, pot tanamanmu akan ditumbuhi **Rumput Liar 🌿** dan dihampiri **Hama 🐛**. Kamu wajib membersihkannya satu per satu (diklik) sebelum dapat menyiram (mencentang) kebiasaanmu lagi.

- **🎉 Satisfying Micro-Interactions**  
  Mencentang *habit* akan memicu suara tetesan air (*bloop*) dan ledakan *confetti* yang memuaskan.

- **🦋 Rare Encounters**  
  Terdapat peluang acak di mana Kupu-kupu Emas akan terbang melintasi layarmu. Tangkap sebelum ia menghilang untuk mendapatkan kutipan motivasi eksklusif!

- **📊 Zen Streak Heatmap**  
  Pantau seberapa konsisten dirimu melalui kalender *Heatmap* ala GitHub. Semakin sering kamu menyelesaikan kebiasaan, semakin hijau pekat warna kotak harimu.

## 🛠️ Tech Stack

- **Framework**: React + Vite
- **Styling**: Vanilla CSS (CSS Variables untuk *Dynamic Theming*)
- **Animation**: Framer Motion (untuk 3D Tilt, efek bernapas, dan cuaca)
- **Icons**: Lucide React
- **Extras**: Canvas-Confetti
- **Audio**: Web Audio API (Synthesizer kustom—suara dihasilkan langsung dari kode JavaScript tanpa menggunakan *file* mp3 eksternal!)

## 🚀 Cara Menjalankan

1. Clone repository ini:
   ```bash
   git clone https://github.com/mhmmdzlfnn/Grow.it.git
   ```
2. Masuk ke direktori proyek:
   ```bash
   cd Grow.it
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Jalankan *development server*:
   ```bash
   npm run dev
   ```
5. Buka tautan lokal yang muncul (biasanya `http://localhost:5173`) di *browser* favoritmu.

## 🎨 Philosophy

Grow.it dibuat dengan prinsip **"Compassionate Productivity"**. Berbeda dengan *habit tracker* lain yang memberikan *pressure* saat kamu gagal beruntun, Grow.it hanya memintamu untuk mencabut rumput liar dan mulai menyiram lagi. Tidak ada tekanan, hanya taman digital yang menunggumu bertumbuh. 

---
*Dibuat dengan ❤️*
