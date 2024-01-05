import {Task} from "../../generated/graphql-frontend";
import TaskListItem from "@/components/TaskListItem";

interface TaskListProps {
    tasks: Task[] | undefined,
    onSuccess: () => void;
}
const TaskList: React.FC<TaskListProps> = ({tasks, onSuccess}) => {
    return (
        <ul className="task-list">
            { tasks && tasks.map((task) => {
                return (
                  <TaskListItem key={task.id} task={task} onSuccess={onSuccess}/>
                )
            })}
        </ul>
    )
}

export default TaskList;