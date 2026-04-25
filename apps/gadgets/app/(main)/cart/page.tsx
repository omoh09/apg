"use client";

import Image from "next/image";
import { FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import { useCart } from "@/components/context/cartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";

export default function CartPage() {
  const { items, total, loading, updateQtyOptimistic } = useCart();
  const [updating, setUpdating] = useState<Record<number, boolean>>({});
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isLoggedIn = !!Cookies.get("apg_token");

  const handleCheckout = () => {
    if (!items.length) {
      toast.error("Your cart is empty");
      return;
    }

    if (isLoggedIn) {
      router.push("/checkout");
    } else {
      console.log("User not logged in, showing auth modal");
      // router.push("/login?redirect=/checkout");
      setShowAuthModal(true);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-lg font-medium">Loading cart…</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h4 className="text-3xl font-bold mb-4">Your Cart is Empty</h4>
        <p className="text-gray-600">Add items to your cart to continue.</p>
      </div>
    );
  }

  const handleUpdate = async (id: number, qty: number) => {
    setUpdating((p) => ({ ...p, [id]: true }));
    try {
      await updateQtyOptimistic(id, qty);
    } catch {
      toast.error("Failed to update cart");
    } finally {
      setUpdating((p) => ({ ...p, [id]: false }));
    }
  };

  return (
    <div className="container py-6">
      <h4 className="text-3xl font-bold mb-10">Your Cart Items</h4>

      <div className="space-y-8 divide-y">
        {items.map((item) => (
          <div key={item.id} className="flex gap-16 pb-8">
            <div className="relative w-84 h-60">
              <Image
                src={item.product.cover_photo?.url}
                alt={item.product.title}
                fill
                className="object-contain"
              />
            </div>

            <div className="flex-1">
              <div className="flex justify-between">
                <p className="text-2xl font-bold">{item.product.title}</p>

                <div className="flex gap-4 items-center">
                  <button
                    disabled={updating[item.id]}
                    onClick={() =>
                      handleUpdate(item.id, Number(item.quantity) - 1)
                    }
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    disabled={updating[item.id]}
                    onClick={() =>
                      handleUpdate(item.id, Number(item.quantity) + 1)
                    }
                  >
                    +
                  </button>

                  <button
                    onClick={() => handleUpdate(item.id, 0)}
                    className="text-red-500"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>

              <p className="mt-3 text-gray-600">
                {item.product.short_description}
              </p>

              <div className="mt-4 font-semibold text-xl">
                {item.subtotal.toFixed(2)} {item.product.currency}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
  <p className="text-2xl font-bold text-center lg:text-left">
    Total: {total.toFixed(2)} USD
  </p>

        <div className="flex flex-col gap-4 w-full lg:w-auto lg:flex-row">
          <Link
            href="/products"
            rel="noopener noreferrer"
            className="w-full lg:w-[250px] btn pryBtn btnBig text-center"
          >
            Continue Shopping
          </Link>

          <button
            onClick={handleCheckout}
            className="w-full lg:w-auto btn pryBtn px-8 py-3"
          >
            Proceed to Checkout
          </button>

          {showAuthModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-[90%] max-w-md text-center">
                <h2 className="text-xl font-semibold mb-2">
                  Continue to checkout
                </h2>
                <p className="text-gray-600 mb-6">
                  Sign in for a faster experience, or continue as a guest.
                </p>

                <div className="flex flex-col gap-3">
                  {/* Sign in */}
                  <button
                    onClick={() => router.push("/login?redirect=/checkout")}
                    className="btn pryBtn py-3"
                  >
                    Sign in to checkout
                  </button>

                  {/* Guest checkout */}
                  <button
                    onClick={() => router.push("/signup?redirect=/checkout")}
                    className="btn border py-3"
                  >
                    Checkout as guest
                  </button>

                  {/* Cancel */}
                  <button
                    onClick={() => setShowAuthModal(false)}
                    className="text-sm text-gray-500 mt-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
