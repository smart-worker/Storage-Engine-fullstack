import { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";

import Task from "../Task/Task";
import styles from "./Dashboard.module.scss";
import { encryptTask, decryptTask } from "../../utils/crypto";
import EmptyState from "../EmptyState/EmptyState";
import ConnectionStatusIndicator from "../ConnectionStatus/ConnectionStatus";

const Dashboard = ({ backend_url, socket_url }) => {
  const [tasks, setTasks] = useState([]);
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

  const handleSet = async (key, value) => {
    try {
      const response = await fetch(backend_url + "set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      const result = await response.json();
      alert(`Set result: ${result.status}`);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSaveTask = () => {
    if (!newTask.title.trim()) {
      alert("Title is required.");
      return;
    }
    try {
      const taskId = Date.now().toString();
      const encryptedTask = encryptTask(newTask);

      if (encryptedTask) {
        handleSet(taskId, encryptedTask);
        setTasks((prevTasks) => [...prevTasks, { key: taskId, ...newTask }]);
      }

      setIsModalOpen(false);
      setNewTask({ title: "", description: "", priority: "low" });
    } catch (e) {
      console.log(e);
    }
  };

  const fetchAllTasks = async () => {
    try {
      const response = await fetch(backend_url + "getAll");
      const result = await response.json();
      let fetchedTasks = [];
      result.forEach(({ key, value }) => {
        if (value)
          fetchedTasks = [...fetchedTasks, { key, ...decryptTask(value) }];
      });
      setTasks(fetchedTasks);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      setTasks((prevTasks) => prevTasks.filter((t) => t.key !== taskId));
      const response = await fetch(`${backend_url}delete/${taskId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result?.status === "ok") alert("Huuraaay! One task less.");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // websocket handling

  const { sendMessage, lastMessage, readyState } = useWebSocket(socket_url, {
    onOpen: () => {
      console.log("✅ WebSocket connection established.");
    },
    shouldReconnect: (closeEvent) => true, // Will attempt to reconnect on all close events
  });

  useEffect(() => {
    if (lastMessage !== null) {
      fetchAllTasks();
    }
  }, [lastMessage]);

  return (
    <div className={styles.dashboard}>
      <header className={styles.dashboardHeader}>
        <h1>Task Manager</h1>
        <div className={styles.headerControls}>
          <ConnectionStatusIndicator readyState={readyState} />
          <button onClick={openModal} className={styles.addTaskBtn}>
            Add New Task
          </button>
        </div>
      </header>

      <div className={styles.tasksContainer}>
        {tasks.length > 0 ? (
          tasks.map((task) => {
            if (!task) return null; // Fails gracefully if decryption fails
            return (
              <Task
                key={task.key}
                task={task}
                handleDeleteTask={(t) => handleDeleteTask(t)}
              />
            );
          })
        ) : (
          <EmptyState />
        )}
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
