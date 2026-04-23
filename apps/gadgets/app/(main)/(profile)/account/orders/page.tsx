"use client";

import { useEffect, useState } from "react";
import OrderCard from "@/components/ui/orderCard";
import { useRouter } from "next/navigation";
import { getOrders } from "@/lib/calls/userCalls";

type OrderStatus = "Delivered" | "Processing" | "Cancelled";

type Order = {
  id: number;
  order_number: string;
  product_id: number;
  product_title: string;
  status: OrderStatus;
  total: string;
  created_at: string | null;
  cover_photo?: {
    url: string;
  };
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<OrderStatus | "All">("All");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const formatDate = (date: string | null) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrders();
        const rawOrders = res?.data?.data || res?.data || [];

        const mappedOrders: Order[] = rawOrders.map((order: any) => {
          const snapshot = order.cart_snapshot?.[0];

          return {
            id: order.id,
            order_number: order.order_number,

            product_id: Number(order.product_id || snapshot?.product_id),

            product_title:
              order.product_title ||
              snapshot?.name || // might be null
              "Unknown Product",

            status: mapOrderStatus(order.status),

            total: order.total || snapshot?.total_price?.toString() || "0",

            created_at: order.created_at,

            cover_photo: order.cover_photo || {
              url: "/placeholder.png",
            },
          };
        });

        setOrders(mappedOrders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders =
    activeTab === "All" ? orders : orders.filter((o) => o.status === activeTab);

  const handleAddToCart = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading orders…</p>;
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        {["All", "Delivered", "Processing", "Cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as OrderStatus | "All")}
            className={`px-4 py-2 rounded-full font-medium ${
              activeTab === tab
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="flex flex-col gap-4">
        {filteredOrders.length ? (
          filteredOrders.map((order, idx) => (
            <OrderCard
              key={order.id}
              order={{
                id: order.id,
                product: {
                  id: order.product_id,
                  title: order.product_title,
                  image: order.cover_photo?.url || "",
                  price: Number(order.total),
                  currency: "NGN", // or from backend later
                },
                status: order.status,
                ordered_at: order.created_at
                  ? formatDate(order.created_at)
                  : "N/A",
              }}
              onAddToCart={handleAddToCart}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No orders found.</p>
        )}
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

const mapOrderStatus = (status: string): OrderStatus => {
  switch (status) {
    case "completed":
      return "Delivered";
    case "pending":
    case "processing":
    case "paid":
      return "Processing";
    case "cancelled":
      return "Cancelled";
    default:
      return "Processing";
  }
};
