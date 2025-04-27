"use client"
import { Separator } from "@radix-ui/react-separator";

import { Button } from "@/components/ui/button";
import { oAuthSignIn } from "@/features/account/actions";

export default function OAuth() {
  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-2">
        <Button variant="outline" className="w-full" type="button" onClick={async () => await oAuthSignIn("google")}
        >
          Google
        </Button>
        <Button variant="outline" className="w-full" type="button" onClick={async () => await oAuthSignIn("github")}
        >
          GitHub
        </Button>
      </div>
    </>
  );
};