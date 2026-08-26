import { z } from "zod";
import { COOKIE_NAME } from "../shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { countUnreadMessages, createChatMessage, createMediaItem, deleteMediaItem, listChatMessages, listIdentityProfiles, listMedia } from "./db";
import { putMediaFile } from "./storageAdapter";

const identitySchema = z.enum(["Flinter", "Josua"]);
const mediaTypeSchema = z.enum(["image", "video", "audio"]);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  identities: router({
    list: publicProcedure.query(() => listIdentityProfiles()),
  }),
  chat: router({
    list: publicProcedure.query(() => listChatMessages()),
    unread: publicProcedure
      .input(z.object({ viewer: identitySchema, since: z.number().int().nonnegative() }))
      .query(({ input }) => countUnreadMessages(input.viewer, input.since)),
    send: publicProcedure
      .input(z.object({ sender: identitySchema, body: z.string().trim().min(1).max(4000) }))
      .mutation(({ input }) => createChatMessage(input.sender, input.body)),
  }),
  media: router({
    list: publicProcedure
      .input(z.object({ category: z.enum(["galeri", "kenangan"]).optional() }).optional())
      .query(({ input }) => listMedia(input?.category)),
    upload: publicProcedure
      .input(z.object({
        title: z.string().trim().min(1).max(180),
        caption: z.string().trim().max(4000).optional(),
        category: z.enum(["galeri", "kenangan"]),
        mediaType: mediaTypeSchema,
        mimeType: z.string().min(1).max(120),
        fileName: z.string().min(1).max(180),
        base64: z.string().min(1),
        uploadedBy: identitySchema,
        memoryIndex: z.number().int().min(0).max(20).optional(),
      }))
      .mutation(async ({ input }) => {
        const raw = input.base64.replace(/^data:[^;]+;base64,/, "");
        const bytes = Buffer.from(raw, "base64");
        if (bytes.byteLength > 25 * 1024 * 1024) throw new Error("Ukuran file maksimal 25 MB.");
        const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
        const key = `flinter-josua/${input.uploadedBy.toLowerCase()}/${Date.now()}-${safeName}`;
        const stored = await putMediaFile(key, bytes, input.mimeType);
        return createMediaItem({
          title: input.title,
          caption: input.caption || null,
          category: input.category,
          mediaType: input.mediaType,
          fileKey: stored.key,
          fileUrl: stored.url,
          mimeType: input.mimeType,
          uploadedBy: input.uploadedBy,
          memoryIndex: input.category === "kenangan" ? input.memoryIndex ?? 0 : null,
        });
      }),
    delete: publicProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(({ input }) => deleteMediaItem(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
