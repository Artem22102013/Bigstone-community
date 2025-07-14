'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';

type UserContextType = {
  userAvatar: string | null;
  username: string | null;
};

const UserContext = createContext<UserContextType>({
  userAvatar: null,
  username: null,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAvatar() {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.provider_token;
      if (!token) return;

      const res = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const user = await res.json();

      let avatarUrl;
      if (user.avatar) {
        const isGif = user.avatar.startsWith('a_');
        avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${isGif ? 'gif' : 'png'}`;
      } else {
        const fallbackIndex = parseInt(user.discriminator || '0') % 5;
        avatarUrl = `https://cdn.discordapp.com/embed/avatars/${fallbackIndex}.png`;
      }

      setUserAvatar(avatarUrl);
      setUsername(user.username);
    }

    fetchAvatar();
  }, []);

  return (
    <UserContext.Provider value={{ userAvatar, username }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
