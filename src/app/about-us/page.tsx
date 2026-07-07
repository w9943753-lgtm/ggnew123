"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, MapPin, Phone, Mail, Clock, Truck, Shield, Heart, Users } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium">About Us</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About Hafiz Store</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your trusted neighborhood grocery store, now online. We bring fresh, quality groceries right to your doorstep in Lahore.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Hafiz Store was born from a simple idea: making quality groceries accessible to everyone in Lahore. Located in the heart of Johar Town, we have been serving the community with fresh produce, premium products, and exceptional service.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Now, we bring that same commitment to quality and service online. With Hafiz Store, you can browse hundreds of products, place orders via WhatsApp, and get them delivered right to your door. No complicated checkout, no hidden fees — just great groceries at great prices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Fast Delivery</h3>
                <p className="text-sm text-gray-600">Same-day delivery across Lahore. Free delivery on orders above Rs. 2,000.</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Quality Guarantee</h3>
                <p className="text-sm text-gray-600">Every product is quality-checked. 100% genuine products from authorized distributors.</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Customer First</h3>
                <p className="text-sm text-gray-600">Your satisfaction is our priority. Easy ordering via WhatsApp with personal service.</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Community Trust</h3>
                <p className="text-sm text-gray-600">Serving Lahore families with honesty and integrity. Building relationships, not just transactions.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">Visit Our Store</h2>
            <p className="text-green-100 mb-4">Come see us at our physical location in Johar Town, Lahore</p>
            <div className="flex items-center justify-center gap-2 text-green-100">
              <MapPin className="w-4 h-4" />
              <span>Shadewal Johar Town, Near Beacon House School, Lahore</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
