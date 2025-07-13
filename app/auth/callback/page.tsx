'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session) {
          router.push('/dashboard');
        } else {
          // If no session, redirect to login}
          router.push('/login');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        router.push('/login');
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Authenticating...</p>
    </div>
  );
}