"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, RotateCcw } from "lucide-react";

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium">Return Policy</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="text-center mb-12">
            <RotateCcw className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Return Policy</h1>
            <p className="text-gray-500">Last updated: July 2026</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Return Window</h2>
              <p className="text-gray-600 text-sm leading-relaxed">You may return most items within 7 days of delivery. Items must be unused, unopened, and in their original packaging.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Non-Returnable Items</h2>
              <p className="text-gray-600 text-sm leading-relaxed">The following items cannot be returned: perishable goods (fresh meat, dairy, fruits, vegetables), opened or used products, items without original packaging, and personal care products.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">How to Initiate a Return</h2>
              <p className="text-gray-600 text-sm leading-relaxed">Contact us via WhatsApp at 0304-4124129 with your order details and reason for return. Our team will guide you through the process.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Refund Process</h2>
              <p className="text-gray-600 text-sm leading-relaxed">Once we receive and inspect the returned item, we will process your refund within 3-5 business days. Refunds will be made via the original payment method or bank transfer.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Damaged or Wrong Items</h2>
              <p className="text-gray-600 text-sm leading-relaxed">If you receive a damaged or wrong item, contact us within 24 hours of delivery. We will arrange a free pickup and send the correct item or issue a full refund.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
