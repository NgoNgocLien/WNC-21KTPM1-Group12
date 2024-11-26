import React from "react";

function TaskList({ tasks, onToggle }) {
    return (
        <ul className="task-list">
            {tasks.map((task) => (
                <li key={task.id} className={`task-item ${task.completed ? "completed" : ""}`}>
                    <span className="checkbox" onClick={() => onToggle(task.id)}>
                        <i className={`${task.completed ? "fa-solid fa-circle-check" : "fa-regular fa-circle"}`}></i>
                    </span>
                    <span>{task.title}</span>
                </li>
            ))}
        </ul>
    );
}

export default TaskList;
