import React, { createContext, useReducer, useContext } from "react";

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
  const [state, dispatch] = useReducer(taskReducer, initialState);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

// Hook tiện ích để truy cập Context
export const useTasks = () => useContext(TaskContext);
