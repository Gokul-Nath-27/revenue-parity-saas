"use client"
import { useFormStatus } from "react-dom";

import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";

const SubmitButton = ({ loadingText = "Saving...", text = "Save", disabled = false }) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      className={cn("w-full")}
      variant="default"
    >
      {pending ? loadingText : text}
    </Button>
  );
};

export default SubmitButton;