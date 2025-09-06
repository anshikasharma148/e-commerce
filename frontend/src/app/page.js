'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-extrabold mb-6 drop-shadow-lg"
      >
        Welcome to ShopEase
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-lg mb-10 max-w-lg text-center"
      >
        Discover amazing products, add them to your cart, and enjoy a seamless shopping experience.
      </motion.p>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => router.push('/auth/login')}
        className="px-8 py-3 rounded-2xl bg-white text-purple-600 font-semibold shadow-xl hover:shadow-2xl transition"
      >
        Shop Now
      </motion.button>
    </div>
  );
}
