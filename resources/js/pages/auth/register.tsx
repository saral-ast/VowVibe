import React, { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        bride_name: '',
        groom_name: '',
        wedding_date: '',
        budget: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create your account" description="Start by entering your details below">
            <Head title="Register" />

            <form onSubmit={submit} className="space-y-4">
                {/* User Details */}
                <div>
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                        id="name"
                        name="name"
                        value={data.name}
                        autoComplete="name"
                        autoFocus
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Wedding Details */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                    <div>
                        <Label htmlFor="bride_name">Bride's Name</Label>
                        <Input
                            id="bride_name"
                            name="bride_name"
                            value={data.bride_name}
                            onChange={(e) => setData('bride_name', e.target.value)}
                            required
                        />
                        <InputError message={errors.bride_name} className="mt-2" />
                    </div>
                    <div>
                        <Label htmlFor="groom_name">Groom's Name</Label>
                        <Input
                            id="groom_name"
                            name="groom_name"
                            value={data.groom_name}
                            onChange={(e) => setData('groom_name', e.target.value)}
                            required
                        />
                        <InputError message={errors.groom_name} className="mt-2" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <Label htmlFor="wedding_date">Wedding Date</Label>
                        <Input
                            id="wedding_date"
                            type="date"
                            name="wedding_date"
                            value={data.wedding_date}
                            onChange={(e) => setData('wedding_date', e.target.value)}
                            required
                        />
                        <InputError message={errors.wedding_date} className="mt-2" />
                    </div>
                    <div>
                        <Label htmlFor="budget">Budget ($)</Label>
                        <Input
                            id="budget"
                            type="number"
                            name="budget"
                            placeholder="e.g., 20000"
                            value={data.budget}
                            onChange={(e) => setData('budget', e.target.value)}
                            required
                        />
                        <InputError message={errors.budget} className="mt-2" />
                    </div>
                </div>

                {/* Password */}
                <div className="pt-4">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex flex-col items-center gap-4 pt-2">
                    <Button className="w-full" disabled={processing}>
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Create Account
                    </Button>
                    <Link
                        href={route('login')}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                        Already have an account?
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}