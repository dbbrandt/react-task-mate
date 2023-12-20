import {Task} from "../../generated/graphql-frontend";
import Link from "next/link";

interface TaskListProps {
    tasks: Task[]
}
const TaskList: React.FC<TaskListProps> = ({tasks}) => {
    return (
        <ul className="task-list">
            { tasks.map((task) => {
                return (
                    <li className="task-list-item" key={task.id}>
                        <Link className="task-list-item-title" href="/update/[id]" as={`/update/${task.id}`}>
                            {task.title} ({task.status})
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}

export default TaskList;