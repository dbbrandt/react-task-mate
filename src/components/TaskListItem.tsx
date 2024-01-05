import React, {useEffect} from "react";
import {Task, useDeleteTaskMutation} from "../../generated/graphql-frontend";
import Link from "next/link";

interface TaskItemProps {
    task: Task,
    onSuccess: () => void;
}

const TaskListItem: React.FC<TaskItemProps> = ({task, onSuccess}) => {
    const [deleteTask, { loading, error}] = useDeleteTaskMutation({
        // // Below is a way of handling delete or any update by updating the cache.
        // update(cache: ApolloCache<TasksQuery>, result) {
        //     // Read the current state of the query from the cache
        //     const deleteTask = result.data?.deleteTask;
        //     cache.modify({
        //         fields: {
        //             tasks(taskRefs: ReadonlyArray<Reference>, {readField}) {
        //                 return taskRefs.filter((taskRef) => {
        //                     return readField('id', taskRef) !== deleteTask?.id;
        //                 })
        //
        //             }
        //         }
        //     })
        //
        // },
        onCompleted: () => {
            onSuccess();
        },
        variables: { deleteTaskId: task.id}}
    );

    const handleDelete = async () => {
        await deleteTask();
    }

   useEffect(() => {
       if (error) {
           alert('An error occured, please try again.');
       }

   },[error])

   return (
       <li className="task-list-item" key={task.id}>
           <Link className="task-list-item-title" href="/update/[id]" as={`/update/${task.id}`}>
               {task.title} ({task.status})
           </Link>
           <button className="task-list-item-delete" disabled={loading} onClick={handleDelete}>
               &times;
           </button>
       </li>
   )
}

export default TaskListItem;