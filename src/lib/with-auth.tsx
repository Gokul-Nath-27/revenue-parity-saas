import { redirect } from "next/navigation";

import { getSessionIdFromCookie, getValidatedSession } from "./session";

/**
 * A higher-order function that wraps a callback with authentication checks.
 * 
 * @template TReturn - The return type of the callback function
 * @template TArgs - The argument types of the callback function
 * @param cb - The callback function that requires an authenticated user ID
 * @returns A function that handles authentication and executes the callback
 */
export function withAuthUserId<TReturn, TArgs extends unknown[]>(
  cb: (userId: string, ...args: TArgs) => Promise<TReturn>
): (...args: TArgs) => Promise<TReturn> {
  
  return async (...args: TArgs): Promise<TReturn> => {
    // Get session ID from cookie
    const sessionId = await getSessionIdFromCookie();
    if (!sessionId) {
      redirect('/sign-in?not-authorized=true');
    }

    // Validate the session and get user
    const user = await getValidatedSession(sessionId);
    if (!user) {
      redirect('/sign-in?not-authorized=true');
    }

    // Execute the callback with the authenticated user's ID
    return cb(user.id, ...args);
  };
}
