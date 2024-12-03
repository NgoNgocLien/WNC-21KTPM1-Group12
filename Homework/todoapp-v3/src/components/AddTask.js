import React, { useState } from "react";
import { useTasks } from "../TaskContext";

function AddTask() {
    const [taskTitle, setTaskTitle] = useState("");
    const { addTask } = useTasks();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (taskTitle.trim()) {
            await addTask(taskTitle)
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
