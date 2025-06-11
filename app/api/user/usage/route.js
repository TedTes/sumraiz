import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// Simple in-memory storage for demo
export async function GET() {
  try {
      // Try both sync and async versions of auth()
      let authResult;
      try {
        authResult = await auth();
      } catch (error) {
        // If await fails, try sync version
        authResult = auth();
      }
    const { userId } = authResult || {};
    console.log("🔍 Usage GET - userId:", userId);
    console.log("🔍 Usage GET - auth result:", authResult);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user usage (default to free plan)
    let user = await prisma.user.findUnique({
      where: { clerkUserId:userId },
      include:{usage:true}
    });
    let usage = {};
    if(!user) {
        // Create new user first
        user = await prisma.user.create({
          data: {
            clerkUserId: userId,
            plan: 'free',
            usage: {
              create: {
                count: 0,
                limit: 3,
                resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              }
            }
          },
          include: { usage: true }
        });
        usage = user.usage;
    } else if (!user.usage) {
          // Create usage record for existing user
          usage = await prisma.usage.create({
          data: {
          userId: user.id,
          count: 0,
          limit: 3,
          resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
          });
    } else {
      usage = user.usage;
    }
    console.log("✅ Returning usage for user:", userId, usage);
    const usageData = {
      count: usage.count,
      limit: usage.limit,
      plan: user.plan,
      resetDate: usage.resetDate
    };
    return NextResponse.json(usageData);
  } catch (error) {
    console.error('❌ Usage check error:', error);
    return NextResponse.json({ error: 'Failed to check usage' }, { status: 500 });
  }
}

export async function POST() {
  try {
     // Try both sync and async versions of auth()
     let authResult;
     try {
       authResult = await auth();
     } catch (error) {
       // If await fails, try sync version
       authResult = auth();
     }
     const { userId } = authResult || {};
     console.log("🔍 Usage POST - userId:", userId);
    if (!userId) {
      console.log("❌ No userId in usage POST route");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current usage
    let user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: { usage: true }
    });
    if (!user) {
      // Create new user with usage
      user = await prisma.user.create({
        data: {
          clerkUserId: userId,
          plan: 'free',
          usage: {
            create: {
              count: 1,
              limit: 3,
              resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              lastUsed: new Date()
            }
          }
        },
        include: { usage: true }
      });
    } else if (!user.usage) {
      // Create usage for existing user
      await prisma.usage.create({
        data: {
          userId: user.id,
          count: 1,
          limit: 3,
          resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          lastUsed: new Date()
        }
      });
      // Refetch to get updated data
      user = await prisma.user.findUnique({
        where: { clerkUserId: userId },
        include: { usage: true }
      });
    }  else {
      // Update existing usage
      await prisma.usage.update({
        where: { userId: user.id },
        data: {
          count: { increment: 1 },
          lastUsed: new Date()
        }
      });
      // Refetch to get updated data
      user = await prisma.user.findUnique({
        where: { clerkUserId: userId },
        include: { usage: true }
      });
    }

    const newUsage = {
      count: user.usage.count,
      limit: user.usage.limit,
      plan: user.plan,
      resetDate: user.usage.resetDate,
      lastUsed: user.usage.lastUsed
    };

    console.log("✅ Updated usage for user:", userId, newUsage);
    return NextResponse.json(newUsage);
  } catch (error) {
   console.error('❌ Usage increment error:', error);
    return NextResponse.json({ error: 'Failed to update usage' }, { status: 500 });
  }
}