import React, { createContext, useReducer, useContext, useEffect } from "react";

// Khởi tạo Context
const TaskContext = createContext();

// Định nghĩa reducer
const taskReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TASK":
      return {
        ...state,
        tasks: [
          ...state.tasks,
          { id: Date.now(), title: action.payload, completed: false },
        ],
      };
    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task
        ),
      };
    case "SET_FILTER":
      return {
        ...state,
        filter: action.payload,
      };
    default:
      return state;
  }
};

// Tạo Provider để chia sẻ trạng thái
export const TaskProvider = ({ children }) => {
  const initialState = { tasks: [], filter: "" };

  // Khôi phục dữ liệu từ localStorage khi ứng dụng khởi động
  const loadTasksFromLocalStorage = () => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      return { tasks: JSON.parse(savedTasks), filter: "" }; // Trả về dữ liệu từ localStorage
    }
    return initialState; // Nếu không có dữ liệu, sử dụng giá trị mặc định
  };

  const [state, dispatch] = useReducer(taskReducer, initialState, loadTasksFromLocalStorage);

  // Cập nhật localStorage mỗi khi tasks thay đổi
  useEffect(() => {
    if (state.tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(state.tasks)); // Lưu tasks vào localStorage
    }
  }, [state.tasks]);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

// Hook tiện ích để truy cập Context
export const useTasks = () => useContext(TaskContext);