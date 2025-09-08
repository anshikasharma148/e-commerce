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
  Trash2,
  Sparkles
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
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop", 
    category: "electronics",
    featured: true,
    colors: ["#3B82F6", "#10B981", "#F59E0B"]
  },
  { 
    id: 2, 
    name: "Smartwatch Series 5", 
    price: 120, 
    originalPrice: 149,
    rating: 4.2,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop", 
    category: "electronics",
    featured: false,
    colors: ["#EF4444", "#8B5CF6", "#0EA5E9"]
  },
  { 
    id: 3, 
    name: "DSLR Camera Pro", 
    price: 450, 
    originalPrice: 499,
    rating: 4.8,
    reviewCount: 67,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop", 
    category: "electronics",
    featured: true,
    colors: ["#000000", "#6366F1", "#78716C"]
  },
  { 
    id: 4, 
    name: "Bluetooth Speaker", 
    price: 80, 
    originalPrice: 99,
    rating: 4.3,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&h=500&fit=crop", 
    category: "audio",
    featured: false,
    colors: ["#06B6D4", "#EC4899", "#F97316"]
  },
  { 
    id: 5, 
    name: "Gaming Mouse", 
    price: 35, 
    originalPrice: 49,
    rating: 4.1,
    reviewCount: 202,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop", 
    category: "accessories",
    featured: false,
    colors: ["#3B82F6", "#1E293B", "#EF4444"]
  },
  { 
    id: 6, 
    name: "27\" 4K Monitor", 
    price: 299, 
    originalPrice: 349,
    rating: 4.6,
    reviewCount: 78,
    image: "https://images.unsplash.com/photo-1546538915-a9e2c8d6a5b7?w=500&h=500&fit=crop", 
    category: "electronics",
    featured: true,
    colors: ["#0EA5E9", "#64748B", "#000000"]
  },
  { 
    id: 7, 
    name: "Mechanical Keyboard", 
    price: 75, 
    originalPrice: 99,
    rating: 4.4,
    reviewCount: 142,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop", 
    category: "accessories",
    featured: false,
    colors: ["#06B6D4", "#8B5CF6", "#F97316"]
  },
  { 
    id: 8, 
    name: "Noise Cancelling Earbuds", 
    price: 129, 
    originalPrice: 159,
    rating: 4.7,
    reviewCount: 211,
    image: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=500&h=500&fit=crop", 
    category: "audio",
    featured: true,
    colors: ["#10B981", "#3B82F6", "#F59E0B"]
  },
];

