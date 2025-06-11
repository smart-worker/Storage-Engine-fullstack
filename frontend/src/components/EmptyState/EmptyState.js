import React from "react";
import styles from "./EmptyState.module.scss"; // We'll add the styles to the main dashboard SCSS

const EmptyState = () => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.imageContainer}>
        {/* A simple, clean SVG representing tasks or a checklist */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.emptyStateImage}
        >
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <path d="M9 2v4"></path>
          <path d="M15 2v4"></path>
          <path d="M12 11h4"></path>
          <path d="M8 11h.01"></path>
          <path d="M12 16h4"></path>
          <path d="M8 16h.01"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        </svg>
      </div>
      <h2>It's a little quiet in here...</h2>
      <p>
        Get started by clicking the "Add New Task" button to organize your day!
      </p>
    </div>
  );
};

export default EmptyState;
