# Password Reset Setup with Resend

## Overview

The password reset flow uses Supabase Auth's built-in reset functionality with Resend for email delivery. This provides:
- Secure token generation by Supabase
- Custom email templates via Resend SMTP
- Standard Supabase password reset handling

## Configuration Options

### Option 1: Resend SMTP (Recommended)

Configure Supabase to use Resend's SMTP for all auth emails:

1. **Get Resend SMTP Credentials**:
   - Go to Resend Dashboard > Settings > SMTP
   - Enable SMTP and copy credentials

2. **Configure Supabase SMTP**:
   - Go to Supabase Dashboard > Authentication > Providers > Email
   - Scroll to "SMTP Settings"
   - Enable "Custom SMTP"
   - Enter Resend SMTP credentials:
     - **Host**: `smtp.resend.com`
     - **Port**: `587` (or `465` for SSL)
     - **Username**: `resend`
     - **Password**: Your Resend API key
     - **Sender email**: `Aquivis <onboarding@aquivis.com>`
     - **Sender name**: `Aquivis`

3. **Customize Email Template**:
   Tamplate In Supabase Dashboard > Authentication > Email Templates
   - Select "Reset Password" template
   - Customize the HTML to match your brand
   - Use Supabase template variables:
     - `{{ .ConfirmationURL }}` - The reset link
     - `{{ .Email }}` - User's email
     - `{{ .Token }}` - Reset token (if needed)

### Option 2: Full Custom Flow (Advanced)

If you need complete control over the email template and sending, you can implement a custom flow:

1. **Disable Supabase Email Sending**:
   - Set `disable_signup` or customize the flow
   - Create your own password reset token generation

2. **Implement Custom Token Generation**:
   - Create `password_reset_tokens` table
   - Generate secure tokens on your server
   - Store tokens with expiration (e.g., 1 hour)

3. **Send via Resend**:
   - Use the existing `sendPasswordResetEmail` function
   - Include the custom token in the reset link

4. **Validate and Reset**:
   - Create API route to validate tokens
   - Use Supabase Admin API to reset password

**Note**: This approach is more complex and requires additional security considerations. The SMTP approach (Option 1) is recommended for most use cases.

## Current Implementation

The current implementation (`/api/auth/forgot-password`) uses Supabase's built-in `resetPasswordForEmail`:

- ✅ Secure token generation
- ✅ Token expiration (1 hour)
- ✅ Automatic email sending
- ⚠️ Email template customization via Supabase Dashboard (if using SMTP)

## Testing

1. Navigate to `/forgot-password`
2. Enter a registered email address
3. Check email inbox for reset link
4. Click reset link and set new password
5. Verify you can log in with new password

## Security Considerations

- Reset tokens expire after 1 hour
- Tokens are single-use (invalidated after password reset)
- Email existence is not revealed (security through obscurity)
- HTTPS required for reset links in production

## Future Enhancements

- [ ] Rate limiting on reset requests (prevent abuse)
- [ ] Custom email template with Resend (if full custom flow implemented)
- [ ] Reset link tracking/analytics
- [ ] Multi-factor authentication for password resets

