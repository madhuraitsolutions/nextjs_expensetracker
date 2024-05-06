import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
    const user = await currentUser(); // get the user data from clerk

    if (!user) {
        redirect("/sign-in"); // if the user is not logged in, redirect to the sign-in page
    }

    let userSettings = await prisma.userSettings.findUnique({
        where: {
            userId: user.id,
        },
    });

    if (!userSettings) {
        userSettings = await prisma.userSettings.create({
            data: {
                userId: user.id,
                currency: "INR",
            }
        })
    }
    // revalidate the home page that uses the user currency
    revalidatePath("/");
    return Response.json(userSettings);
}