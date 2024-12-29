import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log('Auth callback started');
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    console.log('Auth code received');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    try {
      console.log('Exchanging code for session...');
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Error exchanging code for session:', error);
        throw error;
      }

      if (!session?.user) {
        console.error('No user in session after exchange');
        throw new Error('No user in session');
      }

      console.log('Session obtained, user:', session.user.id);

    } catch (error) {
      console.error('Auth callback error:', error);
    }
  } else {
    console.log('No auth code received');
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/', requestUrl.origin));
}
