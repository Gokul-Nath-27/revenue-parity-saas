"use server"
import { redirect } from "next/navigation";
import { getValidatedSession } from "@/lib/session";
import { getUserById } from '@/server/db/auth';
import { cache } from 'react';

export const getUser = cache(async (sessionId: string | null) => {
  console.log("Loading the current user");

  if (!sessionId) redirect('/');

  const session = await getValidatedSession(sessionId);
  if (!session?.id) redirect('/');

  const user = await getUserById(session.id);
  if (!user) redirect('/');

  return user;
});