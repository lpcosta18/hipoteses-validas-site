// =================================================================
// 📧 EMAIL SERVICE
// =================================================================
// Configuração SMTP + Envio via Nodemailer
// =================================================================

import nodemailer from 'nodemailer'

/**
 * Cria transporter stateless (compatível com serverless Vercel)
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PWD_APP
    },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 5000,
    socketTimeout: 5000
  })
}

/**
 * Envia email (interface simples e reutilizável)
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject
  };

  if (html) mailOptions.html = html;
  if (text) mailOptions.text = text;

  return await transporter.sendMail(mailOptions);
}