export function applyCors(req, res) {
  const allowedOrigins = [
    "http://localhost:5173",
    "https://news-digest-frontend.vercel.app",
    "https://news-digest-backend.vercel.app"
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  // Optionally, allow all origins in development:
  // res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true; // tells caller to stop further execution
  }

  return false;
}
