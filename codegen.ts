import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:3000/graphql",
  documents: "graphql/**/*.graphql",
  generates: {
    "generated/graphql.ts": {
      plugins: ["typescript", "typescript-resolvers"]
    },
    "generated/graphql-frontend.ts": {
      plugins: ["typescript", "typescript-operations", "typescript-react-apollo"]
    },
  },
};

export default config;
