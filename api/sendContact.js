// api/sendContact.js
// =================================================================
// 📧 API ENDPOINT: /api/sendContact
// =================================================================

import { sendEmail } from '../lib/emailService.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
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
    // 🔐 Validar API Key
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.API_KEY;

    if (validApiKey && (!apiKey || apiKey !== validApiKey)) {
      console.warn('⚠️ API Key inválida:', apiKey);
      return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
    }

    // Receber dados do formulário
    const { nome, email, empresa, telemovel, assunto, mensagem, privacidade } = req.body;

    // Validação de campos obrigatórios
    if (!nome || !email || !assunto || !mensagem || !privacidade) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios em falta: nome, email, assunto, mensagem, privacidade' 
      });
    }

    // 🔐 Destinatário definido no backend
    const TO_EMAIL = process.env.CONTACT_RECIPIENT;
    
    if (!TO_EMAIL) {
      console.error('❌ CONTACT_RECIPIENT não configurado no .env');
      return res.status(500).json({ error: 'Erro de configuração do servidor' });
    }

    // Formatar email
    const emailContent = formatContactEmail({ 
      nome, email, empresa, telemovel, assunto, mensagem 
    });

    // Mapear assunto para label
    const assuntoLabels = {
      'contabilidade': 'Contabilidade',
      'fiscalidade': 'Fiscalidade',
      'gestao': 'Apoio à Gestão',
      'rh': 'Recursos Humanos',
      'seguros': 'Mediação de Seguros',
      'outro': 'Outro Assunto'
    };
    const assuntoLabel = assuntoLabels[assunto] || assunto;

    // Enviar email
    await sendEmail({ 
      to: TO_EMAIL,
      subject: `📩 Novo Contacto: ${assuntoLabel}`,
      html: emailContent.html,
      text: emailContent.text
    });

    console.log(`✅ Email enviado para ${TO_EMAIL} | De: ${email} | Assunto: ${assuntoLabel}`);

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
 * Formata dados do formulário em email HTML + texto simples
 * Design limpo e simples com cores da Hipóteses Válidas
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

  // =================================================================
  // 📧 HTML EMAIL (Simples e compatível com email clients)
  // =================================================================
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Novo Contacto - Hipóteses Válidas</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f5f0;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(197, 158, 67, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #c59e43; padding: 20px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600;">Novo Contacto</h1>
              <p style="margin: 5px 0 0 0; color: #ffffff; opacity: 0.95; font-size: 13px;">Hipóteses Válidas</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 20px;">
              
              <!-- Dados do Cliente -->
              <div style="background-color: #faf0e6; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
                <p style="margin: 8px 0; color: #1a1a1a; font-size: 14px;"><strong>Nome:</strong> ${escapeHtml(data.nome)}</p>
                ${data.empresa ? `<p style="margin: 8px 0; color: #1a1a1a; font-size: 14px;"><strong>Empresa:</strong> ${escapeHtml(data.empresa)}</p>` : ''}
                <p style="margin: 8px 0; color: #1a1a1a; font-size: 14px;"><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}" style="color: #c59e43; text-decoration: none;">${escapeHtml(data.email)}</a></p>
                ${data.telemovel ? `<p style="margin: 8px 0; color: #1a1a1a; font-size: 14px;"><strong>Telemóvel:</strong> <a href="tel:${escapeHtml(data.telemovel)}" style="color: #c59e43; text-decoration: none;">${escapeHtml(data.telemovel)}</a></p>` : ''}
                <p style="margin: 8px 0; color: #1a1a1a; font-size: 14px;"><strong>Assunto:</strong> ${escapeHtml(assuntoLabels[data.assunto] || data.assunto)}</p>
                <p style="margin: 8px 0; color: #1a1a1a; font-size: 14px;"><strong>Data/Hora:</strong> ${timestamp}</p>
              </div>
              
              <!-- Mensagem -->
              <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #e0e0e0;">
                <h3 style="margin: 0 0 10px 0; color: #c59e43; font-size: 14px; font-weight: 600;">MENSAGEM</h3>
                <p style="margin: 0; color: #1a1a1a; font-size: 14px; line-height: 1.5; white-space: pre-wrap;">${escapeHtml(data.mensagem)}</p>
              </div>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f5f5f5; padding: 15px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0; color: #666666; font-size: 11px;">
                Este email foi enviado automaticamente através do formulário de contacto<br>
                <strong style="color: #c59e43;">Hipóteses Válidas, Lda.</strong>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // =================================================================
  // 📝 TEXTO SIMPLES (fallback)
  // =================================================================
  const text = `
NOVO CONTACTO - Hipóteses Válidas
=================================

👤 NOME: ${data.nome}
📧 EMAIL: ${data.email}
${data.empresa ? `🏢 EMPRESA: ${data.empresa}` : ''}
${data.telemovel ? `📞 TELEMÓVEL: ${data.telemovel}` : ''}
📝 ASSUNTO: ${assuntoLabels[data.assunto] || data.assunto}
🕐 DATA/HORA: ${timestamp}

💬 MENSAGEM:
${data.mensagem}

---
Este email foi enviado automaticamente através do formulário de contacto
Hipóteses Válidas, Lda. • Rua Joaquim Maria Simões, 1 • 2560-281 Torres Vedras
  `.trim();

  return { html, text };
}