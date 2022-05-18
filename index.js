const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  // console.log(req.url);
  // if (req.url === "/api/users") {
  //   const users = [
  //     { name: "Bob", age: "20" },
  //     { name: "John", age: "30" },
  //     { name: "Alice", age: "40" },
  //   ];
  //   res.writeHead(200, { "Content-Type": "application/json" });
  //   res.end(JSON.stringify(users));
  // }

  // get the requested path
  const requestURL = new URL(req.url, `http://${req.headers.host}`);
  const { pathname, searchParams } = requestURL;

  // build file path
  let filePath = path.join(
    __dirname,
    "public",
    pathname.endsWith("/") ? `${pathname}/index.html` : pathname
  );

  // Extension of file
  let extname = path.extname(filePath);

  // Initial content type
  let contentType = "text/html";

  // Check ext and set content type
  switch (extname) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
  }

  // Check if content type is text/html
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
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf8");
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
