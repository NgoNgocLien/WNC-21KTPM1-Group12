import React from "react";
import { useTasks } from "../TaskContext";
import { LoadingIndicator } from "../components/LoadingIndicator";

function TaskList() {
    const { state, toggleTask } = useTasks();
    const { tasks, filter, loading } = state;

    const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="task-list-container">
          {loading ? (
            <LoadingIndicator /> // Hiển thị loading indicator khi đang tải
          ) : (
            <ul className="task-list">
              {filteredTasks.map((task) => (
                <li
                  key={task.id}
                  className={`task-item ${task.completed ? "completed" : ""}`}
                >
                  <span
                    className="checkbox"
                    onClick={() => toggleTask(task.id)}
                  >
                    <i
                      className={`${
                        task.completed
                          ? "fa-solid fa-circle-check"
                          : "fa-regular fa-circle"
                      }`}
                    ></i>
                  </span>
                  <span>{task.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
}

export default TaskList;
