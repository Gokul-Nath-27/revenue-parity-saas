"use server"
import { redirect } from "next/navigation";
import { getValidatedSession } from "@/server/lib/session";
import { getUserById } from '@/server/db/auth';

export const getUser = async (sessionId: string | null) => {
  "use cache"
  console.log("Loading the current user");

  if (!sessionId) return redirect('/');

  const session = await getValidatedSession(sessionId);
  if (!session?.id) return redirect('/');

  const user = await getUserById(session.id);
  if (!user) return redirect('/');

  return user;
};