'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-blue-50 px-4">
      <h1 className="text-3xl font-bold text-blue-800 mb-10">Welcome to KaziLink</h1>

      <div className="flex gap-6">
        <Link href="/signin">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
            Sign In
          </button>
        </Link>

        <Link href="/signup">
          <button className="px-6 py-3 bg-white border border-blue-600 text-blue-600 rounded-lg shadow hover:bg-blue-100 transition">
            Sign Up
          </button>
        </Link>
      </div>
    </main>
  );
}
