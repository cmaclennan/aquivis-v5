import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseServer';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
    const { company_name, timezone } = await req.json();
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return new NextResponse('Unauthorized', { status: 401 });

    const supabaseSr = await createServerClient(true);

    // get user to attach profile/company
    const { data: jwt } = await supabaseSr.auth.getUser(token);
    const userId = jwt.user?.id;
    const userEmail = (jwt.user as any)?.email as string | undefined;
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    // create company with audit trail
    const { data: company, error: cErr } = await supabaseSr.from('companies')
        .insert({ name: company_name, timezone, created_by: userId })
        .select('*').single();
    if (cErr) return new NextResponse(cErr.message, { status: 400 });

    // upsert profile with audit trail (trigger will automatically update JWT claims)
    const { data: profile, error: pErr } = await supabaseSr.from('profiles')
        .upsert({ id: userId, company_id: company.id, role: 'owner', email: userEmail, created_by: userId })
        .select('first_name, last_name')
        .single();
    if (pErr) return new NextResponse(pErr.message, { status: 400 });

    // Send welcome email (don't block on failure)
    if (userEmail) {
        const userName = profile?.first_name || userEmail.split('@')[0];
        sendWelcomeEmail(userEmail, userName).catch(err => {
            console.error('Failed to send welcome email:', err);
        });
    }

    return NextResponse.json({ ok: true });
}


