import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
      google?: string;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    googleAuthEnabled: boolean;
}

export default function Login({ status, canResetPassword, googleAuthEnabled }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
            <Head title="Log in" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox id="remember" name="remember" tabIndex={3} />
                        <Label htmlFor="remember">Remember me</Label>
                    </div>

                    <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Log in
                    </Button>

                    {googleAuthEnabled && (
                        <a
                            href="/auth/google/redirect"
                            className="inline-flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                                <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C17 3.3 14.8 2.4 12 2.4A9.6 9.6 0 0 0 2.4 12 9.6 9.6 0 0 0 12 21.6c5.5 0 9.2-3.9 9.2-9.3 0-.6-.1-1.1-.2-1.5H12Z" />
                                <path fill="#34A853" d="M2.4 12c0 3.8 2.2 7.1 5.4 8.7l3-2.4c-.8-.2-1.5-.7-2.1-1.2-1.1-1.1-1.8-3-1.8-5.1s.6-4 1.8-5.1l-3-2.4A9.6 9.6 0 0 0 2.4 12Z" />
                                <path fill="#4A90E2" d="M12 21.6c2.8 0 5.1-.9 6.8-2.5l-3.3-2.6c-.9.6-2.1 1.1-3.5 1.1-2.3 0-4.4-1.6-5.2-3.8l-3 2.4A9.6 9.6 0 0 0 12 21.6Z" />
                                <path fill="#FBBC05" d="M6.8 13.8c-.2-.5-.3-1.2-.3-1.8s.1-1.2.3-1.8l-3-2.4A9.5 9.5 0 0 0 2.4 12c0 1.5.4 2.9 1.1 4.2l3.3-2.4Z" />
                            </svg>
                            Continue with Google
                        </a>
                    )}
                </div>

                <InputError message={errors.google} />

                <div className="text-muted-foreground text-center text-sm">
                    Don't have an account?{' '}
                    <TextLink href={route('register')} tabIndex={5}>
                        Sign up
                    </TextLink>
                </div>
            </form>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                {/* Employer Card */}
                <div className="rounded-xl border p-4 text-sm shadow-sm">
                    <div className="font-semibold mb-2">Employer Demo</div>
                    <div>Email: employer@gmail.com</div>
                    <div>Password: Employer1205</div>
                    <Button
                        type="button"
                        className="mt-3 w-full"
                        onClick={() => {
                            setData('email', 'employer@gmail.com');
                            setData('password', 'Employer1205');
                        }}
                    >
                        Use Employer Account
                    </Button>
                </div>
                    
                {/* Seeker Card */}
                <div className="rounded-xl border p-4 text-sm shadow-sm">
                    <div className="font-semibold mb-2">Seeker Demo</div>
                    <div>Email: seeker@gmail.com</div>
                    <div>Password: Seeker1205</div>
                    <Button
                        type="button"
                        className="mt-3 w-full"
                        onClick={() => {
                            setData('email', 'seeker@gmail.com');
                            setData('password', 'Seeker1205');
                        }}
                    >
                        Use Seeker Account
                    </Button>
                </div>
            </div>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
