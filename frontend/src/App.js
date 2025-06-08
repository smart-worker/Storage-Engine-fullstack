import { useState } from "react";
import { BACK_PORT, LAN_IP } from "./constants";
import "./App.scss";

const BACKEND_URL = `http://${LAN_IP}:${BACK_PORT}/`;

function App() {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [fetchedValue, setFetchedValue] = useState("");

  const handleSet = async () => {
    const response = await fetch(BACKEND_URL + "set", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    const result = await response.json();
    alert(`Set result: ${result.status}`);
  };

  const handleGet = async () => {
    const response = await fetch(`${BACKEND_URL}get/${key}`);
    const result = await response.json();
    setFetchedValue(result.value ?? "Not found");
  };

  return (
    <div className="container">
      <h1>Key-Value Store</h1>

      <div className="form-group">
        <input
          className="input"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <input
          className="input"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button className="button" onClick={handleSet}>
          Set
        </button>
      </div>

      <div className="form-group">
        <button className="button" onClick={handleGet}>
          Get
        </button>
        {fetchedValue && (
          <p className="result">
            Fetched Value: <strong>{fetchedValue}</strong>
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
