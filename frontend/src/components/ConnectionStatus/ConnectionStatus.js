import { ReadyState } from "react-use-websocket";
import styles from "./ConnectionStatus.module.scss";

const ConnectionStatusIndicator = ({ readyState }) => {
  const getStatusInfo = () => {
    switch (readyState) {
      case ReadyState.CONNECTING:
        return { text: "Connecting", className: styles.connecting };
      case ReadyState.OPEN:
        return { text: "Connected", className: styles.open };
      case ReadyState.CLOSING:
        return { text: "Closing", className: styles.closed };
      case ReadyState.CLOSED:
        return { text: "Disconnected", className: styles.closed };
      default:
        return { text: "Unavailable", className: styles.closed };
    }
  };

  const { text, className } = getStatusInfo();

  return (
    <div className={`${styles.indicator} ${className}`}>
      <span className={styles.dot}></span>
      <span>{text}</span>
    </div>
  );
};

export default ConnectionStatusIndicator;
