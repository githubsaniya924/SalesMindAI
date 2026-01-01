import { useState } from "react";
import axios from "axios";

export default function B2BGeneratorPage() {
  const [industry, setIndustry] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const startGeneration = async () => {
    if (!industry) {
      setStatus("Please enter an industry.");
      return;
    }

    try {
      setLoading(true);
      setStatus("");

      const res = await axios.post(
        "http://127.0.0.1:5000/api/leads/generate_on_demand",
        { industry }
      );

      setStatus(`Task started! Task ID: ${res.data.task_id}`);
    } catch (err) {
      console.error(err);
      setStatus("Failed to start lead generation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "500px" }}>
      <h2>B2B Lead Generation</h2>

      <input
        type="text"
        placeholder="Industry (software, finance...)"
        value={industry}
        onChange={(e) => setIndustry(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <button onClick={startGeneration} disabled={loading}>
        {loading ? "Generating..." : "Generate Leads"}
      </button>

      {status && <p style={{ marginTop: "15px" }}>{status}</p>}
    </div>
  );
}
