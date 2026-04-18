"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { verifyCheckout } from "@/lib/calls/checkout";
import { useCart } from "@/components/context/cartContext";

export default function CheckoutCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { clearCart } = useCart();

  const verifyPayment = async (reference: string, order_id: string) => {
    try {
      const res = await verifyCheckout({ reference, order_id });

    //   console.log("Verification response:", res);

      if (res.status !== "processing") {
        toast.error("Payment not completed");
        router.push("/checkout/failed");
        return;
      }

      // cleanup
      localStorage.removeItem("orderReference");
      localStorage.removeItem("orderId");
      localStorage.removeItem("checkoutSessionId");

      clearCart();

      router.push("/checkout/success");
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Verification failed";

        toast.error(message);
        router.push("/checkout/failed");
        }
  };

  useEffect(() => {
    const reference =
      params.get("orderReference") ||
      localStorage.getItem("orderReference");

    const order_id = localStorage.getItem("orderId");

    if (!reference || !order_id) {
      router.push("/checkout/failed");
      return;
    }

    verifyPayment(reference, order_id);
  }, [params, router]);

  return (
    <main className="flex items-center justify-center h-screen">
      <p>Verifying payment...</p>
    </main>
  );
}