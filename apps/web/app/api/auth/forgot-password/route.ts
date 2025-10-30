import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseServer';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabase = await createServerClient(true); // Use service role for password reset

    // Use Supabase Auth to generate reset token and send email
    // Note: Configure Supabase to use Resend SMTP for custom email templates
    // See docs/PASSWORD_RESET_SETUP.md for configuration instructions
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    });

    if (error) {
      console.error('Supabase password reset error:', error);
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        message: 'If that email exists, a password reset link has been sent.',
      });
    }

    // Supabase automatically sends the reset email
    // To use Resend templates, configure Supabase SMTP settings (see docs/PASSWORD_RESET_SETUP.md)
    return NextResponse.json({
      message: 'If that email exists, a password reset link has been sent.',
    });
  } catch (err) {
    console.error('Error in forgot password:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

