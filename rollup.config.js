import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";

const pkg = require("./package.json");
const extensions = [".js", ".jsx", ".ts", ".tsx", ".json"];
const external = [...Object.keys(pkg.peerDependencies || {})];

export default [
  {
    input: "./src/index.ts",
    output: [
      {
        dir: pkg.main,
        format: "cjs",
      },
      {
        dir: pkg.module,
        format: "es",
      },
    ],
    external,
    plugins: [
      peerDepsExternal(),
      nodeResolve({ extensions }),
      commonjs(),
      json({ compact: true }),
      babel({
        include: ["src/**/*", "public/**/*"],
        exclude: ["node_modules/**"],
        babelHelpers: "runtime",
        plugins: ["@babel/plugin-transform-runtime"],
      }),
      typescript({ tsconfig: "./tsconfig.json" }),
      postcss({
        modules: false,
        use: ["sass"],
      }),
      terser(),
    ],
  },
  {
    input: "./src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    external: [/\.(sass|scss|css)$/],
    plugins: [dts.default()],
  },
];
