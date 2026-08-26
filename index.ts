import { createVercelApp } from "./server/vercelApp";

/**
 * Vercel recognizes this root Express entrypoint automatically.
 * The app factory owns all API routes; this file intentionally does not listen on a port.
 */
const app = createVercelApp();

export default app;
