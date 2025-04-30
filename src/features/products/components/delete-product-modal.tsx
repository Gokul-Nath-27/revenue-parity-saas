"use client"

import { Trash, Trash2 } from "lucide-react"
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { deleteProduct } from "../actions"

export const DeleteProductModal = ({ id }: { id: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Trash />
          Delete
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this product? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DeleteProductButton id={id} />
        </DialogFooter>
      </DialogContent>
    </Dialog >
  )
}

const DeleteProductButton = ({ id }: { id: string }) => {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      type="submit"
      variant="destructive"
      disabled={isPending}
      onClick={() => startTransition(async () => {
        const { success, message } = await deleteProduct(id);
        toast[success ? "success" : "error"](message);
      })}
    >
      <Trash2 className="mr-2 h-4 w-4" />
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  )
}


