// pages/auth/reset-password.jsx

import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Eye, EyeOff, Lock, Mail, Shield, Key, CheckCircle, ArrowRight } from 'lucide-react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Reset Password" />

            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8">
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-83.75 flex-col lg:max-w-md">
                        {/* Logo and Header */}
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-[#1b1b18] rounded-lg flex items-center justify-center">
                                    <Key className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-semibold text-[#1b1b18]">
                                Reset Your Password
                            </h2>
                            <p className="mt-2 text-sm text-[#706f6c]">
                                Please enter your new password below
                            </p>
                        </div>

                        {/* Reset Password Form */}
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-5">
                                {/* Email Field (Read Only) */}
                                <div className="grid gap-2">
                                    <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-[#706f6c]" />
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            value={data.email}
                                            readOnly
                                            className="w-full rounded-sm border border-[#19140035] px-3 py-2.5 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-xs text-red-600 flex items-center gap-1">
                                            <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* New Password Field */}
                                <div className="grid gap-2">
                                    <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                                        <Lock className="h-4 w-4 text-[#706f6c]" />
                                        New Password
                                    </label>
                                    <div className={`relative transition-all duration-200 ${focusedField === 'password' ? 'ring-1 ring-[#1b1b18]' : ''}`}>
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            autoFocus
                                            autoComplete="new-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="Enter new password"
                                            className="w-full rounded-sm border border-[#19140035] px-3 py-2.5 pr-10 text-sm focus:outline-none placeholder:text-[#706f6c]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#706f6c] hover:text-[#1b1b18] transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-xs text-red-600 flex items-center gap-1">
                                            <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                                            {errors.password}
                                        </p>
                                    )}
                                    <p className="text-xs text-[#706f6c] flex items-center gap-1">
                                        <span className="inline-block w-1 h-1 bg-[#706f6c] rounded-full"></span>
                                        Password must be at least 8 characters
                                    </p>
                                </div>

                                {/* Confirm Password Field */}
                                <div className="grid gap-2">
                                    <label htmlFor="password_confirmation" className="text-sm font-medium flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-[#706f6c]" />
                                        Confirm Password
                                    </label>
                                    <div className={`relative transition-all duration-200 ${focusedField === 'confirm' ? 'ring-1 ring-[#1b1b18]' : ''}`}>
                                        <input
                                            id="password_confirmation"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            required
                                            autoComplete="new-password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            onFocus={() => setFocusedField('confirm')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="Confirm your new password"
                                            className="w-full rounded-sm border border-[#19140035] px-3 py-2.5 pr-10 text-sm focus:outline-none placeholder:text-[#706f6c]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#706f6c] hover:text-[#1b1b18] transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {errors.password_confirmation && (
                                        <p className="text-xs text-red-600 flex items-center gap-1">
                                            <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                                            {errors.password_confirmation}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="group relative inline-flex w-full items-center justify-center gap-2 rounded-sm border border-black bg-[#1b1b18] px-5 py-2.5 text-sm font-medium leading-normal text-white hover:border-black hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    {processing ? (
                                        <>
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                            Resetting...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-4 w-4" />
                                            Reset Password
                                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Back to Login */}
                        <div className="mt-6 text-center">
                            <a
                                href={route('login')}
                                className="inline-flex items-center text-sm text-[#706f6c] hover:text-[#1b1b18] transition-colors"
                            >
                                ← Back to log in
                            </a>
                        </div>

                        {/* Password Requirements */}
                        <div className="mt-6 rounded-sm border border-blue-200 bg-blue-50 p-4">
                            <h4 className="text-sm font-medium text-blue-800 mb-2">🔒 Password requirements:</h4>
                            <ul className="space-y-1 text-xs text-blue-700">
                                <li className="flex items-center">
                                    <span className="h-1.5 w-1.5 bg-blue-400 rounded-full mr-2"></span>
                                    At least 8 characters long
                                </li>
                                <li className="flex items-center">
                                    <span className="h-1.5 w-1.5 bg-blue-400 rounded-full mr-2"></span>
                                    Use a mix of letters, numbers, and symbols
                                </li>
                                <li className="flex items-center">
                                    <span className="h-1.5 w-1.5 bg-blue-400 rounded-full mr-2"></span>
                                    Don't use common or easily guessed passwords
                                </li>
                            </ul>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-4 text-center">
                            <p className="text-xs text-[#706f6c]">
                                Choose a strong password to keep your account secure
                            </p>
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}