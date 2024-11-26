import React, { useState, useEffect } from "react";
import AddTask from "./components/AddTask";
import FilterTask from "./components/FilterTask";
import TaskList from "./components/TaskList";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("");

  // Tải tasks từ localStorage khi component được render lần đầu tiên
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks"); 
    if (savedTasks) {
      // Nếu có dữ liệu, chuyển thành JSON và set vào state
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Cập nhật localStorage mỗi khi tasks thay đổi
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // Thêm task mới
  const addTask = (title) => {
    const newTask = { id: Date.now(), title, completed: false };
    setTasks([...tasks, newTask]);
  };

  // Cập nhật tasks khi người dùng đánh dấu complete/incomplete
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Cập nhật filteredTasks khi người dùng thay đổi filter
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h1>Todo App</h1>
      <div className="container">
        <AddTask onAdd={addTask} />
        <FilterTask onFilter={setFilter} />
        <TaskList tasks={filteredTasks} onToggle={toggleTask} />
      </div>
    </div>
  );
}

export default App;
