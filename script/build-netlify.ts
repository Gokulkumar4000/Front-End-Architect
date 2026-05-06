import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, mkdir } from "fs/promises";

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("Building frontend...");
  await viteBuild();

  console.log("Building Netlify API function...");
  await mkdir("netlify/functions", { recursive: true });

  await esbuild({
    entryPoints: ["server/netlify-handler.ts"],
    bundle: true,
    platform: "node",
    target: "node20",
    format: "cjs",
    outfile: "netlify/functions/api.js",
    external: ["pg-native"],
    define: {
      "process.env.NODE_ENV": '"production"',
    },
  });

  console.log("Build complete!");
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
