// pages/auth/login.jsx

// React
import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

// Icons
import { FaSpinner, FaEye, FaEyeSlash, FaBriefcase, FaUser, FaStar, FaArrowRight, FaGoogle, FaEnvelope, FaLock } from 'react-icons/fa';

export default function Login({ status, canResetPassword, googleAuthEnabled }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  const fillDemoAccount = (email, password) => {
    setData('email', email);
    setData('password', password);
  };

  return (
    <>
      <Head title="Log in" />

      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-linear-to-r from-blue-400 to-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-linear-to-r from-purple-400 to-pink-500 rounded-full blur-3xl opacity-20 animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl"></div>

        <div className="max-w-md w-full space-y-8 relative z-10">
          {/* Logo and Header */}
          <div className="text-center animate-fade-in-up">
            <div className="flex justify-center mb-4">
              <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl p-3 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <h1 className="text-3xl font-bold text-white">JM</h1>
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account to continue
            </p>
          </div>

          {/* Login Form */}
          <form className="mt-8 space-y-6" onSubmit={submit}>
            <div className="space-y-4">
              {/* Email Field */}
              <div className="animate-fade-in-up animation-delay-100">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'transform scale-[1.02]' : ''}`}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoFocus
                    tabIndex={1}
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-300"
                    placeholder="email@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 animate-slide-in">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="animate-fade-in-up animation-delay-200">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  {canResetPassword && (
                    <a href={route('password.request')} className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'transform scale-[1.02]' : ''}`}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    tabIndex={2}
                    autoComplete="current-password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-300"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 animate-slide-in">{errors.password}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between animate-fade-in-up animation-delay-300">
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    tabIndex={3}
                    checked={data.remember}
                    onChange={(e) => setData('remember', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg animate-fade-in-up animation-delay-400"
                tabIndex={4}
              >
                {processing ? (
                  <FaSpinner className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <FaArrowRight className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                    </span>
                    Sign in
                  </>
                )}
              </button>

              {/* Google Sign In */}
              {googleAuthEnabled && (
                <div className="animate-fade-in-up animation-delay-500">
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Or continue with</span>
                    </div>
                  </div>
                  <a
                    href="/auth/google/redirect"
                    className="w-full flex items-center justify-center px-4 py-2 border-2 border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-[1.02] group"
                  >
                    <FaGoogle className="mr-2 h-5 w-5 text-red-500 transition-transform duration-300 group-hover:scale-110" />
                    Google
                  </a>
                </div>
              )}
            </div>

            {errors.google && (
              <p className="text-sm text-red-600 text-center animate-slide-in">{errors.google}</p>
            )}

            {/* Sign up link */}
            <div className="text-center text-sm animate-fade-in-up animation-delay-600">
              <span className="text-gray-600">Don't have an account? </span>
              <a href={route('register')} className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                Sign up
              </a>
            </div>
          </form>

          {/* Demo Accounts Section */}
          <div className="mt-8 animate-fade-in-up animation-delay-700">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <FaStar className="inline h-3 w-3 mr-1 text-yellow-500" />
                  Demo Accounts
                </span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Employer Card */}
              <div className="group relative rounded-xl border-2 border-gray-200 p-5 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer overflow-hidden bg-white">
                <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                <div className="absolute top-2 right-2">
                  <div className="bg-blue-100 text-blue-600 rounded-full p-1.5">
                    <FaBriefcase className="h-4 w-4" />
                  </div>
                </div>
                <div className="relative">
                  <div className="font-bold text-gray-900 mb-3 text-lg">Employer Demo</div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Email:</span>
                      <span className="font-mono text-xs">employer@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Password:</span>
                      <span className="font-mono text-xs">Employer1205</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('employer@gmail.com', 'Employer1205')}
                    className="mt-4 w-full py-2 px-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 text-sm font-medium"
                  >
                    Use Employer Account
                    <FaArrowRight className="inline h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </button>
                </div>
              </div>

              {/* Seeker Card */}
              <div className="group relative rounded-xl border-2 border-gray-200 p-5 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer overflow-hidden bg-white">
                <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-pink-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                <div className="absolute top-2 right-2">
                  <div className="bg-purple-100 text-purple-600 rounded-full p-1.5">
                    <FaUser className="h-4 w-4" />
                  </div>
                </div>
                <div className="relative">
                  <div className="font-bold text-gray-900 mb-3 text-lg">Job Seeker Demo</div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Email:</span>
                      <span className="font-mono text-xs">seeker@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Password:</span>
                      <span className="font-mono text-xs">Seeker1205</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('seeker@gmail.com', 'Seeker1205')}
                    className="mt-4 w-full py-2 px-4 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-all duration-300 text-sm font-medium"
                  >
                    Use Seeker Account
                    <FaArrowRight className="inline h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Status Message */}
          {status && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-center text-sm font-medium text-green-700 animate-slide-in">
              {status}
            </div>
          )}
        </div>
      </div>

      <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes pulse {
                    0%, 100% {
                        opacity: 0.2;
                    }
                    50% {
                        opacity: 0.3;
                    }
                }
                
                .animate-fade-in-up {
                    animation: fadeInUp 0.6s ease-out forwards;
                    opacity: 0;
                }
                
                .animate-slide-in {
                    animation: slideIn 0.3s ease-out forwards;
                }
                
                .animate-pulse {
                    animation: pulse 3s ease-in-out infinite;
                }
                
                .animation-delay-100 {
                    animation-delay: 0.1s;
                }
                
                .animation-delay-200 {
                    animation-delay: 0.2s;
                }
                
                .animation-delay-300 {
                    animation-delay: 0.3s;
                }
                
                .animation-delay-400 {
                    animation-delay: 0.4s;
                }
                
                .animation-delay-500 {
                    animation-delay: 0.5s;
                }
                
                .animation-delay-600 {
                    animation-delay: 0.6s;
                }
                
                .animation-delay-700 {
                    animation-delay: 0.7s;
                }
                
                .animation-delay-1000 {
                    animation-delay: 1s;
                }
            `}</style>
    </>
  );
}