import { initializeApollo } from "../../lib/apollo";
import {ApolloCache, gql, NormalizedCacheObject, useQuery} from "@apollo/client";
import { Task } from "../../generated/graphql";


const TasksQueryDocument = gql`
  query Tasks {
    tasks {
      id
      title
      status
    }
  }
`;

export async function loader() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: TasksQueryDocument,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}

interface TasksQuery {
  tasks: Task[];
}

interface HomeProps {
  initialApolloState: NormalizedCacheObject;
}


export default function Home({ initialApolloState }: HomeProps) {
  const apolloClient = initializeApollo(initialApolloState);
  const result = useQuery<TasksQuery>(TasksQueryDocument, { client: apolloClient });
  // const tasks = result.data?.tasks;

  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          {/* Render your tasks here */}
        </div>
      </main>
  );
}