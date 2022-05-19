const http = require("http");
const fs = require("fs");
const path = require("path");

const { getFileType } = require("./utils/getFileType");

const server = http.createServer((req, res) => {
  // console.log(req.url);
  if (req.url.startsWith("/api")) {
    const users = [
      { name: "Bob", age: "20" },
      { name: "John", age: "30" },
      { name: "Alice", age: "40" },
    ];
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
  } else {
    // get the requested path
    const requestURL = new URL(req.url, `http://${req.headers.host}`);
    const { pathname: requestPath, searchParams } = requestURL;

    const requestExt = path.extname(requestPath);

    // build file path
    let filePath = path.join(
      __dirname,
      "public",
      requestPath,
      requestExt ? "" : requestPath.endsWith("/") ? "index.html" : "/index.html"
    );

    // Extension of file
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
