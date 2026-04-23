import { apiFetch } from "@/lib/api/api";

// Get user profile
export async function getUserProfile() {
  return apiFetch("/api/user", {
    method: "GET",
    withCredentials: true,
  });
}

// Update user profile
export async function updateUserProfile(data: {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  billing_house_number?: string;
  billing_street?: string;
  billing_city?: string;
  billing_state?: string;
  billing_landmark?: string;
}) {
  return apiFetch("/api/user/profile", {
    method: "PUT",
    body: JSON.stringify(data),
    withCredentials: true,
  });
}

// Get user wishlist
export async function getWishlist() {
  return apiFetch("/api/favorites", {
    method: "GET",
    withCredentials: true,
  });
}

// Add product to wishlist
export async function addToWishlist(productId: string) {
  return apiFetch(`/api/products/${productId}/favorite`, {
    method: "POST",
    withCredentials: true,
  });
}

// Remove product from wishlist
export async function removeFromWishlist(productId: string) {
  return apiFetch(`/api/products/${productId}/favorite`, {
    method: "DELETE",
    withCredentials: true,
  });
}

// Get user Orders
export async function getOrders(page = 1) {
  return apiFetch(`/api/orders?page=${page}`, {
    method: "GET",
    withCredentials: true,
  });
}

// Get user reviews
export async function getMyReviews() {
  return apiFetch("/api/myreviews", {
    method: "GET",
    withCredentials: true,
  });
}

// Add a review
export async function addReview(data: {
  product_id: number;
  order_id: number;
  rating: number;
  title: string;
  review: string;
}) {
  return apiFetch("/api/reviews", {
    method: "POST",
    body: JSON.stringify(data),
    withCredentials: true,
  });
}
