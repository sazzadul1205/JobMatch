import { Head } from '@inertiajs/react';

import AuthLayout from '@/layouts/auth-layout';

export default function CompleteProfile() {
    return (
        <AuthLayout title="Complete your profile" description="Tell us a bit more to finish setting up your account">
            <Head title="Complete profile" />
            <div />
        </AuthLayout>
    );
}
