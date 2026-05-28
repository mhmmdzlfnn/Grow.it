import { GoogleGenAI } from '@google/genai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const FALLBACK_TEMPLATES = [
  `Konsistensimu pada "{habit}" seperti air yang sabar mengukir batu. Teruslah mengalir.`,
  `Tunas dari "{habit}" mulai berakar kuat di batinmu. Rawatlah dengan kesabaran.`,
  `Setiap kali kamu menyelesaikan "{habit}", kamu menanam satu bibit kedamaian untuk hari esok.`,
  `Daun-daun kesuksesan dari "{habit}" perlahan mekar. Pohon besar berawal dari satu biji kecil.`,
  `Angin keraguan tidak akan menumbangkan pohon yang akarnya kuat. Teruslah rawat "{habit}".`,
];

const MOOD_FALLBACKS = {
  berat: [
    'Hari yang berat pun tetap kamu lewati. Itu bukan kelemahan — itu kekuatan.',
    'Bahkan tanaman pun butuh hujan untuk tumbuh. Peluk dirimu hari ini.',
    'Kamu sudah melakukan yang terbaik hari ini. Itu lebih dari cukup.',
  ],
  biasa: [
    'Hari biasa adalah fondasi dari hari-hari luar biasa. Teruslah melangkah.',
    'Konsistensi di hari yang biasa adalah keajaiban tersendiri.',
    'Tidak semua hari harus spektakuler — yang penting kamu tetap hadir.',
  ],
  oke: [
    'Oke itu sudah bagus. Dari oke, kamu bisa tumbuh ke luar biasa.',
    'Hari yang oke adalah tanda kamu sedang dalam jalur yang benar.',
    'Pelan tapi pasti — tanamanmu terus tumbuh, begitu juga kamu.',
  ],
  senang: [
    'Kebahagiaan hari ini adalah pupuk terbaik untuk semangat esok hari!',
    'Simpan energi positif ini — biarkan ia menjadi bahan bakar minggu depanmu.',
    'Senang itu menular. Semoga kamu terus menyebarkannya ke sekitarmu!',
  ],
  luar_biasa: [
    'Luar biasa! Hari ini kamu bersinar seperti matahari pagi yang hangat.',
    'Energimu hari ini bisa menerangi seluruh taman! Pertahankan semangatmu.',
    'Ini dia — versi terbaik dirimu sedang mekar. Nikmati setiap momennya!',
  ],
};

const getFallback = (habitTitle) => {
  const template = FALLBACK_TEMPLATES[Math.floor(Math.random() * FALLBACK_TEMPLATES.length)];
  return template.replace('{habit}', habitTitle);
};

const getMoodFallback = (moodValue) => {
  const list = MOOD_FALLBACKS[moodValue] ?? MOOD_FALLBACKS['oke'];
  return list[Math.floor(Math.random() * list.length)];
};

export const generateZenMessage = async (habitTitle, context = {}) => {
  if (!ai) {
    await new Promise(r => setTimeout(r, 800));
    return getFallback(habitTitle);
  }

  const { streak = 0, stage = 0, justLeveledUp = false } = context;

  const stageNames = ['benih', 'tunas', 'tanaman muda', 'tanaman mekar'];
  const stageName = stageNames[stage] ?? 'tanaman';

  let contextHint = '';
  if (justLeveledUp) contextHint = `Tanamannya baru saja naik level menjadi ${stageName}!`;
  else if (streak >= 7) contextHint = `Dia sudah ${streak} hari berturut-turut konsisten!`;
  else if (streak >= 3) contextHint = `Streak-nya sudah ${streak} hari berturut-turut.`;

  const prompt = `Kamu adalah AI Zen Master dalam aplikasi habit tracker bernama Grow.it, di mana kebiasaan divisualisasikan sebagai tanaman yang tumbuh.

Pengguna baru saja menyelesaikan kebiasaan: "${habitTitle}".
${contextHint}

Berikan satu kalimat motivasi zen yang:
- Singkat (1-2 kalimat maksimal)
- Menggunakan metafora alam atau tanaman
- Hangat, puitis, dan personal
- Dalam Bahasa Indonesia
- TANPA tanda kutip di awal/akhir
- TANPA emoji`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });
    const text = response.text?.trim();
    if (!text) return getFallback(habitTitle);
    return text;
  } catch (err) {
    console.warn('Gemini API error, using fallback:', err.message);
    return getFallback(habitTitle);
  }
};

