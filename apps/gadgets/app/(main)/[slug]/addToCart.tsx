"use client";
import React from "react";
import { addToCart } from "@/lib/calls/cartCalls";
import { useState } from "react";
import toast from "react-hot-toast";
import type { Product } from "@/lib/types/productTypes";
import { useCart } from "@/components/context/cartContext";

type AddToCartProps = {
  id: number;
  title: string;
};

function AddToCart({ id, title }: AddToCartProps) {
  const [loading, setLoading] = useState(false);
  const { refreshCart } = useCart();

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addToCart({ productId: id, quantity: 1 });
      await refreshCart();
      toast.success(`${title} added to cart`);
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(`Failed to add ${title} to cart`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleAddToCart();
        }}
        disabled={loading}
        className={`btn btnSmall pryBtn w-full sm:w-[134px] ${
          loading ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
}

export default AddToCart;
