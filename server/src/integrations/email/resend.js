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

module.exports = {
  getResendClient,
  isEmailConfigured,
  sendPasswordResetEmail,
};
