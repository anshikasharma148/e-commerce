"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  Filter, 
  X, 
  Star, 
  ChevronDown,
  Plus,
  Minus,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const dummyProducts = [
  { 
    id: 1, 
    name: "Wireless Headphones", 
    price: 59, 
    originalPrice: 79,
    rating: 4.5,
    reviewCount: 124,
    image: "https://via.placeholder.com/300", 
    category: "electronics",
    featured: true
  },
  { 
    id: 2, 
    name: "Smartwatch Series 5", 
    price: 120, 
    originalPrice: 149,
    rating: 4.2,
    reviewCount: 89,
    image: "https://via.placeholder.com/300", 
    category: "electronics",
    featured: false
  },
  { 
    id: 3, 
    name: "DSLR Camera Pro", 
    price: 450, 
    originalPrice: 499,
    rating: 4.8,
    reviewCount: 67,
    image: "https://via.placeholder.com/300", 
    category: "electronics",
    featured: true
  },
  { 
    id: 4, 
    name: "Bluetooth Speaker", 
    price: 80, 
    originalPrice: 99,
    rating: 4.3,
    reviewCount: 156,
    image: "https://via.placeholder.com/300", 
    category: "audio",
    featured: false
  },
  { 
    id: 5, 
    name: "Gaming Mouse", 
    price: 35, 
    originalPrice: 49,
    rating: 4.1,
    reviewCount: 202,
    image: "https://via.placeholder.com/300", 
    category: "accessories",
    featured: false
  },
  { 
    id: 6, 
    name: "27\" 4K Monitor", 
    price: 299, 
    originalPrice: 349,
    rating: 4.6,
    reviewCount: 78,
    image: "https://via.placeholder.com/300", 
    category: "electronics",
    featured: true
  },
  { 
    id: 7, 
    name: "Mechanical Keyboard", 
    price: 75, 
    originalPrice: 99,
    rating: 4.4,
    reviewCount: 142,
    image: "https://via.placeholder.com/300", 
    category: "accessories",
    featured: false
  },
  { 
    id: 8, 
    name: "Noise Cancelling Earbuds", 
    price: 129, 
    originalPrice: 159,
    rating: 4.7,
    reviewCount: 211,
    image: "https://via.placeholder.com/300", 
    category: "audio",
    featured: true
  },
];

const categories = ["All", "electronics", "audio", "accessories"];
const priceRanges = [
  { id: 1, range: "Under $50" },
  { id: 2, range: "$50 - $100" },
  { id: 3, range: "$100 - $200" },
  { id: 4, range: "$200 & Above" }
];

export default function ProductsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceFilter, setPriceFilter] = useState(null);
  const [sortBy, setSortBy] = useState("featured");
  const [cartNotification, setCartNotification] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);

      // Load cart and wishlist from localStorage
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      
      setCartItems(savedCart);
      setWishlist(savedWishlist);

      if (!loggedIn) {
        router.push("/auth/login?redirect=/items");
      }
      setLoading(false);
    }
  }, [router]);

  // Save cart and wishlist to localStorage when they change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    
    // Show notification
    setCartNotification(true);
    setTimeout(() => setCartNotification(false), 2000);
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(cartItems.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  const toggleWishlist = (product) => {
    if (wishlist.some(item => item.id === product.id)) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const getFilteredProducts = () => {
    let filtered = dummyProducts.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Price filter
    if (priceFilter) {
      switch(priceFilter) {
        case 1:
          filtered = filtered.filter(p => p.price < 50);
          break;
        case 2:
          filtered = filtered.filter(p => p.price >= 50 && p.price < 100);
          break;
        case 3:
          filtered = filtered.filter(p => p.price >= 100 && p.price < 200);
          break;
        case 4:
          filtered = filtered.filter(p => p.price >= 200);
          break;
        default:
          break;
      }
    }

    // Sorting
    switch(sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // featured
        filtered.sort((a, b) => b.featured - a.featured);
        break;
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
  
  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">ShopNow</h1>
          
          <div className="relative flex-1 max-w-xl mx-4">
            <div className="flex items-center border rounded-full px-4 py-2 shadow-sm bg-gray-50">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ml-2 w-full outline-none bg-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Filter className="w-6 h-6" />
            </button>
            
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
              
              {/* Cart dropdown */}
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl p-4 hidden group-hover:block">
                <h3 className="font-semibold mb-2">Your Cart</h3>
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
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <p className="font-semibold">Total: ${cartTotal.toFixed(2)}</p>
                      <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm">
                        Checkout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center mb-4 md:mb-0 px-4 py-2 bg-white rounded-lg shadow-sm"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {selectedCategory !== "All" || priceFilter ? (
              <span className="ml-2 bg-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                1+
              </span>
            ) : null}
          </button>

          <div className="flex items-center">
            <span className="mr-2 text-gray-600">Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white rounded-lg shadow-sm"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-lg shadow-sm p-4 mb-8 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Category</h4>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category} className="flex items-center">
                        <input
                          type="radio"
                          id={category}
                          name="category"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="mr-2"
                        />
                        <label htmlFor={category} className="capitalize">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Price Range</h4>
                  <div className="space-y-2">
                    {priceRanges.map(range => (
                      <div key={range.id} className="flex items-center">
                        <input
                          type="radio"
                          id={`price-${range.id}`}
                          name="price"
                          checked={priceFilter === range.id}
                          onChange={() => setPriceFilter(priceFilter === range.id ? null : range.id)}
                          className="mr-2"
                        />
                        <label htmlFor={`price-${range.id}`}>
                          {range.range}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button 
                  onClick={() => {
                    setSelectedCategory("All");
                    setPriceFilter(null);
                  }}
                  className="text-sm text-gray-600 underline"
                >
                  Clear all filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {dummyProducts.length} products
          </p>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found. Try adjusting your filters.</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          >
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.originalPrice && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </span>
                    )}
                    <button 
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
                    >
                      <Heart 
                        className={`w-5 h-5 ${wishlist.some(item => item.id === product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                      />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">
                      {product.name}
                    </h2>
                    
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <p className="text-lg font-bold text-gray-900">${product.price}</p>
                        {product.originalPrice && (
                          <p className="text-sm text-gray-500 line-through">${product.originalPrice}</p>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => addToCart(product)}
                        className="flex items-center gap-1 bg-gray-900 text-white py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Cart Notification */}
      <AnimatePresence>
        {cartNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            Item added to cart!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}