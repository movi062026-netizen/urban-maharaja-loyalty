const { Resend } = require('resend');
const env = require('../../config/env');
const logger = require('../../config/logger');

let resendClient = null;

const getResendClient = () => {
  if (!resendClient && env.RESEND_API_KEY) {
    resendClient = new Resend(env.RESEND_API_KEY);
  }
  return resendClient;
};

/**
 * Check if Resend email service is configured
 */
const isEmailConfigured = () => {
  return Boolean(env.RESEND_API_KEY);
};

/**
 * Generate Royal Password Reset HTML Missive
 */
const getPasswordResetTemplate = ({ name, otp }) => {
  const patronName = name || 'Noble Patron';
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Urban Maharaja — Password Reset Seal</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #120407;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #f7e6e9;
    }
    .wrapper {
      width: 100%;
      background-color: #120407;
      padding: 40px 16px;
      box-sizing: border-box;
    }
    .card {
      max-width: 520px;
      margin: 0 auto;
      background: linear-gradient(180deg, #240b12 0%, #170509 100%);
      border: 1px solid rgba(222, 107, 144, 0.35);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
    }
    .header {
      background: linear-gradient(135deg, rgba(222, 107, 144, 0.2) 0%, rgba(245, 197, 66, 0.15) 100%);
      padding: 32px 24px;
      text-align: center;
      border-bottom: 1px solid rgba(222, 107, 144, 0.25);
    }
    .crest {
      display: inline-block;
      width: 56px;
      height: 56px;
      line-height: 56px;
      border-radius: 16px;
      background: rgba(222, 107, 144, 0.2);
      border: 1px solid #de6b90;
      font-size: 28px;
      text-align: center;
      margin-bottom: 12px;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: #de6b90;
      margin: 0 0 4px 0;
    }
    .brand-subtitle {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #f5c542;
      margin: 0;
    }
    .content {
      padding: 36px 28px;
      text-align: center;
    }
    .heading {
      font-size: 22px;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 12px 0;
    }
    .message {
      font-size: 14px;
      line-height: 1.6;
      color: #c9b0b6;
      margin: 0 0 28px 0;
    }
    .seal-box {
      background: linear-gradient(135deg, rgba(245, 197, 66, 0.12) 0%, rgba(222, 107, 144, 0.12) 100%);
      border: 1px dashed rgba(245, 197, 66, 0.6);
      border-radius: 14px;
      padding: 24px 16px;
      margin: 0 auto 28px auto;
      max-width: 320px;
    }
    .seal-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 2.5px;
      color: #f5c542;
      margin-bottom: 8px;
      font-weight: 700;
    }
    .seal-code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 38px;
      font-weight: 800;
      letter-spacing: 8px;
      color: #ffffff;
      margin: 0;
      text-shadow: 0 2px 10px rgba(245, 197, 66, 0.4);
    }
    .expiry-note {
      font-size: 12px;
      color: #de6b90;
      margin-top: 10px;
      font-weight: 600;
    }
    .security-notice {
      font-size: 12px;
      line-height: 1.5;
      color: #8f747a;
      border-top: 1px solid rgba(222, 107, 144, 0.15);
      padding-top: 20px;
      margin: 0;
    }
    .footer {
      background-color: #0d0205;
      padding: 20px 24px;
      text-align: center;
      border-top: 1px solid rgba(222, 107, 144, 0.15);
    }
    .footer-text {
      font-size: 11px;
      color: #6d545a;
      margin: 0;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="crest">👑</div>
        <h1 class="brand-title">URBAN MAHARAJA</h1>
        <p class="brand-subtitle">DIGITAL MAHARAJA PORTAL</p>
      </div>

      <div class="content">
        <h2 class="heading">Royal Password Reset Seal</h2>
        <p class="message">
          Greetings, <strong>${patronName}</strong>.<br>
          We received an imperial petition to reset the secret passkey for your account. Please present the verification seal below:
        </p>

        <div class="seal-box">
          <div class="seal-label">Imperial Verification Seal</div>
          <div class="seal-code">${otp}</div>
          <div class="expiry-note">Valid for 15 minutes only</div>
        </div>

        <p class="security-notice">
          If you did not initiate this request, no action is required. Your royal credentials remain protected and secure within our imperial vaults.
        </p>
      </div>

      <div class="footer">
        <p class="footer-text">
          &copy; ${new Date().getFullYear()} Urban Maharaja Fine Dining. All royal rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;
};

