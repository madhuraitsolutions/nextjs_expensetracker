"use client";

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { TransactionType } from "@/lib/types";
import { ReactNode } from "react";
import { DialogTitle } from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateTransactionSchema, CreateTransactionSchemaType } from '@/schema/transaction';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface Props {
    trigger: ReactNode;
    type: TransactionType;
}

function CreateTransactionDialog({ trigger, type }: Props) {
    // Initialization: a form instance is being created using the useForm hook, which takes a schema as an argument
    const form = useForm<CreateTransactionSchemaType>({
        // Resolver: The resolver property is set to zodResolver(CreateTransactionSchema). 
        // This indicates that Zod is being used to validate the form data against the schema defined by CreateTransactionSchema.
        resolver: zodResolver(CreateTransactionSchema),
        defaultValues: {
            type,
            date: new Date(),
        }
    })
    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create a new
                        <span
                            className={cn(
                                "m-1",
                                type === "income" ? "text-emerald-500" : "text-rose-500"
                            )}
                        >
                            {type}
                        </span>
                        transaction
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-4'>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input defaultValue={""} {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Transaction Description (Optional)
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateTransactionDialog