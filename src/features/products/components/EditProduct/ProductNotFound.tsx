import { CircleAlert } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ProductNotFound() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Site Configuration</h2>
        <p className="text-muted-foreground">Configure your site settings</p>
      </div>

      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-background to-background opacity-80"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--destructive-rgb),0.1),transparent_50%)]"></div>
        <CardContent className="relative z-10 p-6">
          <div className="flex items-center gap-2 text-destructive mb-4">
            <CircleAlert className="w-4 h-4" />
            <h3 className="font-semibold">Product Not Found</h3>
          </div>
          <p className="text-destructive mb-4">{"We couldn't find a product with ID:"}</p>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              This could be because:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>The product has been deleted</li>
              <li>The product ID is incorrect</li>
              <li>{"You don't have permission to access this product"}</li>
            </ul>
            <div className="flex gap-4 pt-4">
              <Button asChild variant="default">
                <Link href="/dashboard">View All Products</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
