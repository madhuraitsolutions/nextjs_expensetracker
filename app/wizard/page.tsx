import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'

async function page() {
    const user = await currentUser(); // get the user data from clerk

    if (!user) {
        redirect("/sign-in"); // if the user is not logged in, redirect to the sign-in page
    }

    return (
        <div className='container flex max-w-2xl flex-col items-center justify-between gap-4'>
            <div>
                <h1 className='text-center text-3xl'>
                    Welcome, <span className='ml-2 font-semibold'>{user.firstName}</span>
                </h1>
                <h2 className='mt-4 text-center text-base text-muted-foreground'>
                    Let&apos;s get started by setting up your currency
                </h2>
                <h3 className='mt-2 text-center text-sm text-muted-foreground'>
                    You can change this settings anytime.
                </h3>
            </div>
            <Separator />
            <Card className='w-full'>
                <CardHeader>
                    <CardTitle>Currency</CardTitle>
                    <CardDescription>
                        Set your preferred currency
                    </CardDescription>
                </CardHeader>
                <CardContent></CardContent>
            </Card>
            <Separator />
            <Button className='w-full' asChild>
                <Link href={"/"}>I&apos;m done! Take me to the dashboard</Link>
            </Button>
            <div className='mt-4'>
                <Logo />
            </div>
        </div>
    )
}

export default page