import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"], // আপনি যদি Node.js এর নতুন ভার্সন ব্যবহার করেন, তবে শুধু 'esm' রাখা ভালো
  target: "esnext",
  outDir: "dist",
  splitting: false,
  sourcemap: true,
  clean: true,
  bundle: true, // এটি অবশ্যই true হতে হবে
  dts: false,
  minify: false,
  shims: false,
  treeshake: false,
});
