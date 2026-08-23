import type { VercelRequest, VercelResponse } from "@vercel/node";
import { vercelApp } from "../server/vercelApp";

export default function handler(req: VercelRequest, res: VercelResponse) {
  return vercelApp(req, res);
}
