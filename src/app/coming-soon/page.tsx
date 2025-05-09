import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Coming Soon - RevenueParity',
  description: 'New features and sections coming soon!',
};

export default function ComingSoon() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-black text-white px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-bold mb-4">🚧 Coming Soon</h1>
        <p className="text-lg mb-6">
          We&apos;re working on this section. Stay tuned for something awesome!
        </p>
        <Link
          href="/"
          className="inline-block bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
