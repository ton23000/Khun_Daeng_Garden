// Prisma configuration
// See https://pris.ly/d/prisma-config for more options

const config = {
  seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
};

export default config;
