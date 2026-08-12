// Roda a coleta de ouvintes mensais do Spotify para todos os clientes de
// config/clientes.json e salva o resultado em data/spotify-mensal.json.
// Feito para rodar no GitHub Actions (tem acesso livre à internet, ao
// contrário do sandbox da rotina na nuvem, que bloqueia open.spotify.com).
const fs = require("fs");
const path = require("path");
const { coletarOuvintesMensais } = require("./coletar-spotify");

async function main() {
  const clientesPath = path.join(__dirname, "..", "config", "clientes.json");
  const { clientes } = JSON.parse(fs.readFileSync(clientesPath, "utf-8"));

  const resultado = {
    coletado_em: new Date().toISOString(),
    clientes: {},
  };

  for (const cliente of clientes) {
    try {
      const r = await coletarOuvintesMensais(cliente.spotify);
      resultado.clientes[cliente.nome] = r;
      console.log(`OK: ${cliente.nome} -> ${r.ouvintesMensais}`);
    } catch (e) {
      resultado.clientes[cliente.nome] = { erro: e.message };
      console.error(`FALHOU: ${cliente.nome} -> ${e.message}`);
    }
  }

  const outPath = path.join(__dirname, "..", "data", "spotify-mensal.json");
  fs.writeFileSync(outPath, JSON.stringify(resultado, null, 2) + "\n");
  console.log(`Salvo em ${outPath}`);
}

main();
