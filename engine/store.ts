import { PrismaClient } from '@prisma/client';

/** One Prisma client per server process; reused across hot reloads in dev. */
const holder = globalThis as unknown as { hssStore?: PrismaClient };

export const store = holder.hssStore ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') holder.hssStore = store;
