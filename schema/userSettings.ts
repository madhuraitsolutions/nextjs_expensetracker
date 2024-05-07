import { Currencies } from "@/lib/currencies"
import {z} from "zod"

export const UpdateUserCurrencySchema = z.object({
    currency: z.custom(value =>{
        // validate that the value is a valid currency
        const found = Currencies.some(currency => currency.value === value)
        // if not, throw an error
        if(!found) {
            throw new Error(`invalid currency: ${value}`)
        }
        return value;
    })
})