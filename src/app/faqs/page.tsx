"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronRight, ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  { q: "How do I place an order?", a: "Simply browse our products, click 'Order on WhatsApp' on any product, and send the message. Our team will confirm your order and arrange delivery." },
  { q: "What are your delivery charges?", a: "We offer FREE delivery on orders above Rs. 2,000. A small delivery fee may apply for orders below this amount." },
  { q: "How long does delivery take?", a: "We typically deliver within 2-3 business days. Same-day delivery is available for orders placed before 12 PM." },
  { q: "What payment methods do you accept?", a: "We accept Cash on Delivery (COD), JazzCash, EasyPaisa, and bank transfers." },
  { q: "Can I return a product?", a: "Yes, you can return products within 7 days of delivery if they are unopened and in original condition. Perishable items cannot be returned." },
  { q: "Do you deliver all over Lahore?", a: "Yes, we deliver across all areas of Lahore including Johar Town, DHA, Gulberg, Model Town, and more." },
  { q: "How do I track my order?", a: "Once your order is confirmed, you can track it via WhatsApp. Simply message us with your order details." },
  { q: "Are the products genuine?", a: "Yes! All our products are 100% genuine, sourced directly from authorized distributors and brands." },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium">FAQs</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="text-center mb-12">
            <HelpCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-gray-600">Find answers to common questions about our service</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
