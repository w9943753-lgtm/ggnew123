"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle, Store } from "lucide-react";

export default function VerifyEmailPage() {
  const [isResent, setIsResent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResend = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setIsResent(true);
    setTimeout(() => setIsResent(false), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-orange-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-xl shadow-green-100/50 border border-green-100/50 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#16A34A] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-200">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Verify Your Email</h1>
            <p className="text-gray-500 mt-1 text-center">
              We&apos;ve sent a verification link to your email address
            </p>
          </div>

          <div className="text-center py-6">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-12 h-12 text-[#16A34A]" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Check Your Inbox</h2>
            <p className="text-gray-500 mb-6">
              Please click the verification link in the email we sent to confirm your account. If
              you don&apos;t see it, check your spam folder.
            </p>

            <button
              onClick={handleResend}
              disabled={isLoading}
              className="w-full py-3 bg-[#16A34A] hover:bg-green-600 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Resend Verification Email"
              )}
            </button>

            {isResent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center justify-center gap-2 text-sm text-[#16A34A] font-medium"
              >
                <CheckCircle className="w-4 h-4" />
                Verification email sent successfully!
              </motion.div>
            )}
          </div>

          <Link
            href="/login"
            className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
