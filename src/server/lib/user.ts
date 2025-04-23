"use server"
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSessionIdFromCookie, getValidatedSession } from "@/server/lib/session";
import { getUserById } from '@/server/db/auth';

export const getUser = cache(async () => {
  console.log("Loading the current user");

  const sessionId = await getSessionIdFromCookie();
  if (!sessionId) return redirect('/');

  const session = await getValidatedSession(sessionId);
  if (!session?.id) return redirect('/');

  const user = await getUserById(session.id);
  if (!user) return redirect('/');

  return user;
});