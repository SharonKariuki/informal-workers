'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaGoogle, FaRegEnvelope } from 'react-icons/fa';
import { MdLockOutline } from 'react-icons/md';
import AuthLayout from '../../components/AuthLayout';


export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role) {
      alert('Please select your role.');
      return;
    }

    try {
      setLoading(true);

      const endpoint =
        formData.role === 'worker'
          ? 'http://localhost:5000/api/auth/login/worker'
          : 'http://localhost:5000/api/auth/login/employer';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);

        // Check user's role
        const userRes = await fetch('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${data.token}` },
        });

        const user = await userRes.json();

        if (user.role !== formData.role) {
          alert(
            `This account is not registered as a ${formData.role}. Please choose the correct role.`
          );
          setLoading(false);
          return;
        }

        if (user.role === 'worker') {
          router.push('/worker/dashboard');
        } else if (user.role === 'employer') {
          router.push('/employer/dashboard');
        } else {
          alert('Unknown user role.');
        }
      } else {
        alert(data.msg || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const form = (
    <form onSubmit={handleSubmit}>
      {/* Google Sign-in (placeholder) */}
      <button
        type="button"
        className="w-full flex items-center justify-center space-x-3 py-3.5 px-6 border border-blue-200 rounded-xl hover:border-blue-300 bg-white shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 mb-8"
      >
        <FaGoogle className="text-[#EA4335] text-xl" />
        <span className="text-sm font-medium text-gray-700">
          Continue with Google
        </span>
      </button>

      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-blue-100"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-white text-sm text-blue-500 font-medium">
            or sign in with email
          </span>
        </div>
      </div>

      <div className="space-y-5">
        {/* Email Input */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaRegEnvelope className="h-5 w-5 text-blue-400" />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
            className="block w-full pl-10 pr-4 py-3.5 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-300 bg-blue-50 text-blue-900 placeholder-blue-400 shadow-sm hover:shadow-md transition-all duration-300"
          />
        </div>

        {/* Password Input */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MdLockOutline className="h-5 w-5 text-blue-400" />
          </div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="block w-full pl-10 pr-4 py-3.5 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-300 bg-blue-50 text-blue-900 placeholder-blue-400 shadow-sm hover:shadow-md transition-all duration-300"
          />
        </div>

        {/* Role Select */}
        <div className="mt-4">
          <label className="block text-sm text-blue-700 font-medium mb-1">
            Sign in as
          </label>
          <select
            name="role"
            value={formData.role || ""}
            onChange={handleChange}
            required
            className="block w-full border border-blue-200 rounded-xl py-3 px-4 bg-blue-50 text-blue-900 placeholder-blue-400 focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
          >
            <option value="" disabled hidden>
              Select role
            </option>
            <option value="worker">Worker</option>
            <option value="employer">Employer</option>
          </select>
        </div>

        {/* Remember Me + Forgot */}
        <div className="flex items-center justify-between text-sm text-blue-700">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="remember"
              className="h-4 w-4 text-blue-600 focus:ring-blue-400 border-blue-300 rounded"
            />
            <span>Remember me</span>
          </label>
          <a
            href="#"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </div>
    </form>
  );

  const aside = (
    <>
      <h2 className="text-3xl font-semibold mb-4">New to KaziLink?</h2>
      <div className="w-16 h-1.5 bg-blue-400 bg-opacity-50 mx-auto mb-8 rounded-full"></div>
      <p className="mb-10 text-blue-100 leading-relaxed text-opacity-90">
        Join our professional community today and unlock new opportunities.
      </p>
      <Link href="/pages/role-selection">
        <button className="inline-block px-8 py-3 border-2 border-blue-300 text-white font-medium rounded-xl shadow-lg hover:bg-white hover:bg-opacity-10 hover:shadow-xl hover:border-white transition-all duration-300 transform hover:-translate-y-0.5 hover:text-blue-300">
          Create Account
        </button>
      </Link>
    </>
  );

  return <AuthLayout title="Welcome Back" form={form} aside={aside} />;
}

