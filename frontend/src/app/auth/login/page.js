'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
        router.push('/items');
      }
    }
  }, [router]);

  const handleLogin = (e) => {
    e.preventDefault();

    // Dummy credentials
    const dummyEmail = 'test@example.com';
    const dummyPassword = '123456';

    if (email === dummyEmail && password === dummyPassword) {
      localStorage.setItem('isLoggedIn', 'true');

      // 🔔 trigger storage event manually
      window.dispatchEvent(new Event("storage"));

      const redirect = searchParams.get('redirect') || '/items';
      router.push(redirect);
    } else {
      setError('Invalid email or password ❌');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">Login</h2>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div className="flex items-center border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-purple-400">
            <Mail className="w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="ml-2 w-full outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-purple-400">
            <Lock className="w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="ml-2 w-full outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition"
          >
            Login
          </button>
        </form>

        {/* Signup Link */}
        <p className="mt-6 text-center text-gray-600">
          Don’t have an account?{' '}
          <button
            onClick={() => router.push('/auth/signup')}
            className="text-purple-600 font-semibold hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
