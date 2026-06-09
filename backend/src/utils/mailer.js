const nodemailer = require('nodemailer');

// Retrieve SMTP settings from environment
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || '"PetSphere Support" <no-reply@petsphere.com>';

// Check if SMTP is configured
const isSmtpConfigured = !!(SMTP_HOST && SMTP_USER && SMTP_PASS);

let transporter = null;
if (isSmtpConfigured) {
  try {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
    console.log('📧 Mailer: SMTP transporter successfully initialized.');
  } catch (error) {
    console.error('❌ Mailer: Failed to initialize SMTP transporter:', error.message);
  }
} else {
  console.log('ℹ️ Mailer: SMTP settings not configured. Mailer will run in SIMULATOR mode.');
}

/**
 * Sends an appointment confirmation email.
 * Falls back to console simulation if SMTP is not configured.
 * Does not throw errors to prevent breaking the API flow on email failure.
 */
async function sendAppointmentConfirmationEmail({
  userEmail,
  userName,
  petName,
  vetName,
  date,
  time,
  type,
  notes,
}) {
  const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : 'N/A';

  const consultationType = type ? type.charAt(0).toUpperCase() + type.slice(1) : 'In-person';

  // Plain text email content
  const textContent = `
Hello ${userName || 'Pet Owner'},

Your appointment has been successfully fixed on PetSphere!

Appointment Details:
------------------------------------------
🐾 Pet Name:        ${petName || 'Your Pet'}
🩺 Veterinarian:    ${vetName || 'Specialist'}
📅 Date:            ${formattedDate}
⏰ Time:            ${time || 'N/A'}
💻 Consultation:    ${consultationType}
📝 Notes:           ${notes || 'None'}
------------------------------------------

Thank you for choosing PetSphere!
If you need to reschedule or cancel, please visit your appointments dashboard.

Best regards,
The PetSphere Team
  `.trim();

  // Premium HTML email content
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Confirmed - PetSphere</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f6f9fc;
      margin: 0;
      padding: 0;
      color: #333333;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      border: 1px solid #eef2f5;
    }
    .header {
      background: linear-gradient(135deg, #4f46e5, #6366f1);
      padding: 30px 20px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .header p {
      margin: 5px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 30px 40px;
    }
    .greeting {
      font-size: 18px;
      margin-bottom: 20px;
      color: #1e293b;
    }
    .intro {
      font-size: 15px;
      line-height: 1.6;
      color: #4b5563;
      margin-bottom: 30px;
    }
    .details-card {
      background-color: #f8fafc;
      border-left: 4px solid #4f46e5;
      padding: 20px;
      border-radius: 0 8px 8px 0;
      margin-bottom: 30px;
    }
    .detail-row {
      display: flex;
      margin-bottom: 12px;
      font-size: 15px;
    }
    .detail-row:last-child {
      margin-bottom: 0;
    }
    .detail-label {
      width: 140px;
      font-weight: 600;
      color: #64748b;
    }
    .detail-value {
      flex: 1;
      color: #0f172a;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      background-color: #e0e7ff;
      color: #4f46e5;
    }
    .footer {
      background-color: #f8fafc;
      padding: 20px 40px;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      border-top: 1px solid #f1f5f9;
    }
    .footer a {
      color: #4f46e5;
      text-decoration: none;
    }
    @media (max-width: 600px) {
      .email-container {
        margin: 20px 10px;
      }
      .content {
        padding: 20px;
      }
      .detail-row {
        flex-direction: column;
      }
      .detail-label {
        width: 100%;
        margin-bottom: 4px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Appointment Fixed!</h1>
      <p>Your visit is booked successfully</p>
    </div>
    <div class="content">
      <div class="greeting">Hello ${userName || 'Pet Owner'},</div>
      <p class="intro">Great news! Your pet care appointment has been scheduled and confirmed. Here are the full details of your upcoming appointment:</p>
      
      <div class="details-card">
        <div class="detail-row">
          <div class="detail-label">🐾 Pet Name</div>
          <div class="detail-value">${petName || 'Your Pet'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">🩺 Veterinarian</div>
          <div class="detail-value">${vetName || 'Specialist'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">📅 Date</div>
          <div class="detail-value">${formattedDate}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">⏰ Time</div>
          <div class="detail-value">${time || 'N/A'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">💻 Type</div>
          <div class="detail-value"><span class="badge">${consultationType}</span></div>
        </div>
        ${notes ? `
        <div class="detail-row">
          <div class="detail-label">📝 Notes</div>
          <div class="detail-value">${notes}</div>
        </div>
        ` : ''}
      </div>

      <p class="intro" style="margin-bottom: 10px;">Please make sure to arrive or log on a few minutes prior to your appointment time.</p>
      <p class="intro">Need to make changes? You can easily manage or reschedule this appointment anytime from your dashboard on PetSphere.</p>
    </div>
    <div class="footer">
      <p>This is an automated email from PetSphere. Please do not reply directly to this message.</p>
      <p>© 2026 PetSphere Inc. All rights reserved. | <a href="http://localhost:3000">Visit PetSphere</a></p>
    </div>
  </div>
</body>
</html>
  `;

  // Try sending via SMTP if transporter exists
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: SMTP_FROM,
        to: userEmail,
        subject: `Appointment Confirmed for ${petName || 'your pet'} - PetSphere`,
        text: textContent,
        html: htmlContent,
      });
      console.log(`📧 Mailer: Email sent successfully! MessageId: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Mailer: Error occurred while sending email:', error.message);
      // Fallback to console simulator if SMTP sending failed
      logSimulatedEmail({ userEmail, textContent });
      return { success: false, error: error.message };
    }
  } else {
    // Simulator Mode
    logSimulatedEmail({ userEmail, textContent });
    return { success: true, simulated: true };
  }
}

function logSimulatedEmail({ userEmail, textContent }) {
  console.log('\n==================================================');
  console.log('               [EMAIL SIMULATOR]');
  console.log(`To: ${userEmail}`);
  console.log('Subject: Appointment Confirmed - PetSphere');
  console.log('--------------------------------------------------');
  console.log(textContent);
  console.log('==================================================\n');
}

async function sendGroomingConfirmationEmail({
  userEmail,
  userName,
  petName,
  groomerName,
  serviceTitle,
  price,
  date,
  notes,
}) {
  const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : 'N/A';

  // Plain text email content
  const textContent = `
Hello ${userName || 'Pet Owner'},

Your grooming appointment has been successfully fixed on PetSphere!

Grooming Appointment Details:
------------------------------------------
🐾 Pet Name:        ${petName || 'Your Pet'}
✂️ Groomer:         ${groomerName || 'Groomer'}
🛁 Service:         ${serviceTitle || 'Grooming Service'}
💵 Price:           $${price || '0.00'}
📅 Date & Time:     ${formattedDate}
📝 Notes:           ${notes || 'None'}
------------------------------------------

Thank you for choosing PetSphere!
If you need to reschedule or cancel, please visit your appointments dashboard.

Best regards,
The PetSphere Team
  `.trim();

  // Premium HTML email content
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Grooming Appointment Confirmed - PetSphere</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f6f9fc;
      margin: 0;
      padding: 0;
      color: #333333;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      border: 1px solid #eef2f5;
    }
    .header {
      background: linear-gradient(135deg, #10b981, #059669);
      padding: 30px 20px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .header p {
      margin: 5px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 30px 40px;
    }
    .greeting {
      font-size: 18px;
      margin-bottom: 20px;
      color: #1e293b;
    }
    .intro {
      font-size: 15px;
      line-height: 1.6;
      color: #4b5563;
      margin-bottom: 30px;
    }
    .details-card {
      background-color: #f8fafc;
      border-left: 4px solid #10b981;
      padding: 20px;
      border-radius: 0 8px 8px 0;
      margin-bottom: 30px;
    }
    .detail-row {
      display: flex;
      margin-bottom: 12px;
      font-size: 15px;
    }
    .detail-row:last-child {
      margin-bottom: 0;
    }
    .detail-label {
      width: 140px;
      font-weight: 600;
      color: #64748b;
    }
    .detail-value {
      flex: 1;
      color: #0f172a;
    }
    .footer {
      background-color: #f8fafc;
      padding: 20px 40px;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      border-top: 1px solid #f1f5f9;
    }
    .footer a {
      color: #10b981;
      text-decoration: none;
    }
    @media (max-width: 600px) {
      .email-container {
        margin: 20px 10px;
      }
      .content {
        padding: 20px;
      }
      .detail-row {
        flex-direction: column;
      }
      .detail-label {
        width: 100%;
        margin-bottom: 4px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Grooming Appt Fixed!</h1>
      <p>Your session is booked successfully</p>
    </div>
    <div class="content">
      <div class="greeting">Hello ${userName || 'Pet Owner'},</div>
      <p class="intro">Great news! Your pet grooming appointment has been scheduled and confirmed. Here are the details:</p>
      
      <div class="details-card">
        <div class="detail-row">
          <div class="detail-label">🐾 Pet Name</div>
          <div class="detail-value">${petName || 'Your Pet'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">✂️ Groomer</div>
          <div class="detail-value">${groomerName || 'Groomer'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">🛁 Service</div>
          <div class="detail-value">${serviceTitle || 'Grooming Service'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">💵 Price</div>
          <div class="detail-value">$${price || '0.00'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">📅 Date & Time</div>
          <div class="detail-value">${formattedDate}</div>
        </div>
        ${notes ? `
        <div class="detail-row">
          <div class="detail-label">📝 Notes</div>
          <div class="detail-value">${notes}</div>
        </div>
        ` : ''}
      </div>

      <p class="intro" style="margin-bottom: 10px;">Please make sure to arrive or prepare your pet a few minutes prior to the appointment time.</p>
      <p class="intro">Need to make changes? You can easily manage or reschedule this appointment anytime from your dashboard on PetSphere.</p>
    </div>
    <div class="footer">
      <p>This is an automated email from PetSphere. Please do not reply directly to this message.</p>
      <p>© 2026 PetSphere Inc. All rights reserved. | <a href="http://localhost:3000">Visit PetSphere</a></p>
    </div>
  </div>
</body>
</html>
  `;

  // Try sending via SMTP if transporter exists
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: SMTP_FROM,
        to: userEmail,
        subject: `Grooming Appointment Confirmed for ${petName || 'your pet'} - PetSphere`,
        text: textContent,
        html: htmlContent,
      });
      console.log(`📧 Mailer: Grooming email sent successfully! MessageId: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Mailer: Error occurred while sending grooming email:', error.message);
      logSimulatedEmail({ userEmail, textContent });
      return { success: false, error: error.message };
    }
  } else {
    // Simulator Mode
    logSimulatedEmail({ userEmail, textContent });
    return { success: true, simulated: true };
  }
}

module.exports = {
  sendAppointmentConfirmationEmail,
  sendGroomingConfirmationEmail,
};
