import {TaskDocument, TaskQuery, TaskQueryVariables, useTaskQuery} from "../../../generated/graphql-frontend";
import React from "react";
import {GetServerSideProps} from "next";
import {initializeApollo} from "../../../lib/apollo";
import {useRouter} from "next/router";

const UpdateTask : React.FC = () => {
    const router = useRouter();
    const taskId =
        typeof router.query.id === 'string' ? parseInt(router.query.id, 10) : NaN;

    const {data, loading, error} = useTaskQuery({variables: {taskId}})
    const task = data?.task;
    return (
        loading ? <p>Loading....</p> : error ? <p className="alert-error">An error occured.</p> : task ? <p>{task.title}</p> : <p>Task not found.</p>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const taskId =
        typeof context.params?.id === 'string'
            ? parseInt(context.params.id, 10)
            : NaN
    if (taskId) {
        const apolloClient = initializeApollo();
        await apolloClient.query<TaskQuery, TaskQueryVariables>({
            query: TaskDocument,
            variables: { taskId },
        });
        return { props: { initialApolloState: apolloClient.cache.extract() } };
    } else {
        return { notFound: true }
    }
};

export default UpdateTask;