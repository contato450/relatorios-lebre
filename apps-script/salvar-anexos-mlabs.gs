// Google Apps Script — cola isso em script.google.com (projeto novo).
// Função: pega os PDFs que o mLabs manda por e-mail (agendamento mensal)
// e salva na pasta "Anexos mLabs" do Drive, de onde a rotina automática lê.
// Necessário porque o conector de Gmail usado pela rotina só lê metadados
// de e-mail, não consegue baixar o conteúdo de anexos.

const PASTA_DESTINO_ID = "1R-Bmr5jOcXCCI97hpwzRU_7WGwuNNcvJ"; // Anexos mLabs
const LABEL_PROCESSADO = "mlabs-processado";

const ASSUNTOS_CLIENTES = [
  "Relatório R&S",
  "Relatório Edy Britto & Samuel",
  "Relatório Emílio & Eduardo",
  "Relatório João Neves",
  "Relatório João Pedro & Cristiano",
  "Relatório Silvio & Robson",
];

function salvarAnexosMLabs() {
  const pasta = DriveApp.getFolderById(PASTA_DESTINO_ID);
  let label = GmailApp.getUserLabelByName(LABEL_PROCESSADO);
  if (!label) label = GmailApp.createLabel(LABEL_PROCESSADO);

  const query = `has:attachment filename:pdf -label:${LABEL_PROCESSADO} newer_than:35d`;
  const threads = GmailApp.search(query, 0, 50);

  threads.forEach((thread) => {
    thread.getMessages().forEach((message) => {
      const assunto = message.getSubject();
      const ehRelatorioConhecido = ASSUNTOS_CLIENTES.some((a) => assunto.indexOf(a) !== -1);
      if (!ehRelatorioConhecido) return;

      message.getAttachments().forEach((anexo) => {
        if (anexo.getContentType() !== "application/pdf") return;
        const dataEmail = message.getDate();
        const dataFormatada = Utilities.formatDate(dataEmail, "GMT-3", "yyyy-MM-dd");
        const nomeArquivo = `${assunto.replace(/[\/\\?%*:|"<>]/g, "-")} - ${dataFormatada}.pdf`;
        pasta.createFile(anexo.copyBlob()).setName(nomeArquivo);
      });
    });
    thread.addLabel(label);
  });
}
