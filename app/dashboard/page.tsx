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
      <h1 className="text-2xl font-bold">
        Congrats, {displayName}, you got furthest anyone has in the maintenance mode!
      </h1>
      <button
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
        onClick={async () => {
          await supabase.auth.signOut();
          router.push('/auth/login');
        }}
      >
        Sign out
      </button>
    <div className="p-4">
      {userAvatar && (
        <img
          src={userAvatar}
          alt="Discord Avatar"
          className="w-16 h-16 rounded-full mb-2"
        />
      )}
      <p className="text-lg">Hello, {username || "loading..."}</p>
    </div>
    </main>
  );
}
