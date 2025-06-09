import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

// Simple in-memory storage for demo
const userUsage = new Map();

export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user usage (default to free plan)
    const usage = userUsage.get(userId) || {
      count: 0,
      limit: 3,
      plan: 'free',
      resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    };

    return NextResponse.json(usage);
  } catch (error) {
    console.error('Usage check error:', error);
    return NextResponse.json({ error: 'Failed to check usage' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current usage
    const currentUsage = userUsage.get(userId) || {
      count: 0,
      limit: 3,
      plan: 'free',
      resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };

    // Increment usage count
    const newUsage = {
      ...currentUsage,
      count: currentUsage.count + 1,
      lastUsed: new Date()
    };

    userUsage.set(userId, newUsage);

    return NextResponse.json(newUsage);
  } catch (error) {
    console.error('Usage increment error:', error);
    return NextResponse.json({ error: 'Failed to update usage' }, { status: 500 });
  }
}