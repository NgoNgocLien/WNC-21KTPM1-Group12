import React from "react";
import { useTasks } from "../TaskContext";

function TaskList() {
    const { state, dispatch } = useTasks();
    const { tasks, filter } = state;

    const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <ul className="task-list">
            {filteredTasks.map((task) => (
                <li key={task.id} className={`task-item ${task.completed ? "completed" : ""}`}>
                    <span className="checkbox" onClick={() => dispatch({ type: "TOGGLE_TASK", payload: task.id })}>
                        <i className={`${ task.completed ? "fa-solid fa-circle-check" : "fa-regular fa-circle" }`}></i>
                    </span>
                    <span>{task.title}</span>
                </li>
            ))}
    </ul>
    );
}

export default TaskList;
