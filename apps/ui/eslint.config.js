import pluginQuery from "@tanstack/eslint-plugin-query";

export default [
  {
    ignores: ["src/routeTree.gen.ts"],
  },
  ...pluginQuery.configs["flat/recommended"],
];
