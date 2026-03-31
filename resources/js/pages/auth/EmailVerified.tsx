// resources/js/pages/auth/EmailVerified.tsx

import { Head, router } from '@inertiajs/react';
import { CheckCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

interface EmailVerifiedProps {
    status?: string;
}

export default function EmailVerified({ status }: EmailVerifiedProps) {
    const handleGoToDashboard = () => {
        router.get(route('dashboard'));
    };

    const handleResendVerification = () => {
        router.post(route('verification.send'));
    };

    return (
        <AuthLayout 
            title="Email Verified" 
            description="Your email has been successfully verified"
        >
            <Head title="Email Verified" />
            
            <div className="flex flex-col items-center justify-center gap-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight">Email Verified!</h1>
                    <p className="text-muted-foreground">
                        Your email has been successfully verified. You can now access all features of your account.
                    </p>
                </div>

                <Button onClick={handleGoToDashboard} className="mt-4 w-full">
                    Go to Dashboard
                </Button>

                {status === 'verification-link-sent' && (
                    <div className="mt-4 rounded-md bg-green-50 p-4 text-sm text-green-800">
                        A new verification link has been sent to your email address.
                    </div>
                )}

                <div className="mt-6 border-t pt-6">
                    <p className="text-muted-foreground text-sm">
                        Didn't receive the email?{' '}
                        <button
                            onClick={handleResendVerification}
                            className="text-primary hover:underline focus:outline-none"
                        >
                            Click here to resend
                        </button>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}