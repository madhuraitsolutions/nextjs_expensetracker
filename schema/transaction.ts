import { z } from "zod";

// Schema Definition
// This schema describes the structure of a transaction object
export const CreateTransactionSchema = z.object({
    amount: z.coerce.number().positive().multipleOf(0.01),
    description: z.string().optional(),
    date: z.coerce.date(),
    category: z.string(),
    type: z.union([z.literal("income"), z.literal("expense")]),
});

// Type Definition
export type CreateTransactionSchemaType = z.infer<typeof CreateTransactionSchema>;