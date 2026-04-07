// pages/auth/verify-email.jsx

// React
import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

// Icons
import { FaSpinner, FaEnvelope, FaPaperPlane, FaSignOutAlt, FaCheckCircle, FaEnvelopeOpenText, FaClock } from 'react-icons/fa';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});
    const [resendStatus, setResendStatus] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'), {
            onSuccess: () => setResendStatus('sent')
        });
    };

    const handleLogout = () => {
        post(route('logout'));
    };

    return (
        <>
            <Head title="Email verification" />

            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-yellow-50 via-orange-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-linear-to-r from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-linear-to-r from-amber-400 to-red-500 rounded-full blur-3xl opacity-20 animate-pulse animation-delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl"></div>

                <div className="max-w-md w-full space-y-8 relative z-10">
                    {/* Logo and Header */}
                    <div className="text-center animate-fade-in-up">
                        <div className="flex justify-center mb-4">
                            <div className="bg-linear-to-r from-yellow-500 to-orange-600 rounded-2xl p-3 shadow-lg transform hover:scale-105 transition-transform duration-300">
                                <FaEnvelope className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Verify your email
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Please verify your email address by clicking on the link we just emailed to you.
                        </p>
                    </div>

                    {/* Status Messages */}
                    {status === 'verification-link-sent' && (
                        <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center animate-slide-in">
                            <div className="flex items-center justify-center mb-2">
                                <FaCheckCircle className="h-5 w-5 text-green-600 mr-2" />
                                <span className="text-sm font-medium text-green-700">Verification email sent!</span>
                            </div>
                            <p className="text-xs text-green-600">
                                A new verification link has been sent to the email address you provided during registration.
                            </p>
                        </div>
                    )}

                    {resendStatus === 'sent' && !status && (
                        <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-center text-sm text-green-700 animate-slide-in">
                            <FaCheckCircle className="inline h-4 w-4 mr-1" />
                            Verification email resent successfully!
                        </div>
                    )}

                    {/* Info Card */}
                    <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in-up animation-delay-100">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-yellow-100 rounded-full p-2">
                                <FaEnvelopeOpenText className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-gray-900">Check your inbox</h3>
                                <p className="text-xs text-gray-500">We've sent a verification link to your email</p>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex items-center justify-center text-sm text-gray-600">
                                <FaClock className="h-3 w-3 mr-1 text-gray-400" />
                                <span>The link expires in 60 minutes</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 animate-fade-in-up animation-delay-200">
                        <form onSubmit={submit}>
                            <button
                                type="submit"
                                disabled={processing}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-linear-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {processing ? (
                                    <FaSpinner className="animate-spin h-5 w-5" />
                                ) : (
                                    <>
                                        <FaPaperPlane className="h-5 w-5 mr-2" />
                                        Resend verification email
                                    </>
                                )}
                            </button>
                        </form>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center py-2 px-4 border-2 border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                        >
                            <FaSignOutAlt className="h-4 w-4 mr-2" />
                            Log out
                        </button>
                    </div>

                    {/* Help Section */}
                    <div className="bg-yellow-50 rounded-lg p-4 animate-fade-in-up animation-delay-300">
                        <h4 className="text-sm font-medium text-yellow-900 mb-2">💡 Didn't receive the email?</h4>
                        <ul className="space-y-1 text-xs text-yellow-700">
                            <li className="flex items-center">
                                <span className="h-1.5 w-1.5 bg-yellow-400 rounded-full mr-2"></span>
                                Check your spam or junk folder
                            </li>
                            <li className="flex items-center">
                                <span className="h-1.5 w-1.5 bg-yellow-400 rounded-full mr-2"></span>
                                Make sure you entered the correct email address
                            </li>
                            <li className="flex items-center">
                                <span className="h-1.5 w-1.5 bg-yellow-400 rounded-full mr-2"></span>
                                Click "Resend verification email" above
                            </li>
                            <li className="flex items-center">
                                <span className="h-1.5 w-1.5 bg-yellow-400 rounded-full mr-2"></span>
                                Add our email to your contacts to avoid spam filtering
                            </li>
                        </ul>
                    </div>

                    {/* Additional Info */}
                    <div className="text-center text-xs text-gray-500 animate-fade-in-up animation-delay-400">
                        <p>Once verified, you'll have full access to all features of your account.</p>
                    </div>
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
                
                .animation-delay-1000 {
                    animation-delay: 1s;
                }
            `}</style>
        </>
    );
}