const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const { getFileType } = require("./utils/getFileType");

const users = require("./data/users");

const server = http.createServer((req, res) => {
  const reqURL = new URL(req.url, `http://${req.headers.host}`);

  if (reqURL.pathname.startsWith("/api")) {
    if (reqURL.pathname === "/api/users" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(users));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Not found" }));
    }
  } else {
    const requestExt = path.extname(reqURL.pathname);

    // build file path and add index.html to end of path if file is directory
    let filePath = path.join(
      __dirname,
      "public",
      reqURL.pathname,
      requestExt
        ? ""
        : reqURL.pathname.endsWith("/")
        ? "index.html"
        : "/index.html"
    );

    // Extension of file (includes index.html, unlike requestExt)
    let extname = path.extname(filePath);

    // if the resquest is for a file
    if (extname) {
      fs.readFile(filePath, (err, content) => {
        if (err) {
          if (err.code === "ENOENT") {
            // Page not found
            fs.readFile(
              path.join(__dirname, "public", "404.html"),
              (err, content) => {
                res
                  .writeHead(404, { "Content-Type": "text/html" })
                  .end(content, "utf8");
              }
            );
          } else {
            // Some server error
            res.writeHead(500);
            res.end(`Server Error: ${err.code}`);
          }
        } else {
          // Success
          try {
            res.writeHead(200, { "Content-Type": getFileType(extname) });
            res.end(content, "utf8");
          } catch (error) {
            console.log(error);
          }
        }
      });
    }
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
