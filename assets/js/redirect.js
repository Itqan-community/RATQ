var originalPath =
  window.location.pathname +
  window.location.search +
  window.location.hash;
sessionStorage.setItem("redirectPath", originalPath);
window.location.replace(
  "/index.html" + window.location.search + window.location.hash
);
