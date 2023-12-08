import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import { gql } from 'graphql-tag';
import {NextRequest} from "next/server";
import {IResolvers} from "@graphql-tools/utils";


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
};

const taskList : Task[] = [
    {
        id: 1,
        title: 'First Task',
        status: "active"
    },
    {
        id: 2,
        title: 'Second Task',
        status: "completed"
    }
];

let nextTaskId = taskList.length + 1;

const resolvers: IResolvers<Task, MyContext> = {
    Query: {
        tasks(parent, args: { status?: TaskStatus }, context): Task[] {
            // If status is provided, filter by status; otherwise, return all tasks
            return args.status ? taskList.filter((t) => t.status === args.status) : taskList;
        },
        task(task): Task | null {
            return null;
        },
    },
    Mutation: {
        createTask(parent, args: {input: CreateTaskInput}, context) {
            // Create a new task with a unique ID and the provided title
            const newTask: Task = {
                id: nextTaskId++,
                title: args.input.title,
                status: "active", // default status or based on some logic
            };

            // Add the new task to the task list
            taskList.push(newTask);

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

interface MyContext {
    // Context typing
    token?: String;
}

const server = new ApolloServer<MyContext>({
    resolvers,
    typeDefs,
});

// req has the type NextRequest
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
    context: async req => ({ req }),
});

export { handler as GET, handler as POST };