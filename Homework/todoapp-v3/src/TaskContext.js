import React, { createContext, useReducer, useContext, useEffect } from "react";
import { apiClient } from "./utils/apiClient";

// Khởi tạo Context
const TaskContext = createContext();

// Định nghĩa reducer
const taskReducer = (state, action) => {
  switch (action.type) {
    case "SET_TASKS":
      return { ...state, tasks: action.payload, loading: false };
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload], loading: false };
    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        )
      };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

// Tạo Provider để chia sẻ trạng thái
export const TaskProvider = ({ children }) => {
  const initialState = { tasks: [], filter: "", loading: false};

  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const tasks = await apiClient("http://localhost:8080/tasks");
        dispatch({ type: "SET_TASKS", payload: tasks });
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async (title) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const newTask = await apiClient("http://localhost:8080/tasks", {
        method: "POST",
        body: JSON.stringify({ title }),
      });
      dispatch({ type: "ADD_TASK", payload: newTask });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleTask = async (id) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const updatedTask = await apiClient(
        `http://localhost:8080/tasks/${id}/toggle-status`,
        { method: "PATCH" }
      );
      dispatch({ type: "TOGGLE_TASK", payload: updatedTask });
    } catch (error) {
      console.error("Error toggling task status:", error);
    } finally {
    dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <TaskContext.Provider value={{ state, dispatch, addTask, toggleTask }}>
      {children}
    </TaskContext.Provider>
  );
};

// Hook tiện ích để truy cập Context
export const useTasks = () => useContext(TaskContext);