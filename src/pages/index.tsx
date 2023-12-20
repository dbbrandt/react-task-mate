import {useQuery} from "@apollo/client";
import {initializeApollo} from "../../lib/apollo";
import {TasksDocument, TasksQuery} from "../../generated/graphql-frontend";
import TaskList from "@/components/TaskList";
import CreateTaskForm from "@/components/CreateTaskForm";

export default function Home() {
    const result = useQuery<TasksQuery>(TasksDocument);
    const tasks = result.data?.tasks;

    return (
        <div>
            <CreateTaskForm onSuccess={result.refetch}/>
            {result.loading ? (
                <p>Loading tasks...</p>
            ) : result.error ? (
                <p>An error occurred.</p>
            ) : tasks && tasks.length > 0 ? (
                <TaskList tasks={tasks} />
            ) : (
                <p className="no-tasks-message">You&apos;ve got no tasks.</p>
            )}
        </div>
    )
}

export const getStaticProps = async () => {
    const apolloClient = initializeApollo();

    await apolloClient.query<TasksQuery>({
        query: TasksDocument,
    });

    return {
        props: {
            initialApolloState: apolloClient.cache.extract(),
        },
    };
};