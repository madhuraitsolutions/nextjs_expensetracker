"use server"

import prisma from "@/lib/prisma";
import { CreateCategorySchema, CreateCategorySchemaType, DeleteCategorySchema, DeleteCategorySchemaType } from "@/schema/category";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateCategory(form: CreateCategorySchemaType) {
    const parsedBody = CreateCategorySchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error("Bad Request");
    }

    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const { name, icon, type } = parsedBody.data;

    return await prisma.category.create({
        data: {
            userId: user.id,
            name,
            icon,
            type,
        },
    });
}

export async function DeleteCategory(form: DeleteCategorySchemaType) {
    const parsedBody = DeleteCategorySchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error("Bad Request");
    }

    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const transactions = await prisma.transaction.findMany({
        where: {
            category: parsedBody.data.name,
            userId: user.id,
            type: parsedBody.data.type,
        },
    });

    if (transactions.length > 0) {
        throw new Error("This category has associated transactions and cannot be deleted.");
    } else {
        // If there are no transactions, proceed with deleting the category
        return await prisma.category.delete({
            where: {
                name_userId_type: {
                    name: parsedBody.data.name,
                    userId: user.id,
                    type: parsedBody.data.type,
                },
            },
        });
    }
}