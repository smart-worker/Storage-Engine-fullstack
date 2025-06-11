import React from "react";
import styles from "./Task.module.scss";

const Task = ({ task, handleDeleteTask }) => {
  const { title, description, priority, key } = task;

  const priorityMap = {
    high: styles.priorityHigh,
    medium: styles.priorityMedium,
    low: styles.priorityLow,
  };

  const checkboxId = `task-done-${key}`;
  const priorityClass = priorityMap[priority] || styles.priorityLow;

  const handleMarkAsDone = (event) => {
    const confirmed = window.confirm(
      "Are you sure you want to mark this as done?"
    );

    if (!confirmed) {
      event.preventDefault();
    }
    // No further logic is needed as per the request.
    handleDeleteTask(task.key);
  };

  return (
    <div className={`${styles.taskBox} ${priorityClass}`}>
      <div className={styles.taskContent}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className={styles.taskFooter}>
        <input type="checkbox" id={checkboxId} onClick={handleMarkAsDone} />
        <label htmlFor={checkboxId}>Mark as Done</label>
      </div>
    </div>
  );
};

export default Task;
