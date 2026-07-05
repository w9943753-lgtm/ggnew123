"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Globe, Camera, Play, Send } from "lucide-react";
import { SITE_NAME, SITE_URL } from "@/constants";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      {/* Newsletter */}
      <div className="bg-secondary">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">Subscribe to Our Newsletter</h3>
              <p className="text-white/80 text-sm">Get exclusive deals, offers & updates straight to your inbox!</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-80 h-12 px-4 rounded-l-xl text-sm focus:outline-none"
              />
              <button className="px-6 h-12 bg-accent text-white font-semibold rounded-r-xl hover:bg-accent-dark transition-colors flex items-center gap-2">
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Subscribe</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{SITE_NAME}</h3>
                <p className="text-xs text-gray-400">Quality Groceries</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Your trusted online grocery store in Pakistan. We deliver fresh, quality groceries right to your doorstep at the best prices.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
                <Camera className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
                <Play className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {["About Us", "Contact", "FAQs", "Terms & Conditions", "Privacy Policy", "Return Policy", "Track Order"].map((link) => (
                <li key={link}>
                  <Link href={`/${link.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`} className="text-sm hover:text-secondary transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold mb-4">Top Categories</h4>
            <ul className="space-y-2.5">
              {["Fresh Vegetables", "Fresh Fruits", "Meat & Fish", "Dairy & Eggs", "Snacks", "Beverages", "Cooking Essentials", "Personal Care"].map((cat) => (
                <li key={cat}>
                  <Link href={`/category/${cat.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`} className="text-sm hover:text-secondary transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <p className="text-sm">Main Market, Lahore, Punjab, Pakistan</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-secondary flex-shrink-0" />
                <p className="text-sm">+92 300 0000000</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary flex-shrink-0" />
                <p className="text-sm">info@hafizstore.pk</p>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-secondary flex-shrink-0" />
                <p className="text-sm">Mon - Sun: 8:00 AM - 11:00 PM</p>
              </div>
            </div>

            <div className="mt-4">
              <h5 className="text-white font-medium text-sm mb-2">We Accept</h5>
              <div className="flex items-center gap-2 flex-wrap">
                {["COD", "JazzCash", "EasyPaisa", "Card"].map((method) => (
                  <span key={method} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          <p className="text-xs text-gray-500">Made with love in Pakistan</p>
        </div>
      </div>
    </footer>
  );
}
