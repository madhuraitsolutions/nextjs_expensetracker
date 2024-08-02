"use client";

import { Account } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { ReactNode } from 'react'
import { DeleteAccount } from '../_actions/accounts';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Props {
    trigger: ReactNode;
    account: Account;
}

function DeleteAccountDialog({ account, trigger }: Props) {
    const accountIdentifier = `${account.name}`;
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: DeleteAccount,
        onSuccess: async () => {
            toast.success(`Account ${account.name} deleted successfully`, {
                id: accountIdentifier,
            });

            await queryClient.invalidateQueries({
                queryKey: ["accounts"],
            });
        },
        onError: (error) => {
            toast.error(`Failed to delete account ${account.name} : ${error.message}`, {
                id: accountIdentifier,
            });
        },
    });

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. All data associated with this account will be deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Canel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            toast.loading(`Deleting account ${account.name}`, {
                                id: accountIdentifier,
                            });
                            deleteMutation.mutate({
                                name: account.name,
                                accountNumber: account.accountNumber,
                            })
                        }}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteAccountDialog