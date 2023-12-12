import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import { gql } from 'graphql-tag';
import {NextRequest} from "next/server";
import {IResolvers} from "@graphql-tools/utils";
import mysql from "serverless-mysql";

const typeDefs = gql`
  enum TaskStatus {
    active
    completed
  }

  type Task {
    id: Int!
    title: String!
    status: TaskStatus!
  }

  input CreateTaskInput {
    title: String!
  }

  input UpdateTaskInput {
    id: Int!
    title: String
    status: TaskStatus
  }

  type Query {
    tasks(status: TaskStatus): [Task!]!
    task(id: Int!): Task
  }

  type Mutation {
    createTask(input: CreateTaskInput!): Task
    updateTask(input: UpdateTaskInput!): Task
    deleteTask(id: Int!): Task
  }
`;

type TaskStatus = "active" | "completed" ;

type Task = {
    id: number;
    title: string;
    status: TaskStatus;
};

type CreateTaskInput = {
    title: string;
    status?: TaskStatus;
};

const resolvers: IResolvers<Task, MyContext> = {
    Query: {
        async tasks(parent, args: { status?: TaskStatus }, context) {
            // If status is provided, filter by status; otherwise, return all tasks
            let query = 'select  * from tasks';
            if (args.status) query += ` where status = '${args.status}'`;
            const result : Task[] = await context.db!.query(query);
            return result;
        },
        async task(parent, args, context) {
            console.log(`User: ${process.env.NEXT_PUBLIC_MYSQL_USER}`);
            const result : Task[] = await context.db!.query(`Select * from tasks where id = ${args.id}`);
            return result[0];
        },
    },
    Mutation: {
        createTask(parent, args: {input: CreateTaskInput}, context) {
            // Create a new task with a unique ID and the provided title
            const newTask: CreateTaskInput = {
                title: args.input.title,
                status: args.input.status ? args.input.status : "active", // default status or based on some logic
            };

            // Return the new task
            return newTask;
        },
        updateTask(): Task | null {
            return null;
        },
        deleteTask() {
            return null;
        },
    },
};

const db = mysql({
    config: {
        host: process.env.NEXT_PUBLIC_MYSQL_HOST,
        user: process.env.NEXT_PUBLIC_MYSQL_USER,
        password: process.env.NEXT_PUBLIC_MYSQL_PASSWORD,
        database: process.env.NEXT_PUBLIC_MYSQL_DATABASE,
    }
})

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