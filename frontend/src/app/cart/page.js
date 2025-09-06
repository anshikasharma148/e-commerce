"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);

      if (!loggedIn) {
        router.push("/auth/login?redirect=/cart");
      }
      setLoading(false);
    }
  }, [router]);

  if (loading) return null;
  if (!isLoggedIn) return null;

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold">🛒 Cart</h1>
      <p className="mt-4 text-gray-600">This is your cart.</p>
    </div>
  );
}
