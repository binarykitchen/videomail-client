// ... and these actually define the runtime mode of Node.js and are
// set either in package.json, via Jest or in the Dockerfile
export const NodeEnvType = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
} as const;
