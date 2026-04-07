// pages/auth/email-verified.jsx

// React
import { useState } from 'react';
import { Head, router } from '@inertiajs/react';

// Icons
import { FaCheckCircle, FaEnvelope, FaArrowRight, FaSpinner, FaRedoAlt, FaTachometerAlt, FaStar } from 'react-icons/fa';

export default function EmailVerified({ status }) {
    const [resending, setResending] = useState(false);

    const handleGoToDashboard = () => {
        router.get(route('dashboard'));
    };

    const handleResendVerification = () => {
        setResending(true);
        router.post(route('verification.send'), {}, {
            onFinish: () => setResending(false)
        });
    };

    return (
        <>
            <Head title="Email Verified" />
            
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-linear-to-r from-green-400 to-emerald-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-linear-to-r from-teal-400 to-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse animation-delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl"></div>
                
                <div className="max-w-md w-full space-y-8 relative z-10">
                    {/* Success Animation */}
                    <div className="text-center animate-fade-in-up">
                        <div className="flex justify-center mb-4">
                            <div className="bg-linear-to-r from-green-500 to-emerald-600 rounded-full p-4 shadow-lg transform hover:scale-105 transition-transform duration-300 animate-bounce">
                                <FaCheckCircle className="h-12 w-12 text-white" />
                            </div>
                        </div>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Email Verified!
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Your email has been successfully verified. You can now access all features of your account.
                        </p>
                    </div>

                    {/* Success Message Card */}
                    <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in-up animation-delay-100">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-green-100 rounded-full p-2">
                                <FaEnvelope className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-gray-900">Verification Complete</h3>
                                <p className="text-xs text-gray-500">Your account is now fully activated</p>
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-4 mt-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Account Status:</span>
                                <span className="font-medium text-green-600">Verified ✓</span>
                            </div>
                            <div className="flex items-center justify-between text-sm mt-2">
                                <span className="text-gray-600">Access Level:</span>
                                <span className="font-medium text-gray-900">Full Access</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 animate-fade-in-up animation-delay-200">
                        <button
                            onClick={handleGoToDashboard}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                        >
                            <FaTachometerAlt className="h-5 w-5 mr-2" />
                            Go to Dashboard
                            <FaArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                        </button>

                        {status === 'verification-link-sent' && (
                            <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-center text-sm font-medium text-green-700 animate-slide-in">
                                <FaCheckCircle className="inline h-4 w-4 mr-1" />
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>

                    {/* Resend Section */}
                    <div className="text-center border-t border-gray-200 pt-6 animate-fade-in-up animation-delay-300">
                        <p className="text-sm text-gray-600">
                            Didn't receive the email?{' '}
                            <button
                                onClick={handleResendVerification}
                                disabled={resending}
                                className="inline-flex items-center font-medium text-green-600 hover:text-green-700 transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {resending ? (
                                    <>
                                        <FaSpinner className="animate-spin h-4 w-4 mr-1" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <FaRedoAlt className="h-3 w-3 mr-1" />
                                        Click here to resend
                                    </>
                                )}
                            </button>
                        </p>
                        <p className="mt-2 text-xs text-gray-500">
                            Check your spam folder if you don't see the email in your inbox
                        </p>
                    </div>

                    {/* Features Section */}
                    <div className="grid grid-cols-2 gap-3 mt-8 animate-fade-in-up animation-delay-400">
                        <div className="text-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="text-green-600 text-xl mb-1">✓</div>
                            <div className="text-xs font-medium text-gray-900">Full Access</div>
                            <div className="text-xs text-gray-500">All features unlocked</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="text-green-600 text-xl mb-1">🚀</div>
                            <div className="text-xs font-medium text-gray-900">Get Started</div>
                            <div className="text-xs text-gray-500">Explore opportunities</div>
                        </div>
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
                
                @keyframes bounce {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
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
                
                .animate-bounce {
                    animation: bounce 1s ease-in-out 2;
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