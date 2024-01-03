import {Task} from "../../generated/graphql-frontend";
import TaskListItem from "@/components/TaskListItem";

interface TaskListProps {
    tasks: Task[]
}
const TaskList: React.FC<TaskListProps> = ({tasks}) => {
    return (
        <ul className="task-list">
            { tasks.map((task) => {
                return (
                  <TaskListItem key={task.id} task={task}/>
                )
            })}
        </ul>
    )
}

export default TaskList;