import React from "react";

function FilterTask({ onFilter }) {
  return (
    <div className="filter">
      <input
        type="text"
        onChange={(e) => onFilter(e.target.value)}
        placeholder="Filter tasks by name"
      />
    </div>
  );
}

export default FilterTask;