// Mood-aware response — called after user picks their mood
export const generateMoodResponse = async (moodValue, moodLabel, habitTitle) => {
  if (!ai) {
    await new Promise(r => setTimeout(r, 600));
    return getMoodFallback(moodValue);
  }

  const moodContext = {
    berat:      'Pengguna merasa hari ini berat dan melelahkan.',
    biasa:      'Pengguna merasa harinya biasa saja, tidak terlalu baik atau buruk.',
    oke:        'Pengguna merasa harinya cukup oke.',
    senang:     'Pengguna merasa senang dan bahagia hari ini.',
    luar_biasa: 'Pengguna merasa harinya luar biasa dan penuh semangat.',
  };

  const tone = {
    berat:      'Validasi perasaannya dengan hangat, berikan pelukan emosional, dan ingatkan bahwa hari berat pun adalah bagian dari perjalanan. Jangan terlalu ceria.',
    biasa:      'Apresiasi konsistensinya di hari yang biasa. Ingatkan bahwa konsistensi di hari biasa adalah kunci pertumbuhan.',
    oke:        'Apresiasi dengan ringan dan positif. Dorong untuk terus melangkah.',
    senang:     'Rayakan kebahagiaannya! Validasi perasaan positifnya dan dorong agar energi ini terus terjaga.',
    luar_biasa: 'Rayakan dengan antusias! Validasi semangat luar biasanya dan dorong untuk terus bersinar.',
  };

  const prompt = `Kamu adalah AI Zen Master yang penuh empati dalam aplikasi habit tracker Grow.it.

Pengguna baru saja menyelesaikan kebiasaan "${habitTitle}" dan melaporkan kondisi harinya:
Mood: ${moodLabel} ${moodContext[moodValue] ?? ''}

Tugas kamu: ${tone[moodValue] ?? tone['oke']}

Berikan respons yang:
- 1-2 kalimat, tidak lebih
- Terasa personal dan manusiawi, bukan robotik
- Menggunakan bahasa Indonesia yang hangat dan natural
- Boleh menggunakan metafora alam/tanaman jika terasa natural
- TANPA tanda kutip di awal/akhir
- TANPA emoji`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });
    const text = response.text?.trim();
    if (!text) return getMoodFallback(moodValue);
    return text;
  } catch (err) {
    console.warn('Gemini mood response error, using fallback:', err.message);
    return getMoodFallback(moodValue);
  }
};

