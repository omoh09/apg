"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { addReview } from "@/lib/calls/userCalls";

type OrderStatus = "Delivered" | "Processing" | "Cancelled";

type Order = {
  id: number;
  product: {
    id: number;
    title: string;
    image: string;
    price: number;
    currency: string;
  };
  status: OrderStatus;
  ordered_at: string;
};

const ratingOptions = [
  {
    emoji: "😡",
    label: "Terrible",
    stars: 1,
    color: "bg-red-50 border-red-400",
  },
  {
    emoji: "😕",
    label: "Poor",
    stars: 2,
    color: "bg-orange-50 border-orange-400",
  },
  {
    emoji: "😐",
    label: "Okay",
    stars: 3,
    color: "bg-yellow-50 border-yellow-400",
  },
  {
    emoji: "🙂",
    label: "Good",
    stars: 4,
    color: "bg-green-50 border-green-400",
  },
  {
    emoji: "😍",
    label: "Excellent",
    stars: 5,
    color: "bg-emerald-50 border-emerald-500",
  },
];

export default function OrderCard({
  order,
  onAddToCart,
}: {
  order: Order;
  onAddToCart: (productId: number) => void;
}) {
  const [showTrack, setShowTrack] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState("");
  const selectedOption = ratingOptions.find((r) => r.stars === selectedRating);
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleBuyAgain = () => {
    onAddToCart(order.product.id);
    router.push("/cart");
  };

  const handleSendReview = async () => {
    if (!selectedRating) return;

    try {
      setSubmitting(true);

      const selectedOption = ratingOptions.find(
        (r) => r.stars === selectedRating
      );

      await addReview({
        product_id: order.product.id,
        order_id: order.id, // ⚠️ confirm if backend wants order_number instead
        rating: selectedRating,
        title: selectedOption?.label || "Review",
        review: reviewText,
      });

      toast.success("Thanks for your feedback!");

      setShowReview(false);
      setSelectedRating(null);
      setReviewText("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isDelivered = order.status === "Delivered";

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency || "NGN",
    }).format(price);
  };

  return (
    <div
      className={`w-full flex items-center gap-6 p-4 relative h-52 ${
        order.status === "Cancelled" ? "opacity-50 grayscale" : ""
      }`}
    >
      {/* Image */}
      <div className="relative h-full w-72 rounded-xl overflow-hidden bg-apgGrey">
        <Image
          src={order.product.image || "/placeholder.png"}
          alt={order.product.title}
          fill
          className="object-contain p-2"
        />
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between h-full tracking-tighter">
        <div>
          <h3 className="text-2xl font-bold">{order.product.title}</h3>
          <p className="text-sm text-greyText">
            {order.ordered_at} •{" "}
            {formatPrice(order.product.price, order.product.currency)}
          </p>
          <span
            className={`inline-block mt-1 px-3 py-1 text-xs rounded-full font-medium ${
              isDelivered
                ? "bg-green-100 text-green-700"
                : order.status === "Processing"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {order.status}
          </span>
        </div>

        {/* Buttons */}
        <div className="self-end flex flex-row gap-2 items-center">
          {isDelivered ? (
            <>
              <button
                onClick={handleBuyAgain}
                className="h-12 rounded-full flex items-center justify-center w-[120px] text-sm font-medium tracking-tighter bg-primary hover:bg-primary/80"
              >
                Buy Again
              </button>

              <button
                onClick={() => setShowReview(true)}
                className="h-12 rounded-full flex items-center justify-center w-[120px] text-sm font-medium tracking-tighter bg-blue-100 text-blue-700 hover:bg-blue-200"
              >
                Review
              </button>
            </>
          ) : order.status === "Processing" ? (
            <button
              onClick={() => setShowTrack(true)}
              className="h-12 rounded-full flex items-center justify-center w-[120px] text-sm font-medium tracking-tighter bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
            >
              Track
            </button>
          ) : null}
        </div>
      </div>

      {/* Track Modal */}
      {showTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="font-bold text-xl mb-4">Tracking Info</h3>
            <p>Order #{order.id} is currently in progress.</p>
            <button
              onClick={() => setShowTrack(false)}
              className="mt-4 px-4 py-2 bg-primary rounded-full text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl w-96 flex flex-col gap-5 shadow-2xl animate-fadeIn">
            <h3 className="font-bold text-xl text-center">
              How was this product?
            </h3>

            {/* Emoji Ratings */}
            <div className="flex justify-between">
              {ratingOptions.map((r) => (
                <button
                  key={r.stars}
                  onClick={() => setSelectedRating(r.stars)}
                  className={`text-3xl p-3 rounded-xl border-2 transition-all duration-200
              ${
                selectedRating === r.stars
                  ? `${r.color} scale-110 shadow-md`
                  : "border-transparent hover:scale-110 hover:bg-gray-100"
              }`}
                >
                  {r.emoji}
                </button>
              ))}
            </div>

            {/* Label Feedback */}
            {selectedOption && (
              <p className="text-center font-semibold text-gray-700 animate-fadeIn">
                {selectedOption.label} choice!
              </p>
            )}

            {/* Stars */}
            {selectedRating && (
              <div className="flex justify-center text-yellow-400 text-2xl tracking-wide">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="transition-all">
                    {i < selectedRating ? "★" : "☆"}
                  </span>
                ))}
              </div>
            )}

            {/* Review Box */}
            {selectedRating && (
              <div className="flex flex-col gap-2">
                <textarea
                  placeholder={`Tell us why it's ${selectedOption?.label.toLowerCase()}...`}
                  className="border rounded-lg p-3 resize-none focus:ring-2 focus:ring-primary outline-none"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  maxLength={300}
                />
                <span className="text-xs text-gray-400 self-end">
                  {reviewText.length}/300
                </span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowReview(false)}
                className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReview}
                disabled={!selectedRating || submitting}
                className="px-4 py-2 bg-primary text-white rounded-full disabled:opacity-40"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
