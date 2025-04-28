"use client"
import { Globe } from 'lucide-react';

export function DomainSettings() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Domain Settings</h3>
        <Globe className="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );
} 