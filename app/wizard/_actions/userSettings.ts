"use server"

import prisma from "@/lib/prisma";
import { UpdateUserCurrencySchema } from "@/schema/userSettings"
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function UpdateUserCurrency(currency:string) {
    // validate the body
    const parsedBody = UpdateUserCurrencySchema.safeParse({currency})

    if(!parsedBody.success) {
        throw parsedBody.error; // throw an error if the body is not valid
    }

    const user = await currentUser();

    if(!user) {
        redirect("/sign-in"); // if the user is not logged in, redirect to the sign-in page
    }

    // update the user settings
    const userSettings = await prisma.userSettings.update({
        where:{
            userId: user.id,
        },
        data: {
            currency,
        },
    });

    return userSettings;

}