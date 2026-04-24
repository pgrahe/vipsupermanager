const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const root = __dirname;
const host = "127.0.0.1";
const port = Number(process.env.PORT || 3000);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

function sendFile(res, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Internal server error");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url || "/");
  const pathname = decodeURIComponent(parsedUrl.pathname || "/");
  const safePath = pathname === "/" ? "/index.html" : pathname;
  const candidate = path.join(root, safePath);

  // Serve known local assets directly.
  if (candidate.startsWith(root) && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    sendFile(res, candidate);
    return;
  }

  // SPA fallback.
  sendFile(res, path.join(root, "index.html"));
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Try PORT=3001 npm run dev`);
    process.exit(1);
  }

  if (error.code === "EPERM") {
    console.error(`Cannot open local server on ${host}:${port} in this environment.`);
    console.error("Run `npm run dev` directly on your machine to start the OPSNIGHT dev server.");
    process.exit(1);
  }

  throw error;
});

server.listen(port, host, () => {
  console.log(`OPSNIGHT dev server running at http://${host}:${port}`);
});
