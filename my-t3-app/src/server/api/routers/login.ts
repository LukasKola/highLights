import { z } from "zod";
import { SignJWT } from "jose";
import * as crypto from 'crypto'
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { User } from "@prisma/client";

const secret = new TextEncoder().encode(
    'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2',
  )

  const alg = 'HS256'

// export type User = {
//     id: string,
//     name: string,
//     email: string,
//     emailVerified: string,
//     image: string,
//     password: string,
//     token: string,
    
// }


export const hashPass = (pass: string) => {
    return crypto.createHash('sha512').update(pass).digest('hex')
}

export const authRouter = createTRPCRouter({
    login: publicProcedure
        .input(z.object({
            email: z.string(),
            password: z.string(),
        }))
        .mutation( async({input, ctx}) => {
            console.log('email input:',input.email)
            const user = await ctx.prisma.user.findUnique({
                where: {
                    email: input.email
                }
            })

            const hashedPass = hashPass(input.password)
            input.password = hashedPass
           
            if(!user) throw new TRPCError({ message: 'Wrong email' ,code: 'UNAUTHORIZED'})

            if(user.password !== input.password) throw new TRPCError({ message: 'Wrong password', code: 'UNAUTHORIZED' })

            const jwt = await new SignJWT({ 'someUserdata': user })
            .setIssuedAt()
            .setProtectedHeader({ alg })
            .setExpirationTime('1h')
            .setIssuer('issuer')
            .setAudience('audience')
            .sign(secret)

            return {
                userToken: jwt
            }
        }),
    secureActions: protectedProcedure
        .mutation(({ctx}) => {
            return ctx.user.someUserdata as User
        }),
    registration: publicProcedure
        .input(z.object({
            name: z.string(),
            email: z.string(),
            password: z.string(),
        }))
        .mutation(async({ input,ctx }) => {
            const hashedPass = hashPass(input.password)
            input.password = hashedPass
            const newcomer = await ctx.prisma.user.create({
                data: {
                    ...input
                }
            })
            return { newcomer }
        })
})