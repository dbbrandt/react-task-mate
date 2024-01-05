import Head from 'next/head';
import Error from 'next/error';
import {initializeApollo} from '../../lib/apollo'
import {
    TasksDocument,
    TasksQuery,
    TasksQueryVariables,
    TaskStatus,
    useTasksQuery,
} from '../../generated/graphql-frontend';
import TaskList from '../components/TaskList';
import CreateTaskForm from '../components/CreateTaskForm';
import TaskFilter from '../components/TaskFilter';
import {useRouter} from 'next/router';
import {GetServerSideProps} from 'next';

const isTaskStatus = (value: string): value is TaskStatus =>
    Object.values(TaskStatus).includes(value as TaskStatus);


export default function Home() {
    const router = useRouter();
    const valid = (typeof router.query.status === 'string'
        && isTaskStatus(router.query.status))
        || router.query.status === undefined;

    const status =
        // need to type guard status as a valid TaskStatus or undefined for the useTaskQuery variable to pass type checking
        typeof router.query.status === 'string' && isTaskStatus(router.query.status) ?
            router.query.status : undefined;

    const result = useTasksQuery({
        variables: { status },
    });
    const tasks = result.data?.tasks;

    if (!valid) {
        return <Error statusCode={404} />;
    } else {
        return (
            <div>
                <Head>
                    <title>Tasks</title>
                    <link rel="icon" href="/favicon.ico"/>
                </Head>
                <CreateTaskForm onSuccess={result.refetch}/>
                {result.loading && !tasks ? (
                    <p>Loading tasks...</p>
                ) : result.error ? (
                    <p>An error occurred.</p>
                ) : tasks && tasks.length > 0 ? (
                    <TaskList tasks={tasks} onSuccess={result.refetch}/>
                ) : (
                    <p className="no-tasks-message">You&quote;ve got no tasks.</p>
                )}
                <TaskFilter status={status}/>
            </div>
        );
    }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const status =
        typeof context.params?.status === 'string'
            ? context.params.status
            : undefined;

    if (status === undefined || isTaskStatus(status)) {
        const apolloClient = initializeApollo();

        await apolloClient.query<TasksQuery, TasksQueryVariables>({  // Need to add TaskQUeryVariables so the variables is defined below
            query: TasksDocument,
            variables: { status },
        });

        return {
            props: {
                initialApolloState: apolloClient.cache.extract(),
            },
        };
    }
    return { props: {} };
};
