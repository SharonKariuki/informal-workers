'use client';

import { use } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function VerifyEmailPage({ params }) {
  const router = useRouter();
  const { token } = use(params); // 👈 unwrap params properly here

  const [status, setStatus] = useState({
    loading: true,
    success: false,
    message: '⏳ Verifying your email...',
  });

  useEffect(() => {
    if (!token) return;

    const verifyEmail = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/verify-email/${token}`);
        const data = await res.json();

        if (res.ok) {
          setStatus({
            loading: false,
            success: true,
            message: '✅ Email verified! Redirecting to login...',
          });
          setTimeout(() => router.push('/signin'), 4000);
        } else {
          setStatus({
            loading: false,
            success: false,
            message: `❌ Verification failed: ${data.message}`,
          });
        }
      } catch (err) {
        setStatus({
          loading: false,
          success: false,
          message: '❌ An unexpected error occurred.',
        });
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center animate-fade-in">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Email Verification</h2>

        {status.loading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-2" />
            <p>{status.message}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {status.success ? (
              <CheckCircle className="h-16 w-16 text-green-500 mb-2" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500 mb-2" />
            )}
            <p>{status.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
