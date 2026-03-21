// api/sendContact.js
// =================================================================
// 📧 API ENDPOINT: /api/sendContact
// =================================================================
// Recebe dados do formulário → valida → formata email → envia via Nodemailer
// =================================================================

import { sendEmail } from '../lib/emailService.js'

export default async function handler(req, res) {
  // ✅ Apenas permite método POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ✅ CORS headers (permite apenas domínios autorizados)
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

  // Handle preflight requests
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

    // 2. Receber dados do formulário (SEM "to", "subject" ou "html" do frontend)
    const { nome, email, empresa, telemovel, assunto, mensagem, privacidade } = req.body;

    // 3. Validação de campos obrigatórios
    if (!nome || !email || !assunto || !mensagem || !privacidade) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios em falta: nome, email, assunto, mensagem, privacidade' 
      });
    }

    // 🔐 4. Definir destinatário APENAS no backend (NUNCA confiar no frontend)
    const TO_EMAIL = process.env.CONTACT_RECIPIENT;
    
    if (!TO_EMAIL) {
      console.error('❌ CONTACT_RECIPIENT não configurado no .env');
      return res.status(500).json({ error: 'Erro de configuração do servidor' });
    }

    // 5. Formatar email HTML + texto simples (função local no final do ficheiro)
    const emailContent = formatContactEmail({ 
      nome, 
      email, 
      empresa, 
      telemovel, 
      assunto, 
      mensagem 
    });

    // 6. Mapear assunto para label legível
    const assuntoLabels = {
      'contabilidade': 'Contabilidade',
      'fiscalidade': 'Fiscalidade',
      'gestao': 'Apoio à Gestão',
      'rh': 'Recursos Humanos',
      'seguros': 'Mediação de Seguros',
      'outro': 'Outro Assunto'
    };
    const assuntoLabel = assuntoLabels[assunto] || assunto;

    // 7. 🚨 Enviar email via service genérico (lib/emailService.js)
    //    - to: definido no backend (.env) → SEGURO
    //    - subject: prefixo fixo + assunto do utilizador
    //    - html + text: formatados internamente
    await sendEmail({ 
      to: TO_EMAIL,
      subject: `📩 Novo Contacto: ${assuntoLabel}`,
      html: emailContent.html,
      text: emailContent.text  // Fallback para email clients sem suporte a HTML
    });

    // 8. Log para monitorização (aparece nos logs da Vercel)
    console.log(`✅ Email enviado para ${TO_EMAIL} | De: ${email} | Assunto: ${assuntoLabel}`);

    // 9. Resposta de sucesso ao frontend
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
 * Formata dados do formulário em email HTML profissional + texto simples
 * Design limpo com cores da Hipóteses Válidas
 * @param {Object} data - { nome, email, empresa, telemovel, assunto, mensagem }
 * @returns {Object} { html: string, text: string }
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
  // 📧 HTML EMAIL (Table-based para compatibilidade com todos email clients)
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
            <td align="center" style="padding: 20px 20px;">
               <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(197, 158, 67, 0.15);">
                  <!-- Header -->
                  <tr>
                     <td style="background: linear-gradient(135deg, #c59e43 0%, #e5c28e 100%); padding: 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Novo Contacto</h1>
                        <p style="margin: 8px 0 0 0; color: #ffffff; opacity: 0.95; font-size: 14px;">Hipóteses Válidas</p>
                     </td>
                  </tr>
                  <!-- Content -->
                  <tr>
                     <td style="padding: 30px;">
                        <!-- Dados do Cliente -->
                        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #faf0e6; border-radius: 8px; overflow: hidden; margin-bottom: 10px;">
                           <tr>
                              <td style="padding: 8px 0;">
                                 <div style="background-color: #faf0e6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                    <p><strong>Nome:</strong> ${escapeHtml(data.nome)</p>
                                    <p><strong>Empresa:</strong> ${escapeHtml(data.empresa) || 'Não especificado'}</p>
                                    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
                                    <p><strong>Telemóvel:</strong> ${escapeHtml(data.telemovel) || 'Não especificado'} ${telefone }</p>
                                    <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-PT')}</p>
                                    <p><strong>Assunto:</strong> ${escapeHtml(assuntoLabels[data.assunto] || data.assunto)}</p>
                                 </div>
                              </td>
                           </tr>
                        </table>
                        <!-- Mensagem -->
                        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; border: 1px solid #e0e0e0; overflow: hidden;">
                           <tr>
                              <td style="padding: 20px;">
                                 <h3 style="margin: 0 0 12px 0; color: #c59e43; font-size: 16px; font-weight: 600;">MENSAGEM</h3>
                                 <p style="margin: 0; color: #1a1a1a; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(data.mensagem)}</p>
                              </td>
                           </tr>
                        </table>
                     </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                     <td style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
                        <p style="margin: 0; color: #666666; font-size: 12px; line-height: 1.5;">
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
  // 📝 TEXTO SIMPLES (fallback para email clients sem suporte a HTML)
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