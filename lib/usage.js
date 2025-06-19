import  prisma  from './prisma';

export async function getUserUsage(userId) {
  let user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: { usage: true }
  });
  if (!user) {
    // Create new user
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
  } else if (!user.usage) {
    // Create usage for existing user
    user.usage = await prisma.usage.create({
      data: {
        userId: user.id,
        count: 0,
        limit: 3,
        resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });
  }

  return {
    count: user.usage.count,
    limit: user.usage.limit,
    plan: user.plan,
    resetDate: user.usage.resetDate
  };
}

export async function incrementUserUsage(userId) {
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: { usage: true }
  });

  if (user?.usage) {
    await prisma.usage.update({
      where: { id: user.usage.id },
      data: { count: { increment: 1 } }
    });
  }
}

export async function checkUsageLimit(userId) {
  const usage = await getUserUsage(userId);
  
  if (usage.count >= usage.limit && usage.plan === 'free') {
    throw new Error('Usage limit reached. Please upgrade to Pro for unlimited summaries.');
  }
  
  return usage;
}