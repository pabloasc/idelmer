import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createOrUpdateUser } from '@/services/userService';

export async function GET(request: Request) {
  console.log('Auth callback started');
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    console.log('Auth code received');
    const cookieStore = cookies();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: { path: string; maxAge: number }) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: { path: string }) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
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
      console.log('Creating/updating user in database...');
      const user = await createOrUpdateUser(session.user);
      console.log('User created/updated successfully:', user.id);

    } catch (error) {
      console.error('Auth callback error:', error);
    }
  } else {
    console.log('No auth code received');
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/', requestUrl.origin));
}
