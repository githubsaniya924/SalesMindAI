import { useState } from "react";
import axios from "axios";

export default function B2BGeneratorPage() {
  const [industry, setIndustry] = useState("");
  const [status, setStatus] = useState("");

  const startGeneration = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/leads/generate/b2b", {
        industry
      });

      setStatus("Task started! Celery is processing...");
    } catch (err) {
      setStatus("Something went wrong.");
    }
  };

  return (
    <div>
      <h2>B2B Lead Generation</h2>

      <input
        type="text"
        placeholder="Industry (ex: software)"
        value={industry}
        onChange={(e) => setIndustry(e.target.value)}
      />

      <button onClick={startGeneration}>Generate Leads</button>

      {status && <p>{status}</p>}
    </div>
  );
}
