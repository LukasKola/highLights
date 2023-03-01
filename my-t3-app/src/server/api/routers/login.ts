import { z } from "zod";


import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
    login: publicProcedure
        .input(z.object({
            email: z.string(),
            password: z.string(),
        }))
        .mutation( async({input, ctx}) => {
            const user = await ctx.prisma.user.findUnique({
                where: {
                    email: input.email
                },
                select: {
                    email: true
                }
            })

            return {
                userToken: 'thisistoken'
            }
        }),
    secureActions: protectedProcedure
        .mutation(({ctx}) => {
            return 'secure action'
        })
})