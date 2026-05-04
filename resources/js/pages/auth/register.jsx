// pages/auth/register.jsx

import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import {
  LoaderCircle,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Shield,
  ArrowRight,
  UserPlus,
  Info
} from 'lucide-react';

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
      <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
        <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
          <main className="w-full max-w-83.75 lg:max-w-md">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#1b1b18] rounded-lg flex items-center justify-center dark:bg-[#EDEDEC]">
                  <UserPlus className="h-5 w-5 text-white dark:text-[#1b1b18]" />
                </div>
              </div>
              <h1 className="text-2xl font-semibold text-center text-white mb-2">Create an account</h1>
              <p className="text-sm text-[#706f6c] dark:text-[#A1A09A] text-center">
                Join Job Match and find your perfect career opportunity
              </p>
            </div>

            {/* Registration Form */}
            <form className="flex flex-col gap-6" onSubmit={submit}>
              <div className="grid gap-5">
                {/* Email Field */}
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm text-white font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#706f6c] dark:text-[#A1A09A]" />
                    Email address
                  </label>
                  <input
                    id="email"
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
                    placeholder="email@example.com"
                    className={`w-full rounded-sm border px-3 py-2.5 text-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed dark:bg-[#0a0a0a] dark:text-[#EDEDEC] placeholder:text-[#706f6c] dark:placeholder:text-[#A1A09A] transition-all duration-200 ${focusedField === 'email'
                        ? 'border-[#1b1b18] ring-1 ring-[#1b1b18] dark:border-[#EDEDEC] dark:ring-[#EDEDEC]'
                        : 'border-[#19140035] dark:border-[#3E3E3A]'
                      }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full shrink-0"></span>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="grid gap-2">
                  <label htmlFor="password" className="text-sm text-white font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4 text-[#706f6c] dark:text-[#A1A09A]" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      tabIndex={2}
                      autoComplete="new-password"
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      disabled={processing}
                      placeholder="Create a strong password"
                      className={`w-full rounded-sm border px-3 py-2.5 pr-10 text-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed dark:bg-[#0a0a0a] dark:text-[#EDEDEC] placeholder:text-[#706f6c] dark:placeholder:text-[#A1A09A] transition-all duration-200 ${focusedField === 'password'
                          ? 'border-[#1b1b18] ring-1 ring-[#1b1b18] dark:border-[#EDEDEC] dark:ring-[#EDEDEC]'
                          : 'border-[#19140035] dark:border-[#3E3E3A]'
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#706f6c] hover:text-[#1b1b18] dark:text-[#A1A09A] dark:hover:text-[#EDEDEC] transition-colors"
                      tabIndex={-1}
                      disabled={processing}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full shrink-0"></span>
                      {errors.password}
                    </p>
                  )}
                  <p className="text-xs text-[#706f6c] dark:text-[#A1A09A] flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    Password must be at least 8 characters
                  </p>
                </div>

                {/* Confirm Password Field */}
                <div className="grid gap-2">
                  <label htmlFor="password_confirmation" className="text-sm text-white font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[#706f6c] dark:text-[#A1A09A]" />
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      id="password_confirmation"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      tabIndex={3}
                      autoComplete="new-password"
                      value={data.password_confirmation}
                      onChange={(e) => setData('password_confirmation', e.target.value)}
                      onFocus={() => setFocusedField('confirm')}
                      onBlur={() => setFocusedField(null)}
                      disabled={processing}
                      placeholder="Confirm your password"
                      className={`w-full rounded-sm border px-3 py-2.5 pr-10 text-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed dark:bg-[#0a0a0a] dark:text-[#EDEDEC] placeholder:text-[#706f6c] dark:placeholder:text-[#A1A09A] transition-all duration-200 ${focusedField === 'confirm'
                          ? 'border-[#1b1b18] ring-1 ring-[#1b1b18] dark:border-[#EDEDEC] dark:ring-[#EDEDEC]'
                          : 'border-[#19140035] dark:border-[#3E3E3A]'
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#706f6c] hover:text-[#1b1b18] dark:text-[#A1A09A] dark:hover:text-[#EDEDEC] transition-colors"
                      tabIndex={-1}
                      disabled={processing}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password_confirmation && (
                    <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full shrink-0"></span>
                      {errors.password_confirmation}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className="group relative inline-flex w-full items-center justify-center gap-2 rounded-sm border border-black bg-[#1b1b18] px-5 py-2.5 text-sm font-medium leading-normal text-white hover:border-black hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:border-white dark:hover:bg-white transition-all duration-200 mt-2"
                  tabIndex={4}
                >
                  {processing ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>

              {/* Google Sign Up */}
              {googleAuthEnabled && (
                <div className="grid gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#e3e3e0] dark:border-[#3E3E3A]"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-[#FDFDFC] px-3 text-[#706f6c] dark:bg-[#0a0a0a] dark:text-[#A1A09A]">
                        or sign up with
                      </span>
                    </div>
                  </div>
                  <a
                    href={route('auth.google.redirect')}
                    className="flex items-center justify-center gap-3 rounded-sm border border-[#19140035] px-5 py-2.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b] transition-all duration-200 group"
                  >
                    <svg className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                  </a>
                </div>
              )}

              {errors.google && (
                <p className="text-xs text-red-600 dark:text-red-400 text-center flex items-center justify-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.google}
                </p>
              )}

              {/* Terms and Conditions */}
              <div className="rounded-sm border border-[#e3e3e0] bg-[#FDFDFC] p-4 dark:border-[#3E3E3A] dark:bg-[#0a0a0a]">
                <p className="text-xs text-[#706f6c] dark:text-[#A1A09A] text-center leading-relaxed">
                  By creating an account, you agree to our{' '}
                  <a
                    href={`${route('home')?.replace(/\/$/, '') || ''}/terms`}
                    className="font-medium text-[#1b1b18] hover:underline dark:text-[#EDEDEC] underline-offset-4"
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    href={`${route('home')?.replace(/\/$/, '') || ''}/privacy`}
                    className="font-medium text-[#1b1b18] hover:underline dark:text-[#EDEDEC] underline-offset-4"
                  >
                    Privacy Policy
                  </a>
                </p>
                <p className="text-xs text-[#706f6c] dark:text-[#A1A09A] mt-2 text-center flex items-center justify-center gap-1">
                  <Mail className="inline h-3 w-3" />
                  We'll send you a verification email to confirm your account
                </p>
              </div>

              {/* Login link */}
              <div className="text-center text-sm text-[#706f6c] dark:text-[#A1A09A]">
                Already have an account?{' '}
                <a
                  href={route('login')}
                  className="font-medium text-[#1b1b18] hover:underline dark:text-[#EDEDEC] underline-offset-4"
                  tabIndex={5}
                >
                  Log in
                </a>
              </div>
            </form>

            {/* Status Message */}
            {status && (
              <div className="mt-6 rounded-sm border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400 flex items-center gap-2">
                <span className="shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                {status}
              </div>
            )}
          </main>
        </div>
        <div className="hidden h-14.5 lg:block"></div>
      </div>
    </>
  );
}