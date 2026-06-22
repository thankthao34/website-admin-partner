import express from "express";
import path from "path";

const app = express();
const PORT = 3000;

// Enable JSON parsing if needed
app.use(express.json());

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`[GameHub Server] ${req.method} ${req.url}`);
  next();
});

// Statically serve the workspace root so that index.html, admin/*, partner/* work seamlessly
app.use(express.static(path.resolve('.')));

// Serve root login
app.get("/", (req, res) => {
  res.sendFile(path.resolve('./index.html'));
});

// Explicit routes for fallbacks or nice path matching
app.get("/admin/dashboard", (req, res) => {
  res.sendFile(path.resolve('./admin/dashboard.html'));
});

app.get("/partner/dashboard", (req, res) => {
  res.sendFile(path.resolve('./partner/dashboard.html'));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`GameHub B2B Server running on port ${PORT}`);
});
