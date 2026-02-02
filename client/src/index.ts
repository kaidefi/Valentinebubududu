import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Vercel maps files differently, verify this path during build
const staticPath = path.resolve(__dirname, "public"); 
app.use(express.static(staticPath));

app.get("*", (_req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

// Remove server.listen
// Export the app for Vercel
export default app;
