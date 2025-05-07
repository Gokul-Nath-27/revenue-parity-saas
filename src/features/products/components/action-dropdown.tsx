"use client"
import { EllipsisVertical, Pencil } from 'lucide-react'
import Link from 'next/link'

import LinkStatus from '@/components/loading-indicator'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { DeleteProductModal } from "./delete-product-modal"

export function ProductActions({ id }: { id: string }) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Link href={`/dashboard/products/${id}?tab=site`} prefetch={false}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Pencil />
              Edit
              <LinkStatus />
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DeleteProductModal id={id} />
        </DropdownMenuContent>
      </DropdownMenu>
    </>

  )
}

