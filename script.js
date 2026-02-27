// script.js – formulário de contacto: POST para /api/contact (servidor Node)
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  if (!form) {
    console.log("[Contact form] Nenhum #contactForm encontrado.");
    return;
  }
  console.log("[Contact form] Form encontrado, listener de submit registado.");

  const successEl = document.getElementById("form-success");
  const errorEl = document.getElementById("form-error");
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    e.stopPropagation();
    console.log("[Contact form] Submit interceptado, a enviar para /api/contact...");

    if (successEl) successEl.style.display = "none";
    if (errorEl) errorEl.style.display = "none";

    const fd = new FormData(form);
    const payload = {
      nome: (fd.get("nome") || "").trim(),
      email: (fd.get("email") || "").trim(),
      telemovel: (fd.get("telemovel") || "").trim() || undefined,
      assunto: (fd.get("assunto") || "").trim() || undefined,
      mensagem: (fd.get("mensagem") || "").trim(),
    };

    const originalLabel = submitBtn?.textContent;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "A enviar...";
    }

    const apiUrl = (typeof window !== "undefined" && window.location?.origin)
      ? window.location.origin + "/api/contact"
      : "/api/contact";
    console.log("[Contact form] fetch POST", apiUrl, payload);

    let res;
    let data = {};
    try {
      res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      data = await res.json().catch(() => ({}));
    } catch (err) {
      if (errorEl) {
        errorEl.textContent = "Erro de ligação. Verifique a rede e tente novamente.";
        errorEl.style.display = "block";
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel || "Enviar mensagem";
      }
      return;
    }

    if (res.ok && data.success) {
      form.style.display = "none";
      if (successEl) successEl.style.display = "block";
    } else {
      if (errorEl) {
        errorEl.textContent = data.error || "Ocorreu um erro. Tente novamente.";
        errorEl.style.display = "block";
      }
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel || "Enviar mensagem";
    }
  });
});