const categories = ["All", "electronics", "audio", "accessories"];
const priceRanges = [
  { id: 1, range: "Under $50" },
  { id: 2, range: "$50 - $100" },
  { id: 3, range: "$100 - $200" },
  { id: 4, range: "$200 & Above" }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const hoverEffect = {
  scale: 1.03,
  rotate: 0.5,
  boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
  transition: {
    type: "spring",
    stiffness: 300
  }
};

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

  // ✅ Load login + cart state from localStorage
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

  // ✅ Listen for cart updates from other components
  useEffect(() => {
    const handleCartUpdate = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(updatedCart);
    };
    
    window.addEventListener("cart-updated", handleCartUpdate);
    
    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);

  // ✅ Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // ✅ FIXED: Add to Cart - Always read from localStorage first
  const addToCart = (product) => {
    // Always read the latest cart from localStorage to ensure we have the most current state
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = currentCart.findIndex(item => item.id === product.id);
    let updatedCart;
    
    if (existingItemIndex !== -1) {
      // Item exists, update quantity
      updatedCart = [...currentCart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + 1
      };
    } else {
      // Item doesn't exist, add new item
      updatedCart = [...currentCart, { ...product, quantity: 1 }];
    }
    
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    
    // Notify other components
    window.dispatchEvent(new CustomEvent("cart-updated"));
    
    // Show notification
    setCartNotification(true);
    setTimeout(() => setCartNotification(false), 2000);
  };

  const removeFromCart = (productId) => {
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updatedCart = currentCart.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new CustomEvent("cart-updated"));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updatedCart = currentCart.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity } 
        : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new CustomEvent("cart-updated"));
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-purple-50">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"
      ></motion.div>
    </div>
  );
  
  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-purple-50 to-coral-50">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-r from-teal-400/10 to-purple-400/10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-coral-400/10 to-teal-400/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Page Title with animation */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-600 via-purple-600 to-coral-600 bg-clip-text text-transparent mb-4">
            Discover Amazing Products
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our curated collection of premium gadgets and accessories
          </p>
        </motion.div>

        {/* Search Bar with gradient */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-2xl mx-auto flex items-center bg-white rounded-full px-6 py-4 shadow-lg mb-12 border border-teal-100"
        >
          <Search className="w-6 h-6 text-teal-500" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-4 w-full outline-none bg-transparent text-lg placeholder-gray-400"
          />
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-teal-500 to-purple-500 text-white px-6 py-2 rounded-full font-medium"
          >
            Search
          </motion.button>
        </motion.div>

        {/* Filters and Sorting */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-md"
        >
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center mb-4 md:mb-0 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl shadow-md"
            type="button"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
            {selectedCategory !== "All" || priceFilter ? (
              <span className="ml-2 bg-white text-teal-600 text-xs rounded-full h-6 w-6 flex items-center justify-center">
                {[selectedCategory, priceFilter].filter(Boolean).length}
              </span>
            ) : null}
          </motion.button>

          <div className="flex items-center space-x-4">
            <span className="text-gray-600 font-medium">Sort by:</span>
            <motion.select 
              whileFocus={{ scale: 1.02 }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-5 py-3 bg-white rounded-xl shadow-sm border border-teal-100 focus:ring-2 focus:ring-teal-400 focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="name">Name</option>
            </motion.select>
          </div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-10 overflow-hidden border border-teal-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Filters</h3>
                <motion.button 
                  whileHover={{ rotate: 90 }}
                  onClick={() => setShowFilters(false)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium mb-4 text-lg text-teal-700">Category</h4>
                  <div className="space-y-3">
                    {categories.map(category => (
                      <motion.div 
                        whileHover={{ x: 5 }}
                        key={category} 
                        className="flex items-center p-3 rounded-lg hover:bg-teal-50 transition-colors"
                      >
                        <input
                          type="radio"
                          id={category}
                          name="category"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="mr-3 h-5 w-5 text-teal-600 focus:ring-teal-500"
                        />
                        <label htmlFor={category} className="capitalize text-gray-700 font-medium">
                          {category}
                        </label>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4 text-lg text-purple-700">Price Range</h4>
                  <div className="space-y-3">
                    {priceRanges.map(range => (
                      <motion.div 
                        whileHover={{ x: 5 }}
                        key={range.id} 
                        className="flex items-center p-3 rounded-lg hover:bg-purple-50 transition-colors"
                      >
                        <input
                          type="radio"
                          id={`price-${range.id}`}
                          name="price"
                          checked={priceFilter === range.id}
                          onChange={() => setPriceFilter(priceFilter === range.id ? null : range.id)}
                          className="mr-3 h-5 w-5 text-purple-600 focus:ring-purple-500"
                        />
                        <label htmlFor={`price-${range.id}`} className="text-gray-700 font-medium">
                          {range.range}
                        </label>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedCategory("All");
                    setPriceFilter(null);
                  }}
                  className="px-4 py-2 text-teal-600 hover:text-teal-800 font-medium flex items-center"
                  type="button"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Clear all filters
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8 flex justify-between items-center"
        >
          <p className="text-gray-600 font-medium">
            Showing <span className="font-bold text-teal-600">{filteredProducts.length}</span> of{" "}
            <span className="font-bold text-purple-600">{dummyProducts.length}</span> products
          </p>
          
          {search && (
            <p className="text-sm text-gray-500">
              Results for: <span className="font-medium text-coral-600">"{search}"</span>
            </p>
          )}
        </motion.div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-3xl shadow-md"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
                setPriceFilter(null);
              }}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-xl font-medium"
              type="button"
            >
              Reset Filters
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence>
              {filteredProducts.map((product) => {
                const cartItem = cartItems.find(item => item.id === product.id);
                const quantity = cartItem ? cartItem.quantity : 0;
                
                return (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    whileHover={hoverEffect}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 border border-gray-100"
                  >
                    <div className="relative overflow-hidden">
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        src={product.image}
                        alt={product.name}
                        className="w-full h-60 object-cover"
                      />
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/30 to-transparent"></div>
                      
                      {product.originalPrice && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 left-3 bg-gradient-to-r from-coral-500 to-coral-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md"
                        >
                          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </motion.span>
                      )}
                      
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleWishlist(product)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-coral-50 transition-colors"
                        type="button"
                      >
                        <Heart 
                          className={`w-5 h-5 ${wishlist.some(item => item.id === product.id) 
                            ? 'fill-coral-500 text-coral-500' 
                            : 'text-gray-600'}`} 
                        />
                      </motion.button>
                      
                      {product.featured && (
                        <motion.span 
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="absolute bottom-3 left-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-xs px-2 py-1 rounded-md font-medium"
                        >
                          Featured
                        </motion.span>
                      )}
                    </div>
                    
                    <div className="p-5">
                      <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                        {product.name}
                      </h2>
                      
                      <div className="flex items-center mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(product.rating) 
                              ? 'fill-amber-400 text-amber-400' 
                              : 'text-gray-300'}`} 
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-2">({product.reviewCount})</span>
                      </div>
                      
                      {/* Color options */}
                      <div className="flex space-x-2 mb-4">
                        {product.colors.map((color, index) => (
                          <div 
                            key={index}
                            className="w-4 h-4 rounded-full border border-gray-200"
                            style={{ backgroundColor: color }}
                          ></div>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xl font-bold text-gray-900">${product.price}</p>
                          {product.originalPrice && (
                            <p className="text-sm text-gray-500 line-through">${product.originalPrice}</p>
                          )}
                        </div>
                        
                        {quantity > 0 ? (
                          <div className="flex items-center space-x-2">
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                              type="button"
                            >
                              <Minus className="w-4 h-4" />
                            </motion.button>
                            <span className="text-lg font-medium">{quantity}</span>
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                              type="button"
                            >
                              <Plus className="w-4 h-4" />
                            </motion.button>
                          </div>
                        ) : (
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => addToCart(product)}
                            className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-purple-500 text-white py-2 px-4 rounded-xl hover:shadow-md transition-all"
                            type="button"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span className="text-sm font-medium">Add to Cart</span>
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Cart Notification */}
      <AnimatePresence>
        {cartNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-6 left-1/2 bg-gradient-to-r from-teal-500 to-purple-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2 z-50"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Item added to cart!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}