/**
 * Send Password Reset OTP Email via Resend
 * 
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} [options.name] - Patron/Staff noble name
 * @param {string} options.otp - 6-digit verification seal
 * @returns {Promise<{ success: boolean, id?: string, error?: string }>}
 */
const sendPasswordResetEmail = async ({ to, name, otp }) => {
  const client = getResendClient();

  if (!client) {
    logger.warn(`Resend API key missing. Password reset seal for ${to} is [${otp}]`);
    return {
      success: false,
      error: 'Resend email client not configured with RESEND_API_KEY',
    };
  }

  try {
    const fromAddress = env.RESEND_FROM || 'Urban Maharaja <onboarding@resend.dev>';
    const subject = `👑 Urban Maharaja — Your Royal Password Reset Seal [${otp}]`;
    const html = getPasswordResetTemplate({ name, otp });
    const text = `Greetings ${name || 'Noble Patron'},\n\nYour royal password reset seal for Urban Maharaja is: ${otp}\n\nThis verification seal is valid for 15 minutes.\n\nIf you did not request this reset, your account remains secure.`;

    const response = await client.emails.send({
      from: fromAddress,
      to: [to],
      subject,
      html,
      text,
    });

    if (response.error) {
      logger.error('Resend email dispatch error:', response.error);
      return { success: false, error: response.error.message || 'Failed to dispatch email via Resend' };
    }

    logger.info(`Royal password reset email dispatched successfully to ${to} (id: ${response.data?.id})`);
    return { success: true, id: response.data?.id };
  } catch (error) {
    logger.error('Failed to send password reset email via Resend:', error);
    return { success: false, error: error.message };
  }
};

const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const BOOKING_COPY = {
  PENDING: { subject: 'We received your table request', line: 'We have received your table request. Our team will confirm it shortly.' },
  CONFIRMED: { subject: 'Your table is confirmed', line: 'Great news — your table is confirmed. We look forward to hosting you!' },
  CANCELLED: { subject: 'Your table booking was cancelled', line: 'Your table booking has been cancelled. Call us if you would like to rebook.' },
  COMPLETED: { subject: 'Thank you for dining with us', line: 'Thank you for dining at Urban Maharaja. We hope to see you again soon!' },
};

/**
 * Email a customer about their table booking status. Never throws.
 */
const sendBookingStatusEmail = async ({ to, name, status, date, time, guests, staffNote }) => {
  const client = getResendClient();
  const copy = BOOKING_COPY[status];
  if (!client || !to || !copy) return { success: false };

  try {
    const details = `${escapeHtml(date)} at ${escapeHtml(time)} · ${escapeHtml(guests)}`;
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;color:#2e1a14">
        <h2 style="color:#9b284e;margin:0 0 12px">Urban Maharaja</h2>
        <p>Hello ${escapeHtml(name || 'Guest')},</p>
        <p>${copy.line}</p>
        <p style="padding:12px 16px;background:#faf3eb;border-radius:10px"><strong>${details}</strong><br/>Status: <strong>${status}</strong></p>
        ${staffNote ? `<p><em>Note from our team:</em> ${escapeHtml(staffNote)}</p>` : ''}
        <p style="font-size:12px;color:#8a6e54">AC-209, Central Spine, Gyan Vihar Marg, Jagatpura, Jaipur · +91 94146 44988</p>
      </div>`;
    const response = await client.emails.send({
      from: env.RESEND_FROM || 'Urban Maharaja <onboarding@resend.dev>',
      to: [to],
      subject: `Urban Maharaja — ${copy.subject}`,
      html,
      text: `Hello ${name || 'Guest'},

${copy.line}

${date} at ${time} · ${guests}
Status: ${status}${staffNote ? `
Note: ${staffNote}` : ''}`,
    });
    if (response.error) {
      logger.warn('Booking email failed', { error: response.error.message });
      return { success: false };
    }
    return { success: true };
  } catch (error) {
    logger.warn('Booking email failed', { error: error.message });
    return { success: false };
  }
};

module.exports = {
  getResendClient,
  isEmailConfigured,
  sendPasswordResetEmail,
  sendBookingStatusEmail,
};
