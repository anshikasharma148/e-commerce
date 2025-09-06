'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    // TODO: Call backend API for signup, then redirect
    router.push('/auth/login'); // redirect to login after successful signup
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">Create Account</h2>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Name */}
          <div className="flex items-center border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-purple-400">
            <User className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              className="ml-2 w-full outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
            Sign Up
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/auth/login')}
            className="text-purple-600 font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
