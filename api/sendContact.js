// api/sendContact.js
import { sendEmail } from '../lib/emailService.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://hipoteses-validas.pt',
    'https://hipoteses-validas-site.vercel.app',
    'https://www.hipoteses-validas.pt',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ];

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 🔐 1. Validar API Key
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.API_KEY;

    if (validApiKey && (!apiKey || apiKey !== validApiKey)) {
      console.warn('⚠️ API Key inválida:', apiKey);
      return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
    }

    // 2. Receber dados do formulário (SEM "to")
    const { nome, email, empresa, telemovel, assunto, mensagem, privacidade } = req.body;

    // 3. Validação de campos obrigatórios
    if (!nome || !email || !assunto || !mensagem || !privacidade) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios em falta' 
      });
    }

    // 🔐 4. Definir destinatário APENAS no backend (NUNCA confiar no frontend)
    const TO_EMAIL = process.env.CONTACT_RECIPIENT;
    
    if (!TO_EMAIL) {
      console.error('❌ CONTACT_RECIPIENT não configurado no .env');
      return res.status(500).json({ error: 'Erro de configuração do servidor' });
    }

    // 5. Formatar HTML do email (podes mover para lib/ se preferires)
    const emailHtml = formatContactEmail({ 
      nome, 
      email, 
      empresa, 
      telemovel, 
      assunto, 
      mensagem 
    });

    // 6. 🚨 IGNORE qualquer "to" vindo do frontend — usa sempre o do .env
    await sendEmail({ 
      to: TO_EMAIL,  // ← SEGURO: vem do .env, não do request
      subject: `📩 Novo Contacto: ${assunto}`,
      html: emailHtml
    });

    // 7. Log para monitorização
    console.log(`✅ Email enviado para ${TO_EMAIL} | De: ${email} | Assunto: ${assunto}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Mensagem enviada com sucesso!' 
    });

  } catch (error) {
    console.error('❌ sendContact error:', error);
    return res.status(500).json({ 
      error: 'Erro ao enviar mensagem. Tenta novamente.' 
    });
  }
}

/**
 * Formata dados do formulário em HTML de email
 */
function formatContactEmail(data) {
  const escapeHtml = (text) => {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const timestamp = new Date().toLocaleString('pt-PT', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const assuntoLabels = {
    'contabilidade': 'Contabilidade',
    'fiscalidade': 'Fiscalidade',
    'gestao': 'Apoio à Gestão',
    'rh': 'Recursos Humanos',
    'seguros': 'Mediação de Seguros',
    'outro': 'Outro Assunto'
  };

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body{font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto}
  .header{background:linear-gradient(135deg,#c59e43,#e5c28e);color:#fff;padding:20px;text-align:center}
  .content{background:#f9f9f9;padding:25px}
  .field{margin:15px 0;padding:12px;background:#fff;border-left:4px solid #c59e43;border-radius:4px}
  .label{font-weight:700;color:#666;font-size:.9em;margin-bottom:4px}
  .value{color:#222;word-wrap:break-word}
  .footer{text-align:center;padding:15px;color:#999;font-size:.85em}
</style></head>
<body>
  <div class="header"><h2 style="margin:0">📩 Novo Contacto</h2><p style="margin:5px 0 0">${timestamp}</p></div>
  <div class="content">
    <div class="field"><div class="label">👤 Nome</div><div class="value">${escapeHtml(data.nome)}</div></div>
    <div class="field"><div class="label">📧 Email de Resposta</div><div class="value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div></div>
    ${data.empresa ? `<div class="field"><div class="label">🏢 Empresa</div><div class="value">${escapeHtml(data.empresa)}</div></div>` : ''}
    ${data.telemovel ? `<div class="field"><div class="label">📞 Telemóvel</div><div class="value">${escapeHtml(data.telemovel)}</div></div>` : ''}
    <div class="field"><div class="label">📝 Assunto</div><div class="value">${escapeHtml(assuntoLabels[data.assunto] || data.assunto)}</div></div>
    <div class="field"><div class="label">💬 Mensagem</div><div class="value" style="white-space:pre-wrap">${escapeHtml(data.mensagem)}</div></div>
  </div>
  <div class="footer">Hipóteses Válidas • Formulário de contacto</div>
</body>
</html>`.trim();
}