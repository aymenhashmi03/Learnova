const nodemailer = require('nodemailer');
const logger = require('./logger');

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL } = process.env;

let transporter = null;

const getTransporter = () => {
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }
  return transporter;
};

/**
 * Send an email. Fails silently (logs only) if SMTP is not configured or send fails.
 * @param {{ to: string, subject: string, html: string }} options
 */
const sendMail = async (options) => {
  const transport = getTransporter();
  if (!transport) {
    logger.warn('Email not sent: SMTP not configured', { to: options.to, subject: options.subject });
    return;
  }

  const from = FROM_EMAIL || '"Learnova" <no-reply@learnova.local>';

  try {
    await transport.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    logger.info('Email sent', { to: options.to, subject: options.subject });
  } catch (err) {
    logger.error('Email send failed', {
      to: options.to,
      subject: options.subject,
      message: err.message,
    });
  }
};

module.exports = {
  getTransporter,
  sendMail,
};
