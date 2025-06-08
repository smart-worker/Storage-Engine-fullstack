import React from "react";
import styles from "./Task.module.scss";

const Task = ({ task }) => {
  const { title, description, priority } = task;

  const priorityMap = {
    high: styles.priorityHigh,
    medium: styles.priorityMedium,
    low: styles.priorityLow,
  };

  const priorityClass = priorityMap[priority] || styles.priorityLow;

  return (
    <div className={`${styles.taskBox} ${priorityClass}`}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default Task;
