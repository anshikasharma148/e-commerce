"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);

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

      if (!loggedIn) {
        router.push("/auth/login?redirect=/cart");
      }
      setLoading(false);

      return () => {
        window.removeEventListener("storage", handleCartUpdate);
        window.removeEventListener("cart-updated", handleCartUpdate);
      };
    }
  }, [router]);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    const updatedCart = cartItems.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity } 
        : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    
    // Notify other components
    window.dispatchEvent(new CustomEvent("cart-updated"));
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    
    // Notify other components
    window.dispatchEvent(new CustomEvent("cart-updated"));
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
  
  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/items" 
            className="flex items-center text-blue-600 hover:text-blue-800 transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Your Shopping Cart</h1>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link 
              href="/items" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow divide-y">
                {cartItems.map(item => (
                  <div key={item.id} className="p-6 flex items-center">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="ml-6 flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-gray-600">${item.price}</p>
                      
                      <div className="flex items-center mt-3">
                        <div className="flex items-center border rounded-md">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 text-gray-600 hover:bg-gray-100"
                            type="button"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 py-1">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 text-gray-600 hover:bg-gray-100"
                            type="button"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="ml-6 text-red-500 hover:text-red-700 flex items-center"
                          type="button"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItemCount} items)</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${(cartTotal * 0.08).toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${(cartTotal * 1.08).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                  Proceed to Checkout
                </button>
                
                <div className="mt-4 text-center">
                  <Link 
                    href="/items" 
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}