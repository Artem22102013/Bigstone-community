'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { useUser } from '@/context/userContext';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { userAvatar, username } = useUser();

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

  const rawName = user.user_metadata?.name || user.email || '';
  const displayName = rawName.endsWith('#0') ? rawName.slice(0, -2) : rawName;

  return (
    <main className="p-6">
      <p>Your displayName is: {displayName}</p>
      <p>Your email is: {user.email}</p>
      <p>Your ID is: {user.id}</p>
      <p>Your username is: {username}</p>
      <p>Your avatar is: 
        <img src={userAvatar || '/default-avatar.png'} alt="User Avatar" className="w-16 h-16 rounded-full" />
      </p>

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
