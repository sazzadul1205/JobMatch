// pages/auth/login.jsx

import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Eye, EyeOff, Briefcase, User, Star, Mail, Lock, ArrowRight } from 'lucide-react';

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
    setData({
      email: email,
      password: password,
      remember: data.remember,
    });
  };

  const demoAccounts = [
    {
      role: 'Employer',
      email: 'employer@gmail.com',
      password: 'Employer1205',
      icon: Briefcase,
      description: 'Post jobs and find talent',
    },
    {
      role: 'Job Seeker',
      email: 'seeker@gmail.com',
      password: 'Seeker1205',
      icon: User,
      description: 'Browse jobs and apply',
    },
  ];

  return (
    <>
      <Head title="Log in" />
      <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
        <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
          <main className="flex w-full max-w-83.75 flex-col lg:max-w-4xl lg:flex-row">
            {/* Left side - Login Form */}
            <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#1b1b18] rounded-lg flex items-center justify-center dark:bg-[#EDEDEC]">
                  <span className="text-white font-bold text-xl dark:text-[#1b1b18]">JM</span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold leading-tight">Job Match</h1>
                  <p className="text-xs text-[#706f6c] dark:text-[#A1A09A]">Find your perfect match</p>
                </div>
              </div>

              <h2 className="mb-1 text-2xl font-semibold">Welcome back</h2>
              <p className="mb-8 text-[#706f6c] dark:text-[#A1A09A]">
                Enter your email and password below to log in
              </p>

              <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-5">
                  {/* Email Field */}
                  <div className="grid gap-2">
                    <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-[#706f6c] dark:text-[#A1A09A]" />
                      Email address
                    </label>
                    <div className={`relative transition-all duration-200 ${focusedField === 'email' ? 'ring-1 ring-[#1b1b18] dark:ring-[#EDEDEC]' : ''}`}>
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
                        placeholder="email@example.com"
                        className="w-full rounded-sm border border-[#19140035] px-3 py-2.5 text-sm focus:outline-none dark:border-[#3E3E3A] dark:bg-[#0a0a0a] dark:text-[#EDEDEC] placeholder:text-[#706f6c] dark:placeholder:text-[#A1A09A]"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                        <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                        <Lock className="h-4 w-4 text-[#706f6c] dark:text-[#A1A09A]" />
                        Password
                      </label>
                      {canResetPassword && (
                        <a
                          href={route('password.request')}
                          className="text-xs text-[#706f6c] hover:text-[#1b1b18] dark:text-[#A1A09A] dark:hover:text-[#EDEDEC] underline-offset-4 hover:underline"
                          tabIndex={5}
                        >
                          Forgot password?
                        </a>
                      )}
                    </div>
                    <div className={`relative transition-all duration-200 ${focusedField === 'password' ? 'ring-1 ring-[#1b1b18] dark:ring-[#EDEDEC]' : ''}`}>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        tabIndex={2}
                        autoComplete="current-password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Enter your password"
                        className="w-full rounded-sm border border-[#19140035] px-3 py-2.5 pr-10 text-sm focus:outline-none dark:border-[#3E3E3A] dark:bg-[#0a0a0a] dark:text-[#EDEDEC] placeholder:text-[#706f6c] dark:placeholder:text-[#A1A09A]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#706f6c] hover:text-[#1b1b18] dark:text-[#A1A09A] dark:hover:text-[#EDEDEC] transition-colors"
                        tabIndex={-1}
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
                        <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center gap-3">
                    <input
                      id="remember"
                      type="checkbox"
                      tabIndex={3}
                      checked={data.remember}
                      onChange={(e) => setData('remember', e.target.checked)}
                      className="h-4 w-4 rounded-sm border-[#19140035] text-[#1b1b18] focus:ring-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#0a0a0a]"
                    />
                    <label htmlFor="remember" className="text-sm text-[#706f6c] dark:text-[#A1A09A] cursor-pointer select-none">
                      Remember me
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={processing}
                    className="group relative inline-flex w-full items-center justify-center gap-2 rounded-sm border border-black bg-[#1b1b18] px-5 py-2.5 text-sm font-medium leading-normal text-white hover:border-black hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:border-white dark:hover:bg-white transition-all duration-200"
                    tabIndex={4}
                  >
                    {processing ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>

                {/* Google Sign In */}
                {googleAuthEnabled && (
                  <div className="grid gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#e3e3e0] dark:border-[#3E3E3A]"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-3 text-[#706f6c] dark:bg-[#161615] dark:text-[#A1A09A]">
                          or continue with
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

                {/* Sign up link */}
                <div className="text-center text-sm text-[#706f6c] dark:text-[#A1A09A]">
                  Don't have an account?{' '}
                  <a
                    href={route('register')}
                    className="font-medium text-[#1b1b18] hover:underline dark:text-[#EDEDEC] underline-offset-4"
                    tabIndex={5}
                  >
                    Sign up
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
            </div>

            {/* Right side - Demo Accounts */}
            <div className="relative -mb-px aspect-335/376 w-full shrink-0 overflow-hidden rounded-t-lg bg-[#fff2f2] lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-109.5 lg:rounded-t-none lg:rounded-r-lg dark:bg-[#1D0002]">
              <div className="p-6 lg:p-12 flex flex-col justify-center h-full">
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-5 w-5 text-[#F53003] dark:text-[#F61500]" />
                    <h3 className="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Demo Accounts</h3>
                  </div>
                  <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                    Explore the platform instantly with pre-configured demo accounts
                  </p>
                </div>

                <div className="grid gap-4">
                  {demoAccounts.map((account, index) => {
                    const Icon = account.icon;
                    return (
                      <div
                        key={index}
                        className="group rounded-sm border border-[#19140035] bg-white p-5 shadow-sm hover:border-[#1915014a] dark:border-[#3E3E3A] dark:bg-[#161615] dark:hover:border-[#62605b] transition-all duration-200"
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-10 h-10 bg-[#FDFDFC] rounded-full flex items-center justify-center border border-[#e3e3e0] dark:bg-[#0a0a0a] dark:border-[#3E3E3A] group-hover:border-[#1b1b18] dark:group-hover:border-[#EDEDEC] transition-all duration-200">
                            <Icon className="h-5 w-5 text-[#1b1b18] dark:text-[#EDEDEC]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-[#1b1b18] dark:text-[#EDEDEC] mb-1">
                              {account.role} Demo
                            </h4>
                            <p className="text-xs text-[#706f6c] dark:text-[#A1A09A]">
                              {account.description}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4 p-3 rounded-sm bg-[#FDFDFC] dark:bg-[#0a0a0a] border border-[#e3e3e0] dark:border-[#3E3E3A]">
                          <div className="flex items-center gap-2 text-xs">
                            <Mail className="h-3 w-3 text-[#706f6c] dark:text-[#A1A09A] shrink-0" />
                            <span className="text-[#706f6c] dark:text-[#A1A09A]">Email:</span>
                            <span className="font-mono font-medium text-[#1b1b18] dark:text-[#EDEDEC] truncate">
                              {account.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Lock className="h-3 w-3 text-[#706f6c] dark:text-[#A1A09A] shrink-0" />
                            <span className="text-[#706f6c] dark:text-[#A1A09A]">Password:</span>
                            <span className="font-mono font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                              {account.password}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => fillDemoAccount(account.email, account.password)}
                          className="w-full rounded-sm border border-[#19140035] px-4 py-2 text-sm font-medium text-[#1b1b18] hover:border-[#1915014a] hover:bg-[#FDFDFC] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b] dark:hover:bg-[#0a0a0a] transition-all duration-200 group flex items-center justify-center gap-2"
                        >
                          <span>Use {account.role} Account</span>
                          <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 rounded-sm bg-[#FDFDFC] dark:bg-[#0a0a0a] border border-[#e3e3e0] dark:border-[#3E3E3A]">
                  <p className="text-xs text-[#706f6c] dark:text-[#A1A09A] text-center">
                    <span className="inline-block mr-1">💡</span>
                    Click any demo account button to auto-fill the login form
                  </p>
                </div>
              </div>

              <div className="absolute inset-0 rounded-t-lg shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-t-none lg:rounded-r-lg dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d] pointer-events-none" />
            </div>
          </main>
        </div>
        <div className="hidden h-14.5 lg:block"></div>
      </div>
    </>
  );
}