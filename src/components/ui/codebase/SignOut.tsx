"use client";

import { signoutAction } from "@/server-actions/auth";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";


export default function SignOut() {
  const [loading, setLoading] = useState(false);
  
  const handleSignOut = async () => {
    setLoading(true);
    const result = await signoutAction();
    setLoading(false);
    if (result instanceof Error) {
      toast.error(result.message);
    } else {
      toast.success("Sign out successfully");
      redirect("/");
    }
  };

  return (
    <button
      type="submit"
      className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      onClick={handleSignOut}
      disabled={loading}
    >
      Sign Out
    </button>
  );
}