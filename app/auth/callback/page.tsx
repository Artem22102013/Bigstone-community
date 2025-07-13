'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        router.push('/auth/login');
      } else {
        router.push('/dashboard');
      }
    };

    checkSession();

    // Optional: subscribe to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/dashboard');
      }
      if (event === 'SIGNED_OUT') {
        router.push('/auth/login');
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Authenticating...</p>
    </div>
  );
}
