import React, { useState } from "react";
import { useTasks } from "../TaskContext";

function AddTask() {
    const [taskTitle, setTaskTitle] = useState("");
    const { dispatch } = useTasks();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (taskTitle.trim()) {
            dispatch({ type: "ADD_TASK", payload: taskTitle.trim() });
            setTaskTitle("");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <input
            type="text"
            className="task-input"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Add new task..."
        />
        </form>
    );
}

export default AddTask;
