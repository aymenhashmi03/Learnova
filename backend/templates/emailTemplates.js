/**
 * HTML email templates for Learnova. Inline styles for broad client support.
 */

const baseStyles = {
  wrapper: 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 560px; margin: 0 auto;',
  card: 'background: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.07); overflow: hidden;',
  header: 'background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; padding: 24px 28px; text-align: center;',
  headerTitle: 'margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.02em;',
  body: 'padding: 28px; background: #f8fafc;',
  content: 'background: #ffffff; padding: 24px; border-radius: 8px; margin-bottom: 20px;',
  text: 'margin: 0 0 16px; font-size: 15px; color: #334155;',
  textSmall: 'margin: 0 0 12px; font-size: 14px; color: #64748b;',
  button: 'display: inline-block; background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 8px 0;',
  footer: 'padding: 16px 28px; text-align: center; font-size: 12px; color: #94a3b8; background: #f1f5f9;',
  divider: 'height: 1px; background: #e2e8f0; margin: 20px 0;',
  row: 'margin-bottom: 12px;',
  label: 'font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;',
  value: 'font-size: 16px; font-weight: 600; color: #0f172a;',
};

function layout(title, bodyHtml) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin: 0; padding: 24px; background: #e2e8f0;">
  <div style="${baseStyles.wrapper}">
    <div style="${baseStyles.card}">
      <div style="${baseStyles.header}">
        <h1 style="${baseStyles.headerTitle}">Learnova</h1>
      </div>
      <div style="${baseStyles.body}">
        <div style="${baseStyles.content}">
          ${bodyHtml}
        </div>
      </div>
      <div style="${baseStyles.footer}">
        This email was sent by Learnova. If you didn't expect it, you can ignore it.
      </div>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Welcome email after registration (includes verification link).
 */
function welcomeEmail({ name, verifyUrl }) {
  const title = 'Welcome to Learnova';
  const bodyHtml = `
    <p style="${baseStyles.text}">Hi ${escapeHtml(name || 'there')},</p>
    <p style="${baseStyles.text}">Thanks for signing up! We're glad to have you. To get started, please verify your email address by clicking the button below.</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="${escapeHtml(verifyUrl)}" style="${baseStyles.button}">Verify my email</a>
    </p>
    <p style="${baseStyles.textSmall}">If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="${baseStyles.textSmall}; word-break: break-all;">${escapeHtml(verifyUrl)}</p>
    <p style="${baseStyles.textSmall}">If you didn't create an account with Learnova, you can safely ignore this email.</p>
  `;
  return { subject: title, html: layout(title, bodyHtml) };
}

/**
 * Order confirmation and payment receipt (single email).
 */
function orderConfirmationReceiptEmail({ userName, courseTitle, amount, orderId, date }) {
  const title = 'Order confirmed – Learnova';
  const formattedDate = date ? new Date(date).toLocaleString() : '—';
  const formattedAmount = typeof amount === 'number' ? `$${amount.toFixed(2)}` : amount;
  const bodyHtml = `
    <p style="${baseStyles.text}">Hi ${escapeHtml(userName || 'there')},</p>
    <p style="${baseStyles.text}">Your payment was successful. Here are your order details:</p>
    <div style="${baseStyles.divider}"></div>
    <div style="${baseStyles.row}">
      <div style="${baseStyles.label}">Course</div>
      <div style="${baseStyles.value}">${escapeHtml(courseTitle || '—')}</div>
    </div>
    <div style="${baseStyles.row}">
      <div style="${baseStyles.label}">Amount paid</div>
      <div style="${baseStyles.value}">${escapeHtml(formattedAmount)}</div>
    </div>
    <div style="${baseStyles.row}">
      <div style="${baseStyles.label}">Order ID</div>
      <div style="${baseStyles.value}">${escapeHtml(orderId || '—')}</div>
    </div>
    <div style="${baseStyles.row}">
      <div style="${baseStyles.label}">Date</div>
      <div style="${baseStyles.value}">${escapeHtml(formattedDate)}</div>
    </div>
    <div style="${baseStyles.divider}"></div>
    <p style="${baseStyles.text}">You now have full access to the course. Head to your dashboard to start learning.</p>
  `;
  return { subject: title, html: layout(title, bodyHtml) };
}

/**
 * Password reset email.
 */
function passwordResetEmail({ name, resetUrl, expiresIn = '1 hour' }) {
  const title = 'Reset your Learnova password';
  const bodyHtml = `
    <p style="${baseStyles.text}">Hi ${escapeHtml(name || 'there')},</p>
    <p style="${baseStyles.text}">You requested a password reset. Click the button below to set a new password.</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="${escapeHtml(resetUrl)}" style="${baseStyles.button}">Reset password</a>
    </p>
    <p style="${baseStyles.textSmall}">This link will expire in ${escapeHtml(expiresIn)}. If you didn't request a reset, you can safely ignore this email.</p>
    <p style="${baseStyles.textSmall}">If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="${baseStyles.textSmall}; word-break: break-all;">${escapeHtml(resetUrl)}</p>
  `;
  return { subject: title, html: layout(title, bodyHtml) };
}

module.exports = {
  welcomeEmail,
  orderConfirmationReceiptEmail,
  passwordResetEmail,
};
