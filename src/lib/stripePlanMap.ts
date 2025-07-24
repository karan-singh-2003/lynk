import { Plan } from '@/generated/prisma'

export const priceIdToPlan: Record<string, Plan> = {
  price_1RjOVFL2qfTOZYhOwoyLlUDM: 'PRO', // Pro Monthly
  price_1RjOV4L2qfTOZYhO7L2ZAOnW: 'PRO', // Pro Yearly
  price_1RjOVwL2qfTOZYhO2QkGJX51: 'STANDARD', // Standard Monthly
  price_1RjOVaL2qfTOZYhOehZ49OTv: 'STANDARD', // Standard Yearly
}
