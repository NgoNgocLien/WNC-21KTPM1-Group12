import React from "react";
import { useTasks } from "../TaskContext";

function FilterTask() {
  const { dispatch } = useTasks();

  return (
    <div className="filter">
      <input
        type="text"
        onChange={(e) => dispatch({ type: "SET_FILTER", payload: e.target.value })}
        placeholder="Filter tasks by name"
      />
    </div>
  );
}

export default FilterTask;
