import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function GET(request: Request) {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const { searchParams } = new URL(request.url);
    const paramType = searchParams.get("type");

    const validator = z.enum(["income", "expense"]).nullable();
    const queryType = validator.safeParse(paramType);
    
    if (!queryType.success) {
        return Response.json(queryType.error, {
            status: 400,
        })
    }

    const type = queryType.data;
    const categories = await prisma.category.findMany({
        where: {
            userId: user.id,
            ...(type && {type}), 
        },
        orderBy: {
            name: "asc",
        },
    });

    return Response.json(categories);
}