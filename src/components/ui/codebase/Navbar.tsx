import React, { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/server-actions/auth';

export default function Navbar() {
  return (
    <header className="flex items-center justify-between w-full h-[64px]">
      <nav className="flex items-center justify-between w-full py-4">
        <Link href="/">
          <div className="text-lg font-bold">Easy Parity</div>
        </Link>
        <Button className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
          <Suspense fallback={<>Loading...</>}>
            <AuthAction />
          </Suspense>
        </Button>
      </nav>
    </header>
  )
};


const AuthAction = async () => {
  const user = await getCurrentUser()
  console.log(user)
  return user ? 'Sign Out' : 'Sign In';
} 