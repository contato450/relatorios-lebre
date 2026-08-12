// Coleta estatísticas de canal via YouTube Data API v3 (oficial, gratuita).
// Aceita tanto URL com /channel/UC... quanto com /@handle.
async function coletarCanal(youtubeUrl, apiKey) {
  const channelIdMatch = youtubeUrl.match(/channel\/(UC[\w-]+)/);
  const handleMatch = youtubeUrl.match(/@([^/?]+)/);

  let param;
  if (channelIdMatch) {
    param = `id=${channelIdMatch[1]}`;
  } else if (handleMatch) {
    param = `forHandle=${decodeURIComponent(handleMatch[1])}`;
  } else {
    throw new Error(`URL de canal inválida: ${youtubeUrl}`);
  }

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=statistics&${param}&key=${apiKey}`
  );
  const data = await res.json();
  const item = data.items?.[0];
  if (!item) throw new Error(`Canal não encontrado: ${youtubeUrl} — ${JSON.stringify(data)}`);

  return {
    inscritos: parseInt(item.statistics.subscriberCount, 10),
    visualizacoesTotais: parseInt(item.statistics.viewCount, 10),
    totalVideos: parseInt(item.statistics.videoCount, 10),
  };
}

module.exports = { coletarCanal };

// Uso direto: node coletar-youtube.js <url-do-canal> <api-key>
if (require.main === module) {
  const [, , url, apiKey] = process.argv;
  if (!url || !apiKey) {
    console.error("Uso: node coletar-youtube.js <url-do-canal> <api-key>");
    process.exit(1);
  }
  coletarCanal(url, apiKey)
    .then((r) => console.log(JSON.stringify(r)))
    .catch((e) => {
      console.error("Erro:", e.message);
      process.exit(1);
    });
}
