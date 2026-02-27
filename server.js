/**
 * Servidor Node: serve o site estático (dist/) e o endpoint POST /api/contact (MailerSend).
 * Variáveis de ambiente: MAILERSEND_API_KEY, FROM_EMAIL, FROM_NAME, TO_EMAIL, TO_NAME, PORT.
 */
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Servir ficheiros estáticos da build Eleventy
app.use(express.static(path.join(__dirname, "dist")));

// POST /api/contact — recebe o formulário e envia email via MailerSend
app.post("/api/contact", async (req, res) => {
  const { nome, email, telemovel, assunto, mensagem } = req.body || {};

  if (!nome || !email || !mensagem) {
    return res.status(400).json({
      success: false,
      error: "Nome, email e mensagem são obrigatórios.",
    });
  }

  const apiKey = process.env.MAILERSEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL;
  const fromName = process.env.FROM_NAME || "Hipóteses Válidas";
  const toEmail = process.env.TO_EMAIL;
  const toName = process.env.TO_NAME || "Hipóteses Válidas";

  if (!apiKey || !fromEmail || !toEmail) {
    console.error("Missing env: MAILERSEND_API_KEY, FROM_EMAIL, TO_EMAIL");
    return res.status(500).json({
      success: false,
      error: "Configuração do servidor incompleta. Tente mais tarde.",
    });
  }

  const subject = `Contacto do site: ${assunto || "Geral"}`;
  const text = [
    `Nome: ${nome}`,
    `Email: ${email}`,
    telemovel ? `Telemóvel: ${telemovel}` : null,
    assunto ? `Assunto: ${assunto}` : null,
    "",
    mensagem,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <p><strong>Nome:</strong> ${escapeHtml(nome)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    ${telemovel ? `<p><strong>Telemóvel:</strong> ${escapeHtml(telemovel)}</p>` : ""}
    ${assunto ? `<p><strong>Assunto:</strong> ${escapeHtml(assunto)}</p>` : ""}
    <p><strong>Mensagem:</strong></p>
    <p>${escapeHtml(mensagem).replace(/\n/g, "<br>")}</p>
  `.trim();

  try {
    const mailerSend = new MailerSend({ apiKey });
    const sentFrom = new Sender(fromEmail, fromName);
    const recipients = [new Recipient(toEmail, toName)];

    const replyToSender = new Sender(email, nome);
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(replyToSender)
      .setSubject(subject)
      .setHtml(html)
      .setText(text);

    console.log("[api/contact] A enviar email para", toEmail, "de", fromEmail);
    await mailerSend.email.send(emailParams);
    console.log("[api/contact] Email enviado com sucesso.");
    res.setHeader("Content-Type", "application/json");
    return res.status(200).send(JSON.stringify({ success: true }));
  } catch (err) {
    console.error("[api/contact] MailerSend error:", err?.message || err);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).send(
      JSON.stringify({
        success: false,
        error: "Não foi possível enviar a mensagem. Tente mais tarde ou contacte-nos por telefone.",
      })
    );
  }
});

function escapeHtml(s) {
  if (typeof s !== "string") return "";
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
