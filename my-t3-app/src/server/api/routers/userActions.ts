import { User } from "./login";
import { z } from "zod";


import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const userActions = createTRPCRouter({
    addPlay: protectedProcedure
    .mutation(({ctx}) => {
        return {
            play: ctx.user.someUserdata as User
        }
    }),
    userInfo: protectedProcedure
        .query(({ ctx }) => {
            return ctx.user.someUserdata as User
        })

})