import React from "react";
import AddTask from "./components/AddTask";
import FilterTask from "./components/FilterTask";
import TaskList from "./components/TaskList";
import { TaskProvider } from "./TaskContext";
import "./App.css";

function App() {
  return (
    <TaskProvider>
      <div>
        <h1>Todo App</h1>
        <div className="container">
          <AddTask />
          <FilterTask />
          <TaskList />
        </div>
      </div>
    </TaskProvider>
  );
}

export default App;
