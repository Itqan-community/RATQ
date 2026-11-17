// Stand-in for the native sharp binary, which cannot be bundled into a Worker.
// next/image optimisation is off (images.unoptimized), so this is never called.
module.exports = function sharp() {
  throw new Error("sharp is not available in the Worker build");
};
