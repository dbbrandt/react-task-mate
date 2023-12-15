import {useQuery} from "@apollo/client";
import {gql} from "graphql-tag";
import {initializeApollo} from "../../lib/apollo";
import {Task} from "../../generated/graphql";

const TasksQueryDocument = gql`
  query Tasks {
    tasks {
      id
      title
      status
    }
  }
`;

interface TasksQuery {
    tasks: Task[];
}

export default function Home() {
    const result = useQuery<TasksQuery>(TasksQueryDocument);
    const tasks = result.data?.tasks;

    return (
        <div>
            {tasks &&
                tasks.length > 0 &&
                tasks.map((task) => {
                    return (
                        <div key={task.id}>
                            {task.title} ({task.status})
                        </div>
                    );
                })}
        </div>
    )
}

export const getStaticProps = async () => {
    const apolloClient = initializeApollo();

    await apolloClient.query<TasksQuery>({
        query: TasksQueryDocument,
    });

    return {
        props: {
            initialApolloState: apolloClient.cache.extract(),
        },
    };
};