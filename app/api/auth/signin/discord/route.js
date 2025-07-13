// src/web/app/api/auth/signin/discord/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseURL = 'https://ghxenimntsyqxpgrunfr.supabase.co/auth/v1/authorize';
  const provider = 'discord';
  const redirectTo = encodeURIComponent('https://community.bigstone.ovh/auth/callback'); // change for prod

  const url = `${supabaseURL}?provider=${provider}&redirect_to=${redirectTo}`;
  return NextResponse.redirect(url);
}
