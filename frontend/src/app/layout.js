'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import './globals.css';

export default function RootLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  // Persist dark mode preference
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
        <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <AnimatePresence mode="wait">
          <motion.div
            key={typeof window !== 'undefined' ? window.location.pathname : ""}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </body>
    </html>
  );
}
