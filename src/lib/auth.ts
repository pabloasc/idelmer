import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const getUser = async () => {
  const cookieStore = cookies();
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  // Get session from cookie
  const supabaseAuthToken = cookieStore.get('sb-access-token')?.value;
  
  try {
    if (!supabaseAuthToken) {
      return null;
    }

    const { data: { user }, error } = await supabase.auth.getUser(supabaseAuthToken);
    
    if (error || !user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};
