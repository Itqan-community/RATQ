import nextConfig from 'eslint-config-next';

/** @type {import("eslint").Linter.Config[]} */
export default [
  // payload-backend/ is a separate project with its own eslint.config.mjs -
  // it shouldn't be linted against the frontend's rules (generated files
  // like payload-types.ts and migrations aren't meant to pass these checks).
  { ignores: ['payload-backend/**'] },
  ...nextConfig,
];
