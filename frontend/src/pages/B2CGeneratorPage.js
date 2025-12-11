import { useState } from "react";
import axios from "axios";

export default function B2CGeneratorPage() {
  const [count, setCount] = useState(10);
  const [status, setStatus] = useState("");

  const startGeneration = async () => {
    try {
      await axios.post("http://127.0.0.1:5000/api/leads/generate/b2c", {
        count
      });

      setStatus("Task started! Celery will fetch B2C leads.");
    } catch (err) {
      setStatus("Error occurred.");
    }
  };

  return (
    <div>
      <h2>B2C Lead Generation</h2>

      <input
        type="number"
        value={count}
        onChange={(e) => setCount(e.target.value)}
      />

      <button onClick={startGeneration}>Generate Leads</button>

      {status && <p>{status}</p>}
    </div>
  );
}
