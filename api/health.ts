export function GET() {
  return Response.json({
    ok: true,
    service: "flinter-josua-chat",
    runtime: "vercel",
  });
}
