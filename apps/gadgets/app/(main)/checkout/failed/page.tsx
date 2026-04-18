"use client";

import Link from "next/link";

export default function CheckoutFailedPage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-3xl font-bold mb-4 text-red-600">
        Payment Failed
      </h1>

      <p className="mb-6 max-w-md">
        Your payment was not completed. This could be due to cancellation,
        insufficient funds, or a network issue.
      </p>

      <div className="flex gap-4">
        <Link
          href="/checkout"
          className="btn pryBtn px-6 py-2 rounded hover:opacity-80"
        >
          Try Again
        </Link>

        <Link
          href="/"
          className="px-6 py-2 rounded border border-gray-300 hover:bg-gray-100"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}