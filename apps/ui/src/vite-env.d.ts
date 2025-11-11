/// <reference types="vite/client" />

// for importing tailwind css files
declare module "*.css?url" {
  const url: string;
  export default url;
}
