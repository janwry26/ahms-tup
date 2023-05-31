import React from "react";

function TaskForUser({ task, onDelete, onUpdate, onComplete }) {
  if (!task || !task.taskDescription) {
    // Return null if the task or taskDescription is undefined
    return null;
  }

  const { taskID, staffID, taskDescription, taskStatus, taskAccomplishDate } = task;

  return (
    <div>
      <h3>Task ID: {taskID}</h3>
      <p>Staff ID: {staffID}</p>
      <p>Description: {taskDescription}</p>
      <p>Status: {taskStatus}</p>
      <p>Accomplish Date: {taskAccomplishDate}</p>
      <button onClick={() => onDelete(taskID)}>Delete</button>
      <button onClick={() => onUpdate(taskID, taskDescription)}>Update</button>
      <button onClick={() => onComplete(taskID)}>Complete</button>
      <hr />
    </div>
  );
}

export default TaskForUser;
