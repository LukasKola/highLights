import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { authRouter } from "./routers/login";
import { userActions } from "./routers/userActions";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  authRouter: authRouter,
  secureActions: userActions,
});

// export type definition of API
export type AppRouter = typeof appRouter;
