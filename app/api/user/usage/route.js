import { NextResponse } from 'next/server';
import { getUserUsage } from '../../../../lib/usage';
import { auth } from '@clerk/nextjs/server';
export async function GET() {
    let authResult;
    try {
      authResult = await auth();
    } catch (error) {
      // If await fails, try sync version
      authResult = auth();
    }
    const { userId } = authResult || {};

  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const usage = await getUserUsage(userId);
  return NextResponse.json(usage);
}