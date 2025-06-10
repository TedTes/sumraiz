import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/api/webhooks(.*)',
]);

export default clerkMiddleware((auth, request) => {
  // For public routes, just continue
  if (isPublicRoute(request)) {
    return;
  }

  // For protected routes, check if user is authenticated
  const { userId } = auth();
  
  if (!userId) {
    // Return 401 for API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    // For pages, let Clerk handle the sign-in modal
    // The client-side components will show the sign-in modal
    return;
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};