const WISDOM_FALLBACKS = {
  Bumi: [
    {
      wisdom: "Akar yang dalam tidak takut pada badai. Teruslah berpijak kuat pada kebiasaan baikmu.",
      prompt: "Keberhasilan kecil apa yang berhasil kamu bangun hari ini?"
    },
    {
      wisdom: "Gunung tidak pernah goyah oleh tiupan angin. Percayalah pada fondasi kokoh yang sedang kamu susun.",
      prompt: "Bagaimana kamu bisa merasa lebih membumi dan tenang hari ini?"
    },
    {
      wisdom: "Bumi membutuhkan waktu untuk mengubah benih menjadi pohon raksasa. Sabarlah dengan proses pertumbuhannmu.",
      prompt: "Hal apa dalam hidupmu yang membutuhkan lebih banyak kesabaran saat ini?"
    },
    {
      wisdom: "Setiap tanah yang subur berawal dari bebatuan yang sabar terkikis waktu. Ketekunanmu tidak sia-sia.",
      prompt: "Sebutkan satu kebiasaan kecil yang paling membuatmu merasa stabil."
    }
  ],
  Air: [
    {
      wisdom: "Jadilah seperti air yang mengalir perlahan melewati rintangan tanpa pernah kehilangan jati dirinya.",
      prompt: "Kekhawatiran apa yang ingin kamu biarkan mengalir pergi hari ini?"
    },
    {
      wisdom: "Air yang tenang mampu memantulkan cahaya bintang dengan sempurna. Tenangkan batinmu untuk melihat jalan ke depan.",
      prompt: "Kapan terakhir kali kamu meluangkan waktu untuk benar-benar beristirahat?"
    },
    {
      wisdom: "Sungai selalu menemukan jalan menuju samudera luas. Begitu pula impianmu akan menemukan jalannya.",
      prompt: "Adakah hal yang sedang kamu paksakan saat ini? Bagaimana jika kamu biarkan mengalir?"
    },
    {
      wisdom: "Hujan yang lembut memberikan kehidupan bagi hutan yang kering. Berikan dirimu kelembutan yang sama hari ini.",
      prompt: "Bagaimana cara terbaikmu memulihkan energi setelah hari yang melelahkan?"
    }
  ],
  Angin: [
    {
      wisdom: "Lepaskan beban yang tak perlu kamu bawa. Biarkan harimu mengalir ringan seperti hembusan angin pagi.",
      prompt: "Pikiran atau ekspektasi berat apa yang ingin kamu lepaskan hari ini?"
    },
    {
      wisdom: "Angin membawa benih-benih baru ke tempat yang tak terduga. Terbukalah pada setiap perubahan hidup.",
      prompt: "Hal baru menarik apa yang kamu pelajari atau alami akhir-akhir ini?"
    },
    {
      wisdom: "Tarik napas sedalam langit, hembuskan perlahan. Biarkan setiap keraguan terbang bersama angin.",
      prompt: "Ambil jeda sejenak untuk bernapas dalam-dalam. Apa yang kamu rasakan sekarang?"
    },
    {
      wisdom: "Angin sepoi-sepoi mampu menyejukkan hari yang terik. Jadilah pembawa ketenangan bagi orang di sekitarmu.",
      prompt: "Siapa orang yang ingin kamu beri apresiasi atau sapa dengan hangat hari ini?"
    }
  ],
  Api: [
    {
      wisdom: "Nyalakan api semangat dalam dirimu, namun biarkan ia menghangatkan langkahmu, bukan membakar energimu.",
      prompt: "Tujuan atau impian apa yang paling membuat jiwamu bersemangat saat ini?"
    },
    {
      wisdom: "Kegelapan malam tidak akan pernah bisa mengalahkan cahaya dari sebatang lilin kecil yang menyala.",
      prompt: "Tindakan kecil apa yang bisa kamu lakukan hari ini untuk menyalakan kembali semangatmu?"
    },
    {
      wisdom: "Api membutuhkan kayu bakar yang tepat untuk terus menyala. Berikan dirimu nutrisi dan istirahat yang cukup.",
      prompt: "Apa yang biasanya menjadi 'kayu bakar' atau sumber motivasi terbesarmu?"
    },
    {
      wisdom: "Emas dimurnikan lewat api yang panas. Tantangan yang kamu hadapi hari ini sedang membentuk kekuatanmu.",
      prompt: "Pelajaran berharga apa yang kamu dapatkan dari kesulitan terakhirmu?"
    }
  ],
  Emas: [
    {
      wisdom: "Setiap tindakan disiplin hari ini adalah butiran emas berharga yang kamu tabung untuk masa depan.",
      prompt: "Hal berharga apa yang paling kamu syukuri dari dirimu hari ini?"
    },
    {
      wisdom: "Kemilau emas sejati tidak akan pernah pudar oleh lumpur. Nilai dirimu tidak ditentukan oleh kegagalan sesaat.",
      prompt: "Apa pencapaian terbaikmu minggu ini yang ingin kamu rayakan?"
    },
    {
      wisdom: "Menghargai waktu adalah cara kita mengumpulkan emas kehidupan yang sesungguhnya.",
      prompt: "Bagaimana kamu bisa menggunakan waktumu dengan lebih bijaksana besok?"
    },
    {
      wisdom: "Kebaikan kecil yang kamu bagikan kepada sesama adalah emas yang paling terang bersinar.",
      prompt: "Kebaikan apa yang telah kamu lakukan atau terima hari ini?"
    }
  ]
};

const getWisdomFallback = (element) => {
  const list = WISDOM_FALLBACKS[element] || WISDOM_FALLBACKS['Bumi'];
  return list[Math.floor(Math.random() * list.length)];
};

