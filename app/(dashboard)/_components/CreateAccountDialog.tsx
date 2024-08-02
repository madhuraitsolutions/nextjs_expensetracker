"use client";

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CreateAccountSchema, CreateAccountSchemaType } from '@/schema/account';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, CircleOff, Loader2, PlusSquare } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import React, { ReactNode, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form';
import data from '@emoji-mart/data';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateAccount } from '../_actions/accounts';
import { Account } from '@prisma/client';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface Props {
    successCallback: (account: Account) => void;
    trigger?: ReactNode
}

function CreateAccountDialog({ successCallback, trigger }: Props) {
    const [open, setOpen] = useState(false);

    const form = useForm<CreateAccountSchemaType>({
        resolver: zodResolver(CreateAccountSchema),
        defaultValues: {
            openingBalance: 0,
            date: new Date(),
            description:""
        }
    });

    const queryClient = useQueryClient();
    const theme = useTheme();

    const { mutate, isPending } = useMutation({
        mutationFn: CreateAccount,
        onSuccess: async (data: Account) => {
            form.reset({
                name: "",
                accountNumber: "",
                description: "",
                openingBalance: 0,
                date: new Date(),
            });

            toast.success(`${data.name} Account created successfully`, {
                id: "create-account",
            });

            successCallback(data);

            await queryClient.invalidateQueries({
                queryKey: ["accounts"],
            });

            setOpen((prev) => !prev);
        },
        onError: () => {
            toast.error("something went wrong", {
                id: "create-account",
            });
        }
    });

    const onSubmit = useCallback((data: CreateAccountSchemaType) => {
        toast.loading("Creating account...", {
            id: "create-account",
        });
        mutate(data);
    }, [mutate]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <Button
                        variant={"ghost"}
                        className='flex border-seprate items-center justify-start rounded-none border-b px-3 py-3 text-muted-foreground'
                    >
                        <PlusSquare className='mr-2 h-4 w-4' />
                        Create New
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create account
                    </DialogTitle>
                    <DialogDescription>
                        Accounts are used to group your transactions
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input defaultValue={""} {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Account Name(Required)
                                    </FormDescription>
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="accountNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Account Number</FormLabel>
                                    <FormControl>
                                        <Input defaultValue={""} {...field} />
                                    </FormControl>
                                    <FormDescription>
                                            Account Number(Required)
                                        </FormDescription>
                                </FormItem>
                            )}
                        />
                        <div className='flex items-center justify-between gap-2'>
                            <FormField
                                control={form.control}
                                name="openingBalance"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Opening Balance</FormLabel>
                                        <FormControl>
                                            <Input defaultValue={"0"} {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Enter the opening balance for this account(Required)
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className='flex flex-col'>
                                        <FormLabel>As On Date</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[200px] pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className='w-auto p-0'>
                                                    <Calendar
                                                        mode='single'
                                                        selected={field.value}
                                                        onSelect={(value) => {
                                                            if (!value) return;
                                                            field.onChange(value);
                                                        }}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormDescription>
                                            Select the date for this balance
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>



                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input defaultValue={""} {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                    </form>
                </Form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant={"secondary"}
                            onClick={() => { form.reset(); }}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isPending}
                    >
                        {!isPending && "Create"}
                        {isPending &&
                            <Loader2 className='animate-spin' />
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateAccountDialog