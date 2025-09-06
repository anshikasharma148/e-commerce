"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCartIcon, UserIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");

      // 👂 listen to changes in localStorage
      const handleStorageChange = () => {
        setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
      };
      window.addEventListener("storage", handleStorageChange);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");

    // 🔔 notify navbar about logout immediately
    window.dispatchEvent(new Event("storage"));

    window.location.href = "/auth/login";
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition"
        >
          ShopEase
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6 text-gray-700 font-medium">
          <Link href="/items" className="hover:text-blue-600 transition">
            Products
          </Link>

          <Link
            href="/cart"
            className="hover:text-blue-600 transition flex items-center gap-1"
          >
            <ShoppingCartIcon className="w-5 h-5" /> Cart
          </Link>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-red-600 hover:text-red-800 transition"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="hover:text-blue-600 transition flex items-center gap-1"
            >
              <UserIcon className="w-5 h-5" /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
