import { Separator } from '@/components/ui/separator';
import { currentUser } from '@clerk/nextjs/server'
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
        </div>
    )
}

export default page