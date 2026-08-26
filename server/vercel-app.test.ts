import { createServer } from "node:http";
import { afterEach, describe, expect, it } from "vitest";
import { vercelApp } from "./vercelApp";

const servers: ReturnType<typeof createServer>[] = [];

afterEach(async () => {
  await Promise.all(
    servers.splice(0).map(
      server =>
        new Promise<void>(resolve => {
          if (!server.listening) {
            resolve();
            return;
          }
          server.close(() => resolve());
        }),
    ),
  );
});

describe("Vercel Express app", () => {
  it("responds to the health endpoint without a persistent listener", async () => {
    const server = createServer(vercelApp);
    servers.push(server);
    await new Promise<void>(resolve => server.listen(0, "127.0.0.1", () => resolve()));
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Test server did not bind");

    const response = await fetch(`http://127.0.0.1:${address.port}/api/health`);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      ok: true,
      service: "flinter-josua-chat",
      runtime: "vercel",
    });
  });
});
