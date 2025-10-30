// Resend email client
// Note: Requires RESEND_API_KEY environment variable

const RESEND_API_KEY = process.env.RESEND_API_KEY;

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email send');
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Aquivis <onboarding@aquivis.com>', // TODO: Update domain
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend API error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Email templates

export async function sendWelcomeEmail(to: string, name: string): Promise<boolean> {
  return sendEmail({
    to,
    subject: 'Welcome to Aquivis!',
    html: `
      <h1>Welcome to Aquivis, ${name}!</h1>
      <p>Thanks for signing up. You're all set to start managing your pool service business.</p>
      <p>Get started by:</p>
      <ul>
        <li>Completing your company profile</li>
        <li>Adding your first property</li>
        <li>Inviting team members</li>
      </ul>
      <p>Need help? Contact our support team.</p>
    `,
  });
}

export async function sendTeamInvitationEmail(to: string, inviterName: string, companyName: string, inviteLink: string): Promise<boolean> {
  return sendEmail({
    to,
    subject: `You've been invited to join ${companyName} on Aquivis`,
    html: `
      <h1>You've been invited!</h1>
      <p>${inviterName} has invited you to join ${companyName} on Aquivis.</p>
      <p><a href="${inviteLink}">Accept Invitation</a></p>
      <p>This invitation will expire in 7 days.</p>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, resetLink: string): Promise<boolean> {
  return sendEmail({
    to,
    subject: 'Reset your Aquivis password',
    html: `
      <h1>Password Reset Request</h1>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetLink}">Reset Password</a></p>
      <p>If you didn't request this, you can ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
    `,
  });
}

