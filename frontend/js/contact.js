// =================================================================
// 📧 FORMULÁRIO DE CONTACTO
// =================================================================
// Campos:
// - Obrigatórios: nome, email, assunto, mensagem, privacidade
// - Opcionais: empresa, telemovel
// =================================================================

document.addEventListener('DOMContentLoaded', function() {
  initContactForm();
});

function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const formError = document.getElementById('formError');
  const submitBtn = contactForm?.querySelector('button[type="submit"]');

  // Validação de elementos
  if (!contactForm || !formSuccess || !formError) {
    console.error('❌ Elementos do formulário não encontrados');
    return;
  }

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Reset UI
    formSuccess.style.display = 'none';
    formError.style.display = 'none';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'A enviar...';
    }

    try {
      // 1️⃣ Recolher dados do formulário
      const formData = new FormData(contactForm);
      const data = {
        nome: formData.get('nome')?.toString().trim(),
        email: formData.get('email')?.toString().trim(),
        empresa: formData.get('empresa')?.toString().trim() || '',
        telemovel: formData.get('telemovel')?.toString().trim() || '',
        assunto: formData.get('assunto')?.toString().trim(),
        mensagem: formData.get('mensagem')?.toString().trim(),
        privacidade: formData.get('privacidade') === 'on'
      };

      // 2️⃣ Validação de campos obrigatórios
      const requiredFields = ['nome', 'email', 'assunto', 'mensagem', 'privacidade'];
      const missing = requiredFields.filter(field => {
        if (field === 'privacidade') return !data.privacidade;
        return !data[field];
      });

      if (missing.length > 0) {
        throw new Error(`Campos obrigatórios em falta: ${missing.join(', ')}`);
      }

      // 3️⃣ Estruturar HTML do email
      const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body{font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto}
  .header{background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:20px;text-align:center}
  .content{background:#f9f9f9;padding:25px}
  .field{margin:15px 0;padding:12px;background:#fff;border-left:4px solid #667eea;border-radius:4px}
  .label{font-weight:700;color:#666;font-size:.9em;margin-bottom:4px}
  .value{color:#222;word-wrap:break-word}
  .footer{text-align:center;padding:15px;color:#999;font-size:.85em}
</style></head>
<body>
  <div class="header"><h2 style="margin:0">📩 Novo Contacto</h2></div>
  <div class="content">
    <div class="field"><div class="label">👤 Nome</div><div class="value">${escapeHtml(data.nome)}</div></div>
    <div class="field"><div class="label">📧 Email</div><div class="value">${escapeHtml(data.email)}</div></div>
    ${data.empresa ? `<div class="field"><div class="label">🏢 Empresa</div><div class="value">${escapeHtml(data.empresa)}</div></div>` : ''}
    ${data.telemovel ? `<div class="field"><div class="label">📞 Telemovel</div><div class="value">${escapeHtml(data.telemovel)}</div></div>` : ''}
    <div class="field"><div class="label">📝 Assunto</div><div class="value">${escapeHtml(data.assunto)}</div></div>
    <div class="field"><div class="label">💬 Mensagem</div><div class="value" style="white-space:pre-wrap">${escapeHtml(data.mensagem)}</div></div>
  </div>
  <div class="footer">theSmoohPath • Formulário de contacto</div>
</body>
</html>`.trim();

      // 4️⃣ Chamar API
      const response = await fetch('/api/sendContact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'geral@thesmoothpath.pt',  // Email que RECEBE (podes mover para variável)
          subject: `📩 ${data.assunto}`,
          html: htmlContent
        })
      });

      const result = await response.json();

      // 5️⃣ Processar resposta
      if (response.ok && result.success) {
        formSuccess.style.display = 'block';
        contactForm.reset();
        setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
      } else {
        throw new Error(result.error || 'Erro ao enviar mensagem');
      }

    } catch (err) {
      console.error('❌ Erro:', err.message);
      formError.textContent = '✕ ' + (err.message || 'Erro ao enviar mensagem');
      formError.style.display = 'block';
      setTimeout(() => { formError.style.display = 'none'; }, 6000);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar';
      }
    }
  });
}

/**
 * Escape HTML para prevenir XSS
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}