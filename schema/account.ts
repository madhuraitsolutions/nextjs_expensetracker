import { z } from "zod";

export const CreateAccountSchema = z.object({
    name: z.string().min(3).max(20),
    openingBalance: z.coerce.number().positive().multipleOf(0.01),
    accountNumber: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
});

export type CreateAccountSchemaType = z.infer<typeof CreateAccountSchema>;

export const DeleteAccountSchema = z.object({
    name: z.string().min(3).max(20),
    accountNumber: z.string(),
});

export type DeleteAccountSchemaType = z.infer<typeof DeleteAccountSchema>;