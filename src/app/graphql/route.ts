import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import {NextRequest} from "next/server";
import resolvers from "../../../backend/resolvers";
import typeDefs from "../../../backend/typeDefs";
import {db} from "../../../backend/db";

interface MyContext {
    db?: typeof db;
}

const server = new ApolloServer<MyContext>({
    resolvers,
    typeDefs,
});

// req has the type NextRequest
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
    context: async req => ({ req, db }),
});

export { handler as GET, handler as POST };