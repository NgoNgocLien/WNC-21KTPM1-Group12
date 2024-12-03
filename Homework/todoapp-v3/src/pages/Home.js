import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddTask from "./../components/AddTask";
import FilterTask from "./../components/FilterTask";
import TaskList from "./../components/TaskList";
import { TaskProvider } from "./../TaskContext";

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <TaskProvider>
      <div>
        <h1>Todo App</h1>
        <div className="container home">
          <AddTask />
          <FilterTask />
          <TaskList />
          <div className="logout-button">
            <button type="button" className="btn btn-dark" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </TaskProvider>
  );
}

export default Home;