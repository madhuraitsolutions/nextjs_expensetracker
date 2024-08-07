"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function DeleteTransaction(transactionId: string) {

    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const transaction = await prisma.transaction.findUnique({
        where: {
            userId: user.id,
            id: transactionId,
        },
    });

    if (!transaction) {
        throw new Error("Transaction not found");
    }

    // Checking if the account exists
    const accountRow = await prisma.account.findFirst({
        where: {
            userId: user.id,
            name: transaction.account,
        },
    });

    if (!accountRow) {
        throw new Error("Account not found");
    }

    await prisma.$transaction([
        //Delete transaction from db
        prisma.transaction.delete({
            where: {
                userId: user.id,
                id: transactionId,
            },
        }),
        //Update month History
        prisma.monthHistory.update({
            where: {
                day_month_year_userId: {
                    userId: user.id,
                    day: transaction.date.getUTCDate(),
                    month: transaction.date.getUTCMonth(),
                    year: transaction.date.getUTCFullYear(),
                },
            },
            data: {
                ...(transaction.type === "income" && {
                    income: {
                        decrement: transaction.amount,
                    },
                }),
                ...(transaction.type === "expense" && {
                    expense: {
                        decrement: transaction.amount,
                    },
                }),
            },
        }),

        prisma.monthHistory.deleteMany({
            where: {
                userId: user.id,
                day: transaction.date.getUTCDate(),
                month: transaction.date.getUTCMonth(),
                year: transaction.date.getUTCFullYear(),
                income: 0,
                expense: 0,
            },
        }),
        //Update year History
        prisma.yearHistory.update({
            where: {
                month_year_userId: {
                    userId: user.id,
                    month: transaction.date.getUTCMonth(),
                    year: transaction.date.getUTCFullYear(),
                },
            },
            data: {
                ...(transaction.type === "income" && {
                    income: {
                        decrement: transaction.amount,
                    },
                }),
                ...(transaction.type === "expense" && {
                    expense: {
                        decrement: transaction.amount,
                    },
                }),
            },
        }),

        prisma.yearHistory.deleteMany({
            where: {
                userId: user.id,
                month: transaction.date.getUTCMonth(),
                year: transaction.date.getUTCFullYear(),
                income: 0,
                expense: 0,
            },
        }),

        prisma.account.update({
            where: {
                name_userId_accountNumber: {
                    name: transaction.account,
                    userId: user.id,
                    accountNumber: accountRow.accountNumber,
                }
            },
            data: {
                currentBalance: transaction.type === "income" ? accountRow.currentBalance - transaction.amount : accountRow.currentBalance + transaction.amount,
            },
        }),
    ]);
}
