// src/app/api/discord/avatar/route.ts
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  const accessToken = session?.provider_token;
  if (!accessToken) {
    return NextResponse.json({ error: 'No Discord token found' }, { status: 401 });
  }

  // Fetch user data from Discord
  const discordRes = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!discordRes.ok) {
    return NextResponse.json({ error: 'Failed to fetch Discord profile' }, { status: 500 });
  }

  const user = await discordRes.json();

  let avatarUrl: string;

  if (user.avatar) {
    const isGif = user.avatar.startsWith('a_');
    avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${isGif ? 'gif' : 'png'}`;
  } else {
    const fallbackIndex = parseInt(user.discriminator || '0') % 5;
    avatarUrl = `https://cdn.discordapp.com/embed/avatars/${fallbackIndex}.png`;
  }

  return NextResponse.json({ avatarUrl, username: user.username });
}
