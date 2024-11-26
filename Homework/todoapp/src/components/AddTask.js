import React, { useState } from "react";

function AddTask({ onAdd }) {
    const [taskTitle, setTaskTitle] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (taskTitle.trim()) {
            onAdd(taskTitle.trim());
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
        {/* <button type="submit">Add</button> */}
        </form>
    );
}

export default AddTask;
