// pages/auth/register.jsx

// React
import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

// Icons
import { FaSpinner, FaEye, FaEyeSlash, FaGoogle, FaEnvelope, FaLock, FaUserPlus, FaArrowRight, FaShieldAlt, FaEnvelopeOpenText } from 'react-icons/fa';

export default function Register({ googleAuthEnabled, status }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <>
      <Head title="Register" />

      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-linear-to-r from-green-400 to-emerald-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-linear-to-r from-blue-400 to-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl"></div>

        <div className="max-w-md w-full space-y-8 relative z-10">
          {/* Logo and Header */}
          <div className="text-center animate-fade-in-up">
            <div className="flex justify-center mb-4">
              <div className="bg-linear-to-r from-green-600 to-emerald-600 rounded-2xl p-3 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <FaUserPlus className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Join Job Match and start your career journey
            </p>
          </div>

          {/* Registration Form */}
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
                    disabled={processing}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="email@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 animate-slide-in">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="animate-fade-in-up animation-delay-200">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
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
                    autoComplete="new-password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    disabled={processing}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Create a strong password"
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
                <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters</p>
              </div>

              {/* Confirm Password Field */}
              <div className="animate-fade-in-up animation-delay-300">
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm password
                </label>
                <div className={`relative transition-all duration-300 ${focusedField === 'confirm' ? 'transform scale-[1.02]' : ''}`}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaShieldAlt className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    tabIndex={3}
                    autoComplete="new-password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    onFocus={() => setFocusedField('confirm')}
                    onBlur={() => setFocusedField(null)}
                    disabled={processing}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <p className="mt-1 text-sm text-red-600 animate-slide-in">{errors.password_confirmation}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg animate-fade-in-up animation-delay-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                tabIndex={4}
              >
                {processing ? (
                  <FaSpinner className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <FaArrowRight className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                    </span>
                    Create account
                  </>
                )}
              </button>

              {/* Google Sign Up */}
              {googleAuthEnabled && (
                <div className="animate-fade-in-up animation-delay-500">
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Or sign up with</span>
                    </div>
                  </div>
                  <a
                    href={route('auth.google.redirect')}
                    className="w-full flex items-center justify-center px-4 py-2 border-2 border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-[1.02] group"
                  >
                    <FaGoogle className="mr-2 h-5 w-5 text-red-500 transition-transform duration-300 group-hover:scale-110" />
                    Google
                  </a>
                </div>
              )}

              {errors.google && (
                <p className="text-sm text-red-600 text-center animate-slide-in">{errors.google}</p>
              )}

              {/* Terms and Conditions */}
              <div className="bg-gray-50 rounded-lg p-4 text-center animate-fade-in-up animation-delay-600">
                <div className="flex items-center justify-center mb-2">
                  <FaEnvelopeOpenText className="h-4 w-4 text-gray-500 mr-2" />
                  <p className="text-xs text-gray-600">
                    By creating an account, you agree to our{' '}
                    <a href={`${route('home').replace(/\/$/, '')}/terms`} className="font-medium text-green-600 hover:text-green-700 transition-colors">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href={`${route('home').replace(/\/$/, '')}/privacy`} className="font-medium text-green-600 hover:text-green-700 transition-colors">
                      Privacy Policy
                    </a>
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  <FaEnvelopeOpenText className="inline h-3 w-3 mr-1" />
                  We'll send you a verification email to confirm your account
                </p>
              </div>
            </div>

            {/* Login link */}
            <div className="text-center text-sm animate-fade-in-up animation-delay-700">
              <span className="text-gray-600">Already have an account? </span>
              <a href={route('login')} className="font-medium text-green-600 hover:text-green-700 transition-colors">
                Log in
              </a>
            </div>

            {status && (
              <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-center text-sm font-medium text-green-700 animate-slide-in">
                {status}
              </div>
            )}
          </form>
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