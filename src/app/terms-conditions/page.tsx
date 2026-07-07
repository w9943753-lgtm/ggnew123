"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium">Terms & Conditions</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="text-center mb-12">
            <FileText className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms & Conditions</h1>
            <p className="text-gray-500">Last updated: July 2026</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">1. General</h2>
              <p className="text-gray-600 text-sm leading-relaxed">By using Hafiz Store&apos;s website and services, you agree to these terms and conditions. We reserve the right to modify these terms at any time.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">2. Orders</h2>
              <p className="text-gray-600 text-sm leading-relaxed">All orders are subject to product availability. We reserve the right to cancel any order if the product is out of stock or if there is a pricing error. Orders are confirmed via WhatsApp.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">3. Pricing</h2>
              <p className="text-gray-600 text-sm leading-relaxed">All prices are in Pakistani Rupees (PKR) and include applicable taxes. Prices may change without prior notice. Delivery charges may apply for orders below Rs. 2,000.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">4. Delivery</h2>
              <p className="text-gray-600 text-sm leading-relaxed">We aim to deliver within 2-3 business days. Delivery times may vary based on location and availability. Free delivery is offered on orders above Rs. 2,000.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">5. Payment</h2>
              <p className="text-gray-600 text-sm leading-relaxed">We accept Cash on Delivery (COD), JazzCash, EasyPaisa, and bank transfers. Payment must be made at the time of delivery for COD orders.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">6. Limitation of Liability</h2>
              <p className="text-gray-600 text-sm leading-relaxed">Hafiz Store shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
