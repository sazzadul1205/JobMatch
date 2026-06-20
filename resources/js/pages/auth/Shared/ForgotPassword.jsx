// pages/auth/forgot-password.jsx

import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, ArrowLeft, Send, Key, MailCheck } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const [focusedField, setFocusedField] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password" />

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
                                Forgot Password?
                            </h2>
                            <p className="mt-2 text-sm text-[#706f6c]">
                                Enter your email address and we'll send you a link to reset your password
                            </p>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className="mb-4 rounded-sm border border-green-200 bg-green-50 p-4 text-center">
                                <div className="flex items-center justify-center mb-1">
                                    <MailCheck className="h-5 w-5 text-green-600 mr-2" />
                                    <span className="text-sm font-medium text-green-700">Email sent!</span>
                                </div>
                                <p className="text-xs text-green-600">
                                    {status}
                                </p>
                            </div>
                        )}

                        {/* Forgot Password Form */}
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-5">
                                {/* Email Field */}
                                <div className="grid gap-2">
                                    <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-[#706f6c]" />
                                        Email address
                                    </label>
                                    <div className={`relative transition-all duration-200 ${focusedField === 'email' ? 'ring-1 ring-[#1b1b18]' : ''}`}>
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            autoFocus
                                            autoComplete="off"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="email@example.com"
                                            className="w-full rounded-sm border border-[#19140035] px-3 py-2.5 text-sm focus:outline-none placeholder:text-[#706f6c]"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-xs text-red-600 flex items-center gap-1">
                                            <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                                            {errors.email}
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
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4" />
                                            Send Reset Link
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
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Back to log in
                            </a>
                        </div>

                        {/* Help Section */}
                        <div className="mt-6 rounded-sm border border-yellow-200 bg-yellow-50 p-4">
                            <h4 className="text-sm font-medium text-yellow-800 mb-2">💡 Tips:</h4>
                            <ul className="space-y-1 text-xs text-yellow-700">
                                <li className="flex items-center">
                                    <span className="h-1.5 w-1.5 bg-yellow-400 rounded-full mr-2"></span>
                                    Check your spam or junk folder if you don't see the email
                                </li>
                                <li className="flex items-center">
                                    <span className="h-1.5 w-1.5 bg-yellow-400 rounded-full mr-2"></span>
                                    The reset link expires in 60 minutes
                                </li>
                                <li className="flex items-center">
                                    <span className="h-1.5 w-1.5 bg-yellow-400 rounded-full mr-2"></span>
                                    Make sure to use the email address you registered with
                                </li>
                            </ul>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-4 text-center">
                            <p className="text-xs text-[#706f6c]">
                                We'll send a password reset link to your email address
                            </p>
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}