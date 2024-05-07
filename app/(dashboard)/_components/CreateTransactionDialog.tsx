"use client";

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { TransactionType } from "@/lib/types";
import { ReactNode } from "react";
import { DialogTitle } from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

interface Props {
    trigger: ReactNode;
    type: TransactionType;
}

function CreateTransactionDialog({ trigger, type }: Props) {
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
            </DialogContent>
        </Dialog>
    )
}

export default CreateTransactionDialog