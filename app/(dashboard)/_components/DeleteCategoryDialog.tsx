"use client";

import { Category } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { ReactNode } from 'react'
import { DeleteCategory } from '../_actions/categories';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { TransactionType } from '@/lib/types';

interface Props {
    trigger: ReactNode;
    category: Category;
}

function DeleteCategoryDialog({ category, trigger }: Props) {
    const categoryIdentifier = `${category.type}-${category.name}`;
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: DeleteCategory,
        onSuccess: async () => {
            toast.success(`Category ${category.name} deleted successfully`, {
                id: categoryIdentifier,
            });

            await queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
        },
        onError: (error) => {
            toast.error(`Failed to delete category ${category.name} : ${error.message}`, {
                id: categoryIdentifier,
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
                        This action cannot be undone. All data associated with this category will be deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Canel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            toast.loading(`Deleting category ${category.name}`, {
                                id: categoryIdentifier,
                            });
                            deleteMutation.mutate({
                                name: category.name,
                                type: category.type as TransactionType,
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

export default DeleteCategoryDialog