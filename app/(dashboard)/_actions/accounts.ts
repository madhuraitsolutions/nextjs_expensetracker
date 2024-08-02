"use server"

import prisma from "@/lib/prisma";
import { CreateAccountSchema, CreateAccountSchemaType, DeleteAccountSchema, DeleteAccountSchemaType } from "@/schema/account";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateAccount(form: CreateAccountSchemaType) {
    const parsedBody = CreateAccountSchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error("Bad Request");
    }

    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const { name, openingBalance, accountNumber, date, description } = parsedBody.data;

    return await prisma.account.create({
        data: {
            userId: user.id,
            name,
            openingBalance,
            accountNumber,
            date,
            currentBalance: openingBalance, 
            description: description || "" 
        },
    });
}

export async function DeleteAccount(form: DeleteAccountSchemaType) {
    const parsedBody = DeleteAccountSchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error("Bad Request");
    }

    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const transactions = await prisma.transaction.findMany({
        where: {
            account: parsedBody.data.name,
            userId: user.id,
        },
    });

    if (transactions.length > 0) {
        throw new Error("This account has associated transactions and cannot be deleted.");
    } else {
        // If there are no transactions, proceed with deleting the account
        return await prisma.account.delete({
            where: {
                name_userId_accountNumber: {
                    name: parsedBody.data.name,
                    userId: user.id,
                    accountNumber: parsedBody.data.accountNumber,
                },
            },
        });
    }
}