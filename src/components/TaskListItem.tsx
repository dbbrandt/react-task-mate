import React, {useEffect} from "react";
import {Task, TasksQuery, useDeleteTaskMutation} from "../../generated/graphql-frontend";
import Link from "next/link";
import {ApolloCache, Reference} from "@apollo/client";

interface TaskItemProps {
    task: Task
}

const TaskListItem: React.FC<TaskItemProps> = ({task}) => {
    const [deleteTask, { loading, error}] = useDeleteTaskMutation({
        update(cache: ApolloCache<TasksQuery>, result) {
            // Read the current state of the query from the cache
            const deleteTask = result.data?.deleteTask;
            cache.modify({
                fields: {
                    tasks(taskRefs: ReadonlyArray<Reference>, {readField}) {
                        return taskRefs.filter((taskRef) => {
                            return readField('id', taskRef) !== deleteTask?.id;
                        })

                    }
                }
            })

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