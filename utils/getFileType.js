function getFileType(ext) {
  switch (ext) {
    case ".html":
      return "text/html";
    case ".js":
      return "text/javascript";
    case ".css":
      return "text/css";
    case ".json":
      return "application/json";
    case ".png":
      return "image/png";
    case ".jpg":
      return "image/jpg";
    case ".ico":
      return "image/x-icon";
    case ".svg":
      return "image/svg+xml";
    case ".gif":
      return "image/gif";
    case ".txt":
      return "text/plain";
    default:
      throw new Error("File type not supported");
  }
}

module.exports = {
  getFileType,
};
