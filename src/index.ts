import fs from "fs";
import type { Plugin } from "vite";
import type * as E from "esbuild";

interface IOptions {
  displayName?: string;
  jsxImports?: string;
  jsxFrom?: string;
  exportName?: string;
  props?: Record<string, string>;
  opts?: Record<string, string>;
  useMemo?: boolean;
}

export = function svgrPlugin(options?: IOptions): Plugin {
  return {
    name: "vite:svgj",
    async transform(code, id) {
      if (id.endsWith(".svg")) {
        const { render, defaultProps, defaultOpts } = require("svgj");
        const {
          // @ts-ignore
          displayName = "ReactComponent",
          jsxImports = "* as React",
          jsxFrom = "react",
          exportName = displayName,
          props = defaultProps,
          opts = defaultOpts,
          useMemo = false,
        } = options ?? {};
        const esbuild = require("esbuild") as typeof E;
        const svg = await fs.promises.readFile(id, "utf8");

        const componentCode = render(
          svg,
          displayName,
          jsxImports,
          jsxFrom,
          exportName,
          props,
          opts,
          useMemo
        );

        const res = await esbuild.transform(componentCode + "\n" + code, {
          loader: "jsx",
        });

        return {
          code: res.code,
          map: null // provide source map if available
        };
      }
    },
  };
};
