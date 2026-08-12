// Coleta ouvintes mensais do Spotify via navegador headless (Playwright).
// A página do Spotify não expõe mais esse número em HTML estático — precisa
// renderizar JS de verdade. Testado e validado em 2026-08-12 para os 6 clientes.
const { chromium } = require("playwright");

async function coletarOuvintesMensais(spotifyArtistUrl) {
  const id = spotifyArtistUrl.match(/artist\/([a-zA-Z0-9]+)/)?.[1];
  if (!id) throw new Error(`URL de artista inválida: ${spotifyArtistUrl}`);

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      locale: "pt-BR",
    });
    await page.goto(`https://open.spotify.com/artist/${id}`, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await page.waitForTimeout(3500);
    const text = await page
      .locator("text=/ouvintes mensais|monthly listeners/i")
      .first()
      .textContent({ timeout: 8000 });
    const numero = parseInt(text.replace(/[^\d]/g, ""), 10);
    return { ouvintesMensais: numero, bruto: text.trim() };
  } finally {
    await browser.close();
  }
}

module.exports = { coletarOuvintesMensais };

// Uso direto: node coletar-spotify.js <url-do-artista>
if (require.main === module) {
  const url = process.argv[2];
  if (!url) {
    console.error("Uso: node coletar-spotify.js <url-do-artista-spotify>");
    process.exit(1);
  }
  coletarOuvintesMensais(url)
    .then((r) => console.log(JSON.stringify(r)))
    .catch((e) => {
      console.error("Erro:", e.message);
      process.exit(1);
    });
}
