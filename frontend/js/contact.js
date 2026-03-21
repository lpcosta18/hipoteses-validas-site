// =================================================================
// 📧 FORMULÁRIO DE CONTACTO - frontend/js/contact.js
// =================================================================
// Responsável por:
// - Recolher dados do formulário
// - Validar campos obrigatórios
// - Chamar API /api/sendContact
// - Mostrar feedback ao utilizador
// =================================================================

document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
});

function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');
    const formErrorMessage = document.getElementById('formErrorMessage');

    // Validação de elementos críticos
    if (!form || !submitBtn || !formSuccess || !formError) {
        console.error('❌ Elementos do formulário não encontrados');
        return;
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Reset UI
        hideMessages();
        let hasErrors = false;

        // =================================================================
        // 1️⃣ VALIDAÇÃO DE CAMPOS OBRIGATÓRIOS
        // =================================================================
        const requiredFields = [
            { id: 'nome', errorId: 'nomeError', validator: v => v?.trim().length > 0 },
            { id: 'email', errorId: 'emailError', validator: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
            { id: 'assunto', errorId: 'assuntoError', validator: v => v?.trim().length > 0 },
            { id: 'mensagem', errorId: 'mensagemError', validator: v => v?.trim().length > 0 },
            { id: 'privacidade', errorId: 'privacidadeError', validator: v => v === true }
        ];

        requiredFields.forEach(field => {
            const el = document.getElementById(field.id);
            const value = field.id === 'privacidade' ? el?.checked : el?.value;
            const errorEl = document.getElementById(field.errorId);
            
            if (!field.validator(value)) {
                showError(errorEl);
                hasErrors = true;
                if (!document.activeElement || document.activeElement !== el) {
                    el?.focus();
                }
            } else {
                hideError(errorEl);
            }
        });

        if (hasErrors) return;

        // =================================================================
        // 2️⃣ RECOLHER DADOS DO FORMULÁRIO (APENAS CAMPOS CRUS)
        // =================================================================
        const formData = {
            nome: document.getElementById('nome')?.value?.trim(),
            email: document.getElementById('email')?.value?.trim(),
            empresa: document.getElementById('empresa')?.value?.trim() || '',
            telemovel: document.getElementById('telemovel')?.value?.trim() || '',
            assunto: document.getElementById('assunto')?.value?.trim(),  // ex: "fiscalidade"
            mensagem: document.getElementById('mensagem')?.value?.trim(),
            privacidade: document.getElementById('privacidade')?.checked
        };

        // =================================================================
        // 3️⃣ CHAMAR API (PAYLOAD CORRETO - SEM subject/html pré-formatados)
        // =================================================================
        setLoading(true);

        try {
            const response = await fetch(API_CONFIG.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_CONFIG.apiKey
                },
                body: JSON.stringify({
                    // ✅ Enviar APENAS dados do formulário (o backend formata o email)
                    nome: formData.nome,
                    email: formData.email,
                    empresa: formData.empresa,
                    telemovel: formData.telemovel,
                    assunto: formData.assunto,
                    mensagem: formData.mensagem,
                    privacidade: formData.privacidade
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                showSuccess();
                form.reset();
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                throw new Error(result.error || 'Erro ao enviar mensagem');
            }

        } catch (err) {
            console.error('❌ Form submission error:', err);
            
            let userMessage = 'Erro ao enviar mensagem. Tenta novamente.';
            if (err.message?.includes('401')) {
                userMessage = '🔐 Erro de configuração. Contacta o suporte.';
            } else if (err.message?.includes('400')) {
                userMessage = '📋 Verifica se preencheu todos os campos corretamente.';
            } else if (err.name === 'TypeError' && err.message?.includes('Failed to fetch')) {
                userMessage = '🌐 Erro de ligação. Verifica a tua internet.';
            }
            
            showError(formErrorMessage, userMessage);
            formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
        } finally {
            setLoading(false);
        }
    });

    // =================================================================
    // 4️⃣ REMOVER ERROS AO COMEÇAR A ESCREVER (UX)
    // =================================================================
    ['nome', 'email', 'assunto', 'mensagem'].forEach(fieldId => {
        const el = document.getElementById(fieldId);
        el?.addEventListener('input', () => {
            hideError(document.getElementById(`${fieldId}Error`));
        });
    });
    document.getElementById('privacidade')?.addEventListener('change', () => {
        hideError(document.getElementById('privacidadeError'));
    });
}

// =================================================================
// 🎨 UI HELPERS
// =================================================================

function showError(el, message) {
    if (message) el.textContent = message;
    el.classList.add('visible');
}

function hideError(el) {
    if (el) el.classList.remove('visible');
}

function hideMessages() {
    document.getElementById('formSuccess')?.classList.remove('visible');
    document.getElementById('formError')?.classList.remove('visible');
}

function showSuccess() {
    hideMessages();
    document.getElementById('formSuccess')?.classList.add('visible');
}

function setLoading(loading) {
    const btn = document.getElementById('submitBtn');
    if (!btn) return;
    
    if (loading) {
        btn.classList.add('btn-loading');
        btn.dataset.originalText = btn.textContent;
        btn.textContent = 'A enviar...';
        btn.disabled = true;
    } else {
        btn.classList.remove('btn-loading');
        btn.textContent = btn.dataset.originalText || 'Enviar Mensagem';
        btn.disabled = false;
    }
}