export const generateWisdomCard = async (cardElement, habits = []) => {
  if (!ai) {
    await new Promise(r => setTimeout(r, 800));
    return getWisdomFallback(cardElement);
  }

  const habitsList = habits.map(h => h.title).join(', ');
  const prompt = `Kamu adalah AI Zen Master dalam aplikasi habit tracker bernama Grow.it.
Pengguna baru saja menarik kartu harian dengan elemen: "${cardElement}".
Kebiasaan aktif pengguna saat ini: [${habitsList}].

Tugasmu:
1. Berikan pesan kebijaksanaan Zen yang inspiratif dan puitis berdasarkan elemen "${cardElement}" dan kaitkan secara halus dengan perkembangan diri, ketekunan, atau pertumbuhan kebiasaan.
2. Berikan satu pertanyaan refleksi diri (journaling prompt) yang hangat agar pengguna dapat merenung dan menulis jurnal mereka hari ini.

Keluarkan respon dalam format JSON yang valid seperti ini (DAN HANYA JSON INI, TANPA markdown block \`\`\`json atau teks lain):
{
  "wisdom": "pesan kebijaksanaan di sini (maksimal 2 kalimat, bahasa Indonesia, tanpa emoji, tanpa tanda kutip)",
  "prompt": "pertanyaan refleksi/journaling di sini (1 kalimat tanya, bahasa Indonesia, hangat dan bersahabat)"
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    const text = response.text?.trim();
    if (!text) return getWisdomFallback(cardElement);
    
    // Clean any markdown formatting just in case
    const cleanText = text.replace(/```json\s*|```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (err) {
    console.warn('Gemini wisdom card error, using fallback:', err.message);
    return getWisdomFallback(cardElement);
  }
};

const POLAROID_FALLBACKS = [
  "Tunas merambat,\nMembelah tanah keras,\nMekar perlahan.",
  "Setetes air,\nMenghidupkan asa,\nTaman bersemi.",
  "Waktu berlalu,\nDaun berguguran,\nAkar menguat.",
  "Matahari pagi,\nMenyapa tunas muda,\nHarapan baru.",
  "Angin berhembus,\nPohon menari riang,\nPanen tiba."
];

const getPolaroidFallback = () => {
  return POLAROID_FALLBACKS[Math.floor(Math.random() * POLAROID_FALLBACKS.length)];
};

export const generatePolaroidPoem = async (habits = []) => {
  if (!ai || habits.length === 0) {
    await new Promise(r => setTimeout(r, 1200));
    return getPolaroidFallback();
  }

  const habitsList = habits.map(h => h.title).join(', ');
  const prompt = `Kamu adalah seorang penyair alam.
Pengguna sedang membangun kebiasaan ini: [${habitsList}].
Buatkan sebuah Haiku (puisi 3 baris: 5-7-5 suku kata, atau cukup 3 baris puitis pendek) dalam bahasa Indonesia yang terinspirasi dari kebiasaan-kebiasaan mereka, menggunakan metafora kebun dan alam (tanaman, air, matahari, akar).
Jangan beri judul, jangan beri penjelasan, HANYA keluarkan 3 baris puisi tersebut.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });
    const text = response.text?.trim();
    if (!text) return getPolaroidFallback();
    
    return text.replace(/"/g, '');
  } catch (err) {
    console.warn('Gemini polaroid error, using fallback:', err.message);
    return getPolaroidFallback();
  }
};

const fallbackParseVoice = (transcript, habits) => {
  const text = transcript.toLowerCase();
  const match = habits.find(h => text.includes(h.title.toLowerCase()));
  if (match) {
    return {
      action: 'complete',
      habitId: match.id,
      response: `Siap! Habit "${match.title}" sudah Mochi siram! 🌿`
    };
  }
  return {
    action: 'none',
    habitId: null,
    response: `Meow? Mochi kurang paham. Coba sebutkan nama habitnya ya! 🐾`
  };
};

export const parseVoiceCommand = async (transcript, habits = []) => {
  if (!ai || habits.length === 0) {
    await new Promise(r => setTimeout(r, 800));
    return fallbackParseVoice(transcript, habits);
  }

  const habitsData = habits.map(h => ({ id: h.id, title: h.title }));
  const prompt = `Kamu adalah asisten kucing virtual bernama Mochi.
Pengguna mengucapkan: "${transcript}".
Daftar habit pengguna saat ini (ID dan Judul): ${JSON.stringify(habitsData)}

Tugasmu:
Apakah pengguna bermaksud meminta kamu mencentang/menyelesaikan/menyiram salah satu habit tersebut?
Jika YA:
Kembalikan JSON dengan "action": "complete", "habitId": (id habit yang dimaksud), dan "response": (kalimat lucu dari Mochi merespons sukses, maksimal 1 kalimat).
Jika TIDAK atau TIDAK JELAS:
Kembalikan JSON dengan "action": "none", "habitId": null, dan "response": (kalimat balasan lucu Mochi yang merespons sapaan atau kebingungan, maksimal 1 kalimat).

HANYA KELUARKAN JSON SAJA TANPA MARKDOWN ATAU PENJELASAN.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    const text = response.text?.trim();
    if (!text) return fallbackParseVoice(transcript, habits);
    
    const cleanText = text.replace(/```json\s*|```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (err) {
    console.warn('Gemini voice parsing error:', err.message);
    return fallbackParseVoice(transcript, habits);
  }
};
