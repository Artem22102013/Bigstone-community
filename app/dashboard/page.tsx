'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
      } else {
        router.push('/auth/login');
      }
    });
  }, [router]);

  if (!user) return <p>Loading user info...</p>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Congrats, {user.user_metadata?.name || user.email}, you got furthest anyone has in the maintenance mode!</h1>
      <button
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
        onClick={async () => {
          await supabase.auth.signOut();
          router.push('/auth/login');
        }}
      >
        Sign out
      </button>
    </main>
  );
}
