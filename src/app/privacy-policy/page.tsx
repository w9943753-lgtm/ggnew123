"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium">Privacy Policy</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="text-center mb-12">
            <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-gray-500">Last updated: July 2026</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Information We Collect</h2>
              <p className="text-gray-600 text-sm leading-relaxed">We collect information you provide directly, including your name, phone number, email address, and delivery address when you place an order or create an account.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">How We Use Your Information</h2>
              <p className="text-gray-600 text-sm leading-relaxed">We use your information to process orders, deliver products, communicate about your orders, improve our services, and send promotional offers (with your consent).</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Information Sharing</h2>
              <p className="text-gray-600 text-sm leading-relaxed">We do not sell or rent your personal information to third parties. We may share your information with delivery partners to fulfill your orders.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Data Security</h2>
              <p className="text-gray-600 text-sm leading-relaxed">We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Your Rights</h2>
              <p className="text-gray-600 text-sm leading-relaxed">You have the right to access, correct, or delete your personal information. Contact us at info@hafizstore.pk for any privacy-related requests.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Contact</h2>
              <p className="text-gray-600 text-sm leading-relaxed">For questions about this Privacy Policy, contact us at info@hafizstore.pk or call 0304-4124129.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
