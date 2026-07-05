"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Trash2, Star, Filter } from "lucide-react";

interface Review {
  id: string;
  customer: string;
  product: string;
  rating: number;
  comment: string;
  date: string;
  approved: boolean;
}

const demoReviews: Review[] = [
  { id: "1", customer: "Ahmed Khan", product: "Premium Basmati Rice", rating: 5, comment: "Excellent quality rice. Very fragrant and long grains. Will order again!", date: "2024-01-15", approved: true },
  { id: "2", customer: "Fatima Ali", product: "Organic Honey", rating: 4, comment: "Good honey but packaging could be better.", date: "2024-01-14", approved: true },
  { id: "3", customer: "Muhammad Hassan", product: "Fresh Dates Box", rating: 5, comment: "Best dates I've ever had. Fresh and delicious!", date: "2024-01-13", approved: false },
  { id: "4", customer: "Ayesha Bibi", product: "Arabic Attar", rating: 3, comment: "Nice scent but fades quickly.", date: "2024-01-12", approved: false },
  { id: "5", customer: "Usman Sheikh", product: "Prayer Mat Premium", rating: 5, comment: "Very comfortable and well-made prayer mat.", date: "2024-01-11", approved: true },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(demoReviews);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const filteredReviews = reviews.filter((review) => {
    if (filter === "pending") return !review.approved;
    if (filter === "approved") return review.approved;
    return true;
  });

  const handleApprove = (id: string) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, approved: true } : r)));
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this review?")) {
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-500">Manage customer reviews</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "approved"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? "bg-green-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status === "pending" && (
              <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs">
                {reviews.filter((r) => !r.approved).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-xl shadow-sm border p-6 ${
              review.approved ? "border-gray-100" : "border-orange-200 bg-orange-50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-medium">
                    {review.customer.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{review.customer}</h3>
                    {!review.approved && (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">for {review.product}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-2">{review.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!review.approved && (
                  <button
                    onClick={() => handleApprove(review.id)}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Approve"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(review.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
