import { useState, useEffect } from "react";
import Task from "../Task/Task";
import styles from "./Dashboard.module.scss";
import { encryptTask, decryptTask } from "../../utils/crypto";

const initialTasks = [
  {
    title: "Secure High Priority Task",
    description: "This task is now encrypted.",
    priority: "high",
  },
  {
    title: "Secure Medium Priority Task",
    description: "Also encrypted with crypto-js.",
    priority: "medium",
  },
];

const getInitialState = () => {
  const state = {};
  initialTasks.forEach((task, index) => {
    const id = `initial-${index + 1}`;
    state[id] = encryptTask(task);
  });
  return state;
};

const Dashboard = () => {
  const [tasks, setTasks] = useState(getInitialState());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "low",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleSaveTask = () => {
    if (!newTask.title.trim()) {
      alert("Title is required.");
      return;
    }
    const taskId = Date.now().toString();
    const encryptedTask = encryptTask(newTask);

    if (encryptedTask) {
      setTasks((prevTasks) => ({
        ...prevTasks,
        [taskId]: encryptedTask,
      }));
    }

    setIsModalOpen(false);
    setNewTask({ title: "", description: "", priority: "low" });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={styles.dashboard}>
      <header className={styles.dashboardHeader}>
        <h1>Task Manager</h1>
        <button onClick={openModal} className={styles.addTaskBtn}>
          Add New Task
        </button>
      </header>

      <div className={styles.tasksContainer}>
        {Object.entries(tasks).map(([taskId, encryptedTask]) => {
          const task = decryptTask(encryptedTask);
          if (!task) return null; // Fails gracefully if decryption fails
          return <Task key={taskId} task={task} />;
        })}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Create a New Task</h2>
            <div className={styles.formGroup}>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={newTask.description}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={newTask.priority}
                onChange={handleInputChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className={styles.modalActions}>
              <button
                onClick={closeModal}
                className={`${styles.modalBtn} ${styles.cancelBtn}`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTask}
                className={`${styles.modalBtn} ${styles.saveBtn}`}
              >
                Save Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
