/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useCart } from "@/components/context/cartContext";
import { CheckoutForm } from "./checkoutLayout";
import { initiateCheckout, verifyCheckout } from "@/lib/calls/checkout";
import { loadCartIdFromStorage } from "@/components/context/cartContext";
import { useRouter } from "next/navigation";

type Props = {
  form: CheckoutForm;
};

export default function CheckoutSummary({ form }: Props) {
  const { items, total, cartId, refreshCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const ensureCartId = async () => {
    if (cartId) return cartId;
    await refreshCart();
    const freshId = loadCartIdFromStorage();
    if (!freshId) throw new Error("Cart not initialized");
    return freshId;
  };

  // const loadPaystackScript = () =>
  //   new Promise<void>((resolve) => {
  //     if (window.PaystackPop) return resolve();

  //     const script = document.createElement("script");
  //     script.src = "https://js.paystack.co/v1/inline.js";
  //     script.async = true;
  //     script.onload = () => resolve();

  //     document.body.appendChild(script);
  //   });

  const placeOrder = async () => {
    if (!items.length) {
      toast.error("Your cart is empty");
      return;
    }

    if (!form.first_name || !form.phone || !form.billing_city) {
      toast.error("Please complete your checkout details");
      return;
    }

    setLoading(true);

    try {
      // await loadPaystackScript();
      const id = await ensureCartId();
      const payload = { ...form, cart_id: id };
      const res = await initiateCheckout(payload);

      // const { amount, email, public_key, reference, order_id } =
      //   res || res?.data;

      const { reference, payment_url, order_id } =
        res || res?.data;

      console.log("Checkout response:", res);

      if (!payment_url) {
        toast.error("Failed to get payment link");
        return;
      }

      const sessionId = Date.now().toString();
      const currentSession = sessionId;
      localStorage.setItem("checkoutSessionId", sessionId);
      localStorage.setItem("orderReference", reference);
      localStorage.setItem("checkoutStarted", "true");
      localStorage.setItem("orderId", order_id.toString());

      // window.location.href = payment_url;
      const width = 600;
      const height = 800;

      const left = window.screenX + (window.innerWidth - width) / 2;
      const top = window.screenY + (window.innerHeight - height) / 2;

      const popup = window.open(
        payment_url,
        "payment",
        `width=${width},height=${height},left=${left},top=${top}`
      );
      // localStorage.setItem("orderReference", reference);

      const interval = setInterval(() => {
        if (popup?.closed) {
          clearInterval(interval);

          const storedSession = localStorage.getItem("checkoutSessionId");

          if (storedSession !== currentSession) return;

          const ref = localStorage.getItem("orderReference");
          const order_id = localStorage.getItem("orderId");

          if (!ref) return

          verifyPayment(ref, order_id as any);
          // if (ref) {
          //   verifyPayment(ref, order_id as any);
          // }
        }
      }, 1000);

      // const paystackEmail = form.email || email;
      // if (!paystackEmail) {
      //   toast.error("Email is required to proceed with payment");
      //   return;
      // }

      // const handler = window.PaystackPop.setup({
      //   key: public_key,
      //   email: paystackEmail,
      //   amount: Math.round(amount), // already kobo
      //   reference,
      //   metadata: {
      //     order_id,
      //     cart_id: id,
      //   },

        // ✅ MUST be sync
        // callback: function (response: any) {
        //   verifyPayment(response.reference, order_id);
        // },

        // onClose: function () {
        //   toast.error("Payment cancelled");
        // },
      // });

      // handler.openIframe();
    } catch (err: any) {
      toast.error(err?.message || "Failed to initiate checkout");
    } finally {
      setLoading(false);
    }
  };

  const clearCheckoutStorage = () => {
    localStorage.removeItem("checkoutSessionId");
    localStorage.removeItem("orderReference");
    localStorage.removeItem("orderId");
    localStorage.removeItem("checkoutStarted");
  };

  const verifyPayment = async (
    reference: string,
    order_id: number | string
  ) => {
    try {
      const verifyRes = await verifyCheckout({
        reference,
        order_id,
      });
      console.log("Verification response:", verifyRes);
      clearCheckoutStorage();

      if (verifyRes.status !== "processing") {
        toast.error("Payment not completed");
        return;
      }

      toast.success("Payment verified!");
      clearCart();
      router.push("/checkout/success");
    } catch (err: any) {
      toast.error(err?.message || "Verification failed");
    }
  };

  return (
    <aside className="card sticky top-24 h-fit">
      <h4 className="section-title">Order Summary</h4>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>
              {item.product.title} × {item.quantity}
            </span>
            <span>{item.subtotal.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t mt-4 pt-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{total.toFixed(2)} USD</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{form.shipping.toFixed(2)} USD</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>{form.tax.toFixed(2)} USD</span>
        </div>
        <div className="flex justify-between font-semibold border-t pt-2">
          <span>Total</span>
          <span>{(total + form.shipping + form.tax).toFixed(2)} USD</span>
        </div>
      </div>

      <button
        disabled={loading}
        onClick={placeOrder}
        className="btn pryBtn btnSmall w-full mt-6 disabled:opacity-50"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </aside>
  );
}
