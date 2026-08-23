import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { countUnreadSince, getLastReadAt, isIncomingMessage, markChatRead, resetChatRead, switchIdentityReadState, unreadSessionKey } from "../shared/unread";

function caller() {
  const ctx: TrpcContext = {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
  return appRouter.createCaller(ctx);
}

describe("private chat contract", () => {
  it("rejects an unknown identity", async () => {
    await expect(caller().chat.send({ sender: "Misterius" as "Flinter", body: "halo" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects an empty message", async () => {
    await expect(caller().chat.send({ sender: "Flinter", body: "   " })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});

describe("unread notification contract", () => {
  it("uses a separate read key for each identity", () => {
    expect(unreadSessionKey("Flinter")).not.toBe(unreadSessionKey("Josua"));
    expect(isIncomingMessage("Josua", "Flinter")).toBe(true);
    expect(isIncomingMessage("Flinter", "Flinter")).toBe(false);
  });
  it("resets read state when chat is opened", () => {
    const data = new Map<string, string>();
    const storage = { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => void data.set(key, value), removeItem: (key: string) => void data.delete(key) };
    markChatRead(storage, "Flinter", 1000);
    expect(getLastReadAt(storage, "Flinter")).toBe(1000);
    markChatRead(storage, "Flinter", 2000);
    expect(getLastReadAt(storage, "Flinter")).toBe(2000);
  });

  it("does not count messages already visible after marking chat read", () => {
    const visibleAt = 2000;
    const messages = [
      { sender: "Josua" as const, createdAt: 1500 },
      { sender: "Josua" as const, createdAt: 2500 },
      { sender: "Flinter" as const, createdAt: 3000 },
    ];
    expect(countUnreadSince(messages, "Flinter", visibleAt)).toBe(1);
  });

  it("keeps identity read state isolated when switching", () => {
    const data = new Map<string, string>();
    const storage = { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => void data.set(key, value), removeItem: (key: string) => void data.delete(key) };
    markChatRead(storage, "Flinter", 1000);
    markChatRead(storage, "Josua", 3000);
    resetChatRead(storage, "Josua");
    expect(switchIdentityReadState(storage, "Flinter", "Josua")).toBe(0);
    expect(getLastReadAt(storage, "Flinter")).toBe(0);
    expect(getLastReadAt(storage, "Josua")).toBe(0);
  });

  it("rejects an invalid unread viewer", async () => {
    await expect(caller().chat.unread({ viewer: "Unknown" as "Flinter", since: 0 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});

describe("media contract", () => {
  it("rejects an empty title before attempting upload", async () => {
    await expect(caller().media.upload({
      title: "",
      category: "galeri",
      mediaType: "image",
      mimeType: "image/png",
      fileName: "foto.png",
      base64: "data:image/png;base64,AA==",
      uploadedBy: "Josua",
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
