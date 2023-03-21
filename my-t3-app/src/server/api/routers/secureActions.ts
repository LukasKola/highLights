import { User } from "@prisma/client";
import { z } from "zod";
import { prisma } from '../../db'

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";





export const userActions = createTRPCRouter({
    addPlay: protectedProcedure
    .input(z.object({
        url: z.string(),
        content: z.string(),
    }))
    .mutation(({ctx, input}) => {
        const user = ctx.user.someUserdata as User
        console.log(user)
        const highlight = ctx.prisma.highLight.create({
            data: {
                userId: user.id,
                url: input.url || null,
                content: input.content,
                userName: user.name!,
            }
        })
        return  highlight
        
    }),
    userInfo: protectedProcedure
        .query(({ ctx }) => {
            return ctx.user.someUserdata as User
    }),
    userHighLights: protectedProcedure
        .query(async({ ctx }) => {
            const user = ctx.user.someUserdata as User
            const highLights = await ctx.prisma.user.findUnique({
                where: {
                    email: user.email!
                },
                select: {
                    highlights: true
                }
            })
            return highLights
    }),
    liking: protectedProcedure
        .input(z.object({
            highlight: z.string(),
            action: z.string()
        }))
        .mutation(async({ input, ctx}) => {

            type Action = 'like' | 'dislike' | 'nothing'
            let action: Action = 'nothing'

            const user = ctx.user.someUserdata as User
            const prevLikes = await ctx.prisma.highLight.findUnique({
                where: {
                    id: input.highlight
                },
                select: {
                    likes: true
                }
            })

            const prevDislikes = await ctx.prisma.highLight.findUnique({
                where: {
                    id: input.highlight
                },
                select: {
                    dislikes: true
                }
            })
            let dislikes: string  = prevDislikes?.dislikes || ''
            let likes: string  = prevLikes?.likes || ''
            // setting to action variable what action user did or it will stay nothing if no action was done
            if(likes.includes(user.name!)) action = 'like'
            if(dislikes.includes(user.name!)) action = 'dislike'
            if(action !== 'nothing' && action !== input.action){
                action === 'like' ? likes = likes.replace((user.name! + ','), '') : dislikes = dislikes.replace((user.name! + ','), '')
                if(action === 'like'){
                    const removedFromLikes = await ctx.prisma.highLight.update({
                        where: {
                            id: input.highlight
                        },
                        data: {
                            likes: likes
                        }
                    })
                } else {
                    const removedFromDislikes = await ctx.prisma.highLight.update({
                        where: {
                            id: input.highlight
                        },
                        data: {
                            dislikes: dislikes
                        }
                    })
                }
            }
            //funciton for like
            const likeFun = async(highlightID: string, userName: string, alreadyLiked: string) => {

            const liked = await ctx.prisma.highLight.update({
                        where: {
                            id: highlightID
                        },
                        data: {
                            likes: alreadyLiked + userName + ','
                        }
                })
                return liked
            }
            //function for unlike liked highlight
            const unlikeFun = async(highlightID: string, userName: string, alreadyLiked: string) => {
                const newLikes = alreadyLiked.replace((userName + ','),'')
                    const liked = await ctx.prisma.highLight.update({
                        where: {
                            id: highlightID
                        },
                        data: {
                            likes: newLikes
                        }
                    })
                    return liked
            }
            // function for disliking
            const dislikedFun = async(highlightID: string, userName: string, alreadyDisliked: string) => {
                const disliked = await ctx.prisma.highLight.update({
                    where: {
                        id: highlightID
                    },
                    data: {
                        dislikes: alreadyDisliked + userName + ','
                    }
                })
                return disliked
            }
            // function for undislike disliked highlight
            const unDislikedFun = async(highlightID: string, userName: string, alreadyDisliked: string) => {
                const newDislikes = alreadyDisliked.replace((userName + ','), '')

                const disliked = await ctx.prisma.highLight.update({
                    where: {
                        id: highlightID
                    },
                    data: {
                        dislikes: newDislikes
                    }
                })
                return disliked
            }

            if(input.action === action){
                return action === 'like' ? unlikeFun(input.highlight, user.name!, likes) 
                    : unDislikedFun(input.highlight, user.name!, dislikes)
            } else {
                return input.action === 'like' ? likeFun(input.highlight, user.name!, likes) 
                    : dislikedFun(input.highlight, user.name!, dislikes)
            }
        }),
        deleteHighLight: protectedProcedure
        .input(z.object({
            highlightID: z.string()
        }))
        .mutation( async({ ctx, input }) => {
            const deleted = await ctx.prisma.highLight.delete({
                where: {
                    id: input.highlightID
                }
            })
            return deleted
        })  
})