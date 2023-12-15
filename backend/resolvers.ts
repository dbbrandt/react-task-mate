import { Resolvers, Task,  TaskStatus} from "../generated/graphql";
import { ServerlessMysql } from "serverless-mysql";
import {OkPacket} from "mysql";
import {GraphQLError} from "graphql/error";

const getTaskById = async (db :  ServerlessMysql,  id: number) => {
    const tasks = await db!.query<Task[]>('select * from tasks where id = ?', [id]);
    return tasks.length ? tasks[0] : null;
}
export interface MyContext {
    db: ServerlessMysql;
}

const resolvers: Resolvers<MyContext> = {
    Query: {
        async tasks(parent, args, context) {
            // If status is provided, filter by status; otherwise, return all tasks
            console.log(`***Running tasks*** query with args.status: ${args.status}`);
            let query = 'select  * from tasks';
            if (args.status) query += ` where status = ?`;
            if (!context.db) throw new GraphQLError('Tasks query. DB context is missing.');
            return await context.db.query<Task[]>(query,[args.status]);
        },
        async task(parent, args, context) {
            return getTaskById(context.db,  args.id);
        },
    },
    Mutation: {
        async createTask(parent, args, context) {
            // Create a new task with a unique ID and the provided title
            const query : string = 'insert into tasks (title, status) values(?,?)';
            const queryArgs : string[] = [args.input.title, TaskStatus.Active]
            const result = await context.db.query<OkPacket>(query,  queryArgs);
            console.log(result);

            return {
                id: result.insertId,
                title: args.input.title,
                status: TaskStatus.Active
            }
        },
        async updateTask(parent, args, context) {
            const query: string[] = [];
            let queryArgs : any[] = [];
            if (args.input.title) {
                query.push('title = ?');
                queryArgs.push(args.input.title);
            }
            if (args.input.status) {
                query.push('status = ?');
                queryArgs.push(args.input.status);
            }
            queryArgs.push(args.input.id);
            await context.db!.query<OkPacket>(`update tasks set ${query.join(',')} where id = ?`, queryArgs);
            return await getTaskById(context.db!, args.input.id);
        },
        async deleteTask(parent, args, context) {
            const task = await getTaskById(context.db!, args.id);
            if (!task) throw new GraphQLError('Task not found for delete.');
            await context.db!.query<OkPacket>('delete from tasks where id = ?', args.id);
            return task;
        },
    },
};

export default resolvers;