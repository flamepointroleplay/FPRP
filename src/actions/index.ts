import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import { env } from "cloudflare:workers";
import { TIERS, tierAtLeast, type Tier } from "../lib/tier";
import {
  approveUser,
  denyUser,
  updateReport as dbUpdateReport,
  getUserById,
  createLoaRequest,
  reviewLoaRequest,
  createResource,
  deleteResource as dbDeleteResource,
  deleteSession,
  setUserStatus,
} from "../lib/db";
import { SESSION_COOKIE } from "../lib/session";

const tierSchema = z.enum(TIERS as [Tier, ...Tier[]]);

function requireUser(context: { locals: App.Locals }) {
  const user = context.locals.user;
  if (!user || user.status !== "active") {
    throw new ActionError({ code: "UNAUTHORIZED", message: "You must be logged in." });
  }
  return user;
}

function requireTier(context: { locals: App.Locals }, minTier: Tier) {
  const user = requireUser(context);
  if (!tierAtLeast(user.tier, minTier)) {
    throw new ActionError({ code: "FORBIDDEN", message: "You don't have access to do that." });
  }
  return user;
}

export const server = {
  logout: defineAction({
    accept: "form",
    handler: async (_input, context) => {
      const db = env.DB;
      const token = context.cookies.get(SESSION_COOKIE)?.value;
      if (token) await deleteSession(db, token);
      context.cookies.delete(SESSION_COOKIE, { path: "/" });
      return { success: true };
    },
  }),

  approveMember: defineAction({
    accept: "form",
    input: z.object({
      userId: z.coerce.number(),
      tier: tierSchema,
      department: z.string().optional(),
      rank: z.string().optional(),
      supervisorId: z.coerce.number().optional(),
    }),
    handler: async (input, context) => {
      requireTier(context, "staff");
      const db = env.DB;
      await approveUser(db, input.userId, {
        tier: input.tier,
        department: input.department || null,
        rank: input.rank || null,
        supervisorId: input.supervisorId ?? null,
      });
      return { success: true };
    },
  }),

  denyMember: defineAction({
    accept: "form",
    input: z.object({ userId: z.coerce.number() }),
    handler: async (input, context) => {
      requireTier(context, "staff");
      const db = env.DB;
      await denyUser(db, input.userId);
      return { success: true };
    },
  }),

  updateReport: defineAction({
    accept: "form",
    input: z.object({
      userId: z.coerce.number(),
      tier: tierSchema,
      department: z.string().optional(),
      rank: z.string().optional(),
      supervisorId: z.coerce.number().optional(),
      status: z.enum(["active", "suspended"]),
    }),
    handler: async (input, context) => {
      const user = requireTier(context, "supervisor");
      const db = env.DB;

      const target = await getUserById(db, input.userId);
      const isDirectReport = target?.supervisorId === user.id;
      const isStaff = tierAtLeast(user.tier, "staff");
      if (!target || (!isDirectReport && !isStaff)) {
        throw new ActionError({ code: "FORBIDDEN", message: "That person doesn't report to you." });
      }

      await dbUpdateReport(db, input.userId, {
        tier: input.tier,
        department: input.department || null,
        rank: input.rank || null,
        supervisorId: input.supervisorId ?? user.id,
      });

      if (input.status !== target.status) {
        await setUserStatus(db, input.userId, input.status);
      }

      return { success: true };
    },
  }),

  submitLoa: defineAction({
    accept: "form",
    input: z.object({
      startDate: z.string(),
      endDate: z.string(),
      reason: z.string().min(1).max(2000),
    }),
    handler: async (input, context) => {
      const user = requireUser(context);
      const db = env.DB;
      await createLoaRequest(db, {
        userId: user.id,
        supervisorId: user.supervisorId,
        startDate: input.startDate,
        endDate: input.endDate,
        reason: input.reason,
      });
      return { success: true };
    },
  }),

  reviewLoa: defineAction({
    accept: "form",
    input: z.object({
      requestId: z.coerce.number(),
      decision: z.enum(["approved", "denied"]),
      note: z.string().max(1000).optional(),
    }),
    handler: async (input, context) => {
      const user = requireTier(context, "supervisor");
      const db = env.DB;
      await reviewLoaRequest(db, input.requestId, {
        status: input.decision,
        reviewedBy: user.id,
        note: input.note || null,
      });
      return { success: true };
    },
  }),

  addResource: defineAction({
    accept: "form",
    input: z.object({
      title: z.string().min(1).max(200),
      url: z.string().url(),
      category: z.string().max(100).optional(),
      visibility: tierSchema,
    }),
    handler: async (input, context) => {
      const user = requireTier(context, "staff");
      const db = env.DB;
      await createResource(db, {
        title: input.title,
        url: input.url,
        category: input.category || null,
        visibility: input.visibility,
        createdBy: user.id,
      });
      return { success: true };
    },
  }),

  deleteResource: defineAction({
    accept: "form",
    input: z.object({ id: z.coerce.number() }),
    handler: async (input, context) => {
      requireTier(context, "staff");
      const db = env.DB;
      await dbDeleteResource(db, input.id);
      return { success: true };
    },
  }),
};
