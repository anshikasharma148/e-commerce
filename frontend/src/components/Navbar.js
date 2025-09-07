"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  ShoppingCart, 
  User, 
  Search,
  Heart,
  Trash2
} from "lucide-react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
      
      // Load cart from localStorage
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(savedCart);

      // 👂 Listen to custom cart update events
      const handleCartUpdate = () => {
        const updatedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(updatedCart);
      };
      
      // Listen to both storage events and custom cart-updated events
      window.addEventListener("storage", handleCartUpdate);
      window.addEventListener("cart-updated", handleCartUpdate);

      return () => {
        window.removeEventListener("storage", handleCartUpdate);
        window.removeEventListener("cart-updated", handleCartUpdate);
      };
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");

    // 🔔 notify navbar about logout immediately
    window.dispatchEvent(new Event("storage"));

    window.location.href = "/auth/login";
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    
    // Notify other components
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("cart-updated"));
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/items?search=${encodeURIComponent(searchQuery)}`;
    }
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

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4">
          <div className="flex items-center border rounded-full px-4 py-2 shadow-sm bg-gray-50">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-2 w-full outline-none bg-transparent"
            />
          </div>
        </form>

        {/* Nav Links */}
        <div className="flex items-center gap-6 text-gray-700 font-medium">
          <Link href="/items" className="hover:text-blue-600 transition">
            Products
          </Link>

          <Link
            href="/wishlist"
            className="hover:text-blue-600 transition flex items-center gap-1"
          >
            <Heart className="w-5 h-5" /> Wishlist
          </Link>

          <div className="relative group">
            <Link
              href="/cart"
              className="hover:text-blue-600 transition flex items-center gap-1 relative"
            >
              <ShoppingCart className="w-5 h-5" /> Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            {/* Cart dropdown on hover */}
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl p-4 border hidden group-hover:block z-50">
              <h3 className="font-semibold mb-2">Your Cart ({cartItemCount} items)</h3>
              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-sm">Your cart is empty</p>
              ) : (
                <>
                  <div className="max-h-60 overflow-y-auto">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center py-2 border-b">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">${item.price} x {item.quantity}</p>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            removeFromCart(item.id);
                          }}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <p className="font-semibold">Total: ${cartTotal.toFixed(2)}</p>
                    <Link 
                      href="/cart" 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      onClick={() => setShowCartDropdown(false)}
                    >
                      Checkout
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

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
              <User className="w-5 h-5" /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}