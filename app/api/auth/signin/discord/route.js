// src/web/app/api/auth/signin/discord/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  const url = `https://discord.com/oauth2/authorize?client_id=1391809353933127810&response_type=code&redirect_uri=https%3A%2F%2Fcommunity.bigstone.ovh%2Fauth%2Fcallback&scope=identify+email`;
  return NextResponse.redirect(url);
}
