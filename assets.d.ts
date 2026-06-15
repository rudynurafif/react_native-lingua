// Type declarations for static image assets imported with `import`.
// Lets `import logo from "@/assets/images/logo.png"` type-check.
declare module "*.png" {
  const content: number;
  export default content;
}

declare module "*.jpg" {
  const content: number;
  export default content;
}

declare module "*.svg" {
  const content: number;
  export default content;
}
