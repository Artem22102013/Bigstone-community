import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  const body = await req.json();
  const { targetUserId, makeAdmin } = body;

  if (!targetUserId || typeof makeAdmin !== 'boolean') {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { error } = await supabase
    .from('user_profiles')
    .update({ admin: makeAdmin })
    .eq('id', targetUserId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
