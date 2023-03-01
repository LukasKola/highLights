import { create } from "domain";
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
            play: 'ctx.token'
        }
    })

})