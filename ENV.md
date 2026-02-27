# Variáveis de ambiente (formulário de contacto – MailerSend)

**Importante:** O formulário de contacto só envia emails quando o site é servido pelo **servidor Node** (`node server.js`). Se abrires só os ficheiros estáticos (ex.: `eleventy --serve` ou abrir `contacto.html` no browser) **não existe** o endpoint `/api/contact`, por isso não verás nenhum pedido na Network e não recebes email.

- **Em local:** depois de `npm run build`, corre `npm start` e abre `http://localhost:3000/contacto.html`.
- **No Render:** o serviço tem de ser **Web** com `runtime: node` e `startCommand: node server.js` (não Static).

Configura as variáveis abaixo no **Render Dashboard** (Environment) ou num ficheiro `.env` em desenvolvimento.

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `MAILERSEND_API_KEY` | Sim | Chave de API do MailerSend (Dashboard → API Tokens). |
| `FROM_EMAIL` | Sim | Email verificado no MailerSend que aparece como remetente (ex.: `geral@hipoteses-validas.pt`). |
| `FROM_NAME` | Não | Nome do remetente (ex.: `Hipóteses Válidas`). |
| `TO_EMAIL` | Sim | Email que recebe os contactos do site (ex.: `geral@hipoteses-validas.pt`). |
| `TO_NAME` | Não | Nome do destinatário (ex.: `Hipóteses Válidas`). |

No `render.yaml` as variáveis estão com `sync: false` para que os valores (em especial a API key) sejam definidos no Dashboard e não no repositório.

## Testar em local

1. Cria um `.env` na raiz (não faças commit) com as variáveis acima.
2. Instala dependências e gera o site: `npm install && npm run build`.
3. Arranca o servidor: `npm start`.
4. Abre `http://localhost:3000/contacto.html` e envia o formulário.

O endpoint do formulário é `POST /api/contact`.
