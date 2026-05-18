export const generateZenMessage = async (habitTitle) => {
  const templates = [
    `Konsistensimu pada "${habitTitle}" seperti air yang sabar mengukir batu. Teruslah mengalir.`,
    `Tunas dari "${habitTitle}" mulai berakar kuat di batinmu. Rawatlah dengan kesabaran.`,
    `Setiap kali kamu menyelesaikan "${habitTitle}", kamu menanam satu bibit kedamaian untuk hari esok.`,
    `Daun-daun kesuksesan dari "${habitTitle}" perlahan mekar. Ingatlah, pohon besar berawal dari satu biji kecil.`,
    `Angin keraguan tidak akan menumbangkan pohon yang akarnya kuat. Teruslah rawat "${habitTitle}".`
  ];
  
  // Simulate network delay for "AI generation" vibe
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return templates[Math.floor(Math.random() * templates.length)];
};
