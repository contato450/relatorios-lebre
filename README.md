# Relatórios Lebre

Código e templates usados pela rotina mensal automática que gera os relatórios de métricas dos clientes da Agência Lebre. Este repositório guarda apenas **design e lógica** — nenhum dado de cliente fica aqui. Os números de cada mês são buscados em tempo real (Gmail, YouTube, Spotify) e publicados em páginas privadas separadas.

## Estrutura

- `templates/relatorio-cliente.html` — layout claro, enviado ao cliente
- `templates/relatorio-agencia.html` — layout preto "não enviar ao cliente", uso interno
- `assets/lebre-silhueta.png` — logo da agência
- `config/clientes.json` — os 6 clientes: redes sociais e o texto exato de "Assunto" configurado no agendamento do mLabs (usado para localizar o e-mail certo todo mês)
- `data/` — modelos de planilha (histórico mensal de métricas e de conteúdos)

## Como o relatório é gerado todo mês

1. O mLabs envia (agendado, todo dia 1, período "Mês Anterior") um PDF por cliente com Instagram, Facebook e TikTok.
2. Uma rotina automatizada lê esses e-mails, extrai os números, busca Spotify e YouTube à parte, compara com o histórico do mês anterior e preenche os templates deste repositório.
3. O resultado é publicado como página privada (link não listado) com botão de download em PDF.
