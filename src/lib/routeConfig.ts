export const publicExactPaths = ['/sign-in', '/sign-up']


export function isPublicPath(path: string) {
  return publicExactPaths.includes(path)
} 


export const validRoutes = [
  '/',                             
  '/sign-in',                      
  '/sign-up',
  '/forgot-password',
  '/reset-password',
  '/coming-soon',
  '/not-found',

  '/dashboard',
  '/dashboard/analytics',
  '/dashboard/products',
  /^\/dashboard\/products\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/,
  '/dashboard/subscription',

  /^\/api\/oauth\/[^/]+$/,
  /^\/api\/products\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/banner$/,
  '/api/webhook/stripe',
]

// Check if a path matches any of the valid routes (including regex patterns)
export function isValidRoute(path: string): boolean {
  return validRoutes.some(route => {
    if (typeof route === 'string') {
      return route === path;
    } else {
      return (route as RegExp).test(path);
    }
  });
}


export const privatePaths = [
  '/dashboard',
  '/dashboard/analytics',
  '/dashboard/products',
  '/dashboard/subscription',
]

export function isPrivatePath(path: string) {
  return privatePaths.includes(path)